# Public Model Catalog API — contract reference

> The catalog is published as an open, CORS-enabled, versioned JSON artifact via
> GitHub Pages from this repo (`.github/workflows/publish.yml`). Base URL:
> `https://openviglet.github.io/model-catalog` — the endpoint intentionally stays on
> its public GitHub Pages host, so it reads as a community-owned resource rather than a
> brand asset. (The emitted URLs are still overridable via `CATALOG_SOURCE_URL` at emit
> time if a deployment ever needs a different host.)

## What it is

A **vendor-neutral, kind-aware catalog of LLM/embedding/rerank/media models** —
which model ids exist per vendor and, for each, what *kind* it is (chat,
embedding, rerank, image, transcription, speech, video, moderation), plus context
window, max output tokens, embedding dimensions, modalities and capability hints.
Published as an open, CORS-enabled, versioned JSON artifact so any tool can consume
it as a market reference (the role LiteLLM's `model_prices_and_context_window.json`
plays for pricing, but identity/kind-first and browsable).

It is **free, unauthenticated, and read-only.** First cut is *identity + kind +
capability* — **not pricing** (see [STRATEGY.md](../STRATEGY.md) §I).

## Endpoints

| URL | Meaning |
|---|---|
| `…/catalog.json` | Rolling latest — the current schema version. |
| `…/catalog-v1.json` | Pinned to schema **v1** — safe for external consumers to lock. |
| `…/index.json` | **Compact index** — the same envelope, each entry trimmed to `{ vendor, id, label, kind }`. A fraction of the payload for model-pickers that only render a grouped list; lazy-load the full record from `catalog.json` on selection. |
| `…/stats.json` | **Aggregate metrics** — pre-computed counts (models per vendor / kind / capability / input+output modality), per-field fill **coverage**, and grand `totals`. Read one number instead of re-aggregating the full catalog. Its own envelope (not a `vendors` map). |
| `…/by-kind/<KIND>.json` | **Faceted slice** — the full catalog filtered to one `kind` (e.g. `by-kind/EMBEDDING.json`). Same envelope, plus a `kind` field. Fetch one facet instead of downloading everything and filtering client-side. |
| `…/by-vendor/<vendor>.json` | **Faceted slice** — the full catalog filtered to one vendor (e.g. `by-vendor/openai.json`). Same envelope, plus a `vendor` field. |
| `…/endpoints.json` | **Discovery manifest** — a machine-readable map of every published path (absolute URLs): `latest`, `pinned`, `index`, `stats`, `schema`, and the available `byKind` / `byVendor` slice keys. Read this to discover the surface rather than hard-coding paths. |
| `…/catalog.schema.json` | The JSON Schema (Draft 2020-12) describing the envelope + entry. |
| `…/` (repo Pages root) | Human-browsable reference page (`public/index.html`). |

> **Faceted slices are static, not a query API.** They are pre-computed at publish
> time from the canonical file — `by-kind` / `by-vendor` cover the common facets with
> zero runtime. Arbitrary/compound queries are intentionally **out of scope**: GitHub
> Pages serves static assets only (a dynamic query API would need a separate serverless
> runtime — see the roadmap non-goals). Every slice keeps the same `vendors`-map
> envelope as `catalog.json`, so one parser reads them all, and each still validates
> against the schema.

**Serving.** Hosted on **GitHub Pages**, which serves every asset with
`Access-Control-Allow-Origin: *`, so the endpoint is **CORS-open by default** — no
header config needed. Cache is host-managed. Breaking schema changes bump the
pinned path (`catalog-v2.json`); `catalog.json` always tracks the newest. The files
are regenerated deterministically from the canonical source
(`catalog/model-catalog.json`) on every publish, so they never drift.

## Envelope

```jsonc
{
  "$schema": "https://openviglet.github.io/model-catalog/catalog.schema.json",
  "version": 1,                 // schema major version (integer)
  "lastUpdated": "2026-07-21",  // ISO-8601 date the catalog was regenerated
  "source": "https://openviglet.github.io/model-catalog",
  "vendors": {
    "openai":    [ /* ModelEntry, ... */ ],
    "anthropic": [ /* ModelEntry, ... */ ],
    "gemini":    [ /* ... */ ]
    // keyed by provider plugin type (lower-case)
  }
}
```

## `ModelEntry`

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | ✅ | The exact id sent to the vendor (`text-embedding-3-large`). |
| `label` | string | ✅ | Human-friendly display name. |
| `kind` | enum | ✅ | `CHAT` · `EMBEDDING` · `RERANK` · `IMAGE` · `TRANSCRIPTION` · `SPEECH` · `VIDEO` · `MODERATION` · `UNKNOWN`. |
| `vendor` | string | ✅ | Provider plugin type (echoes the map key; added in the published artifact). |
| `contextWindow` | integer | — | Max context tokens, when known. |
| `embeddingDimensions` | integer | — | Output vector size — only for `kind = EMBEDDING`. |
| `capabilities` | string[] | — | Hints such as `vision`, `tools`, `reasoning`. |
| `deprecated` | boolean | — | `true` when the vendor has retired/superseded the id. |
| `maxOutputTokens` | integer | — | Max tokens emittable in one response, when known. |
| `modalities` | object | — | `{ input: string[], output: string[] }` — supported I/O modalities. |
| `knowledgeCutoff` | string | — | Training knowledge cutoff (ISO date or `YYYY-MM`). |
| `releaseDate` | string | — | ISO-8601 date the id became available. |
| `aliases` | string[] | — | Alternate ids that resolve to this model (dated snapshots, `-latest`). |
| `status` | enum | — | `PREVIEW` · `GA` · `DEPRECATED` · `RETIRED` — lifecycle stage; prefer over `deprecated`. |
| `sources` | string[] | — | Provenance — source ids that contributed fields (`openai-api`, `litellm`, `overrides`). |
| `lastVerified` | string | — | ISO-8601 date the entry was last confirmed against its sources. |

> **Envelope stays `version: 1`.** All fields below `deprecated` are **optional and
> additive** — existing consumers ignore unknown keys. They are populated by the
> regeneration pipeline ([pipeline.md](./pipeline.md)); hand entries may omit them.

## Usage examples

```bash
# every embedding model across all vendors
curl -s https://openviglet.github.io/model-catalog/catalog-v1.json \
  | jq '.vendors | to_entries[].value[] | select(.kind=="EMBEDDING") | .id'
```

```js
// browser / Node — kind lookup for an arbitrary id
const { vendors } = await (await fetch(
  "https://openviglet.github.io/model-catalog/catalog-v1.json",
)).json()
const all = Object.values(vendors).flat()
const kindOf = (id) => all.find((m) => m.id === id)?.kind ?? "UNKNOWN"
```

## Aggregate metrics (`stats.json`)

A small, separately-shaped artifact (not a `vendors` map) with everything pre-counted,
so a dashboard, a README badge or a coverage view reads one number instead of walking
the whole catalog. Regenerated at emit, so it never drifts. Count maps are ordered by
descending count; `coverage.fields.<field>` is `{ filled, rate }` over all models.

```jsonc
{
  "version": 1,
  "lastUpdated": "2026-07-21",
  "source": "https://openviglet.github.io/model-catalog",
  "totals": { "models": 194, "vendors": 14, "kinds": 8, "capabilities": 4 },
  "byVendor":         { "openai": 129, "gemini": 8, /* … */ },
  "byKind":           { "CHAT": 136, "SPEECH": 22, /* … */ },
  "byCapability":     { "tools": 136, "vision": 101, /* … */ },
  "byInputModality":  { "text": 174, "image": 103, /* … */ },
  "byOutputModality": { "text": 78, "embedding": 15, /* … */ },
  "coverage": {
    "total": 194,
    "fields": { "contextWindow": { "filled": 180, "rate": 0.9278 }, /* … */ }
  }
}
```

## How consumers use it

Any tool can fetch the endpoint directly. **Viglet Turing ES** fetches
`turing.model-catalog.url` (default the rolling endpoint) with an ETag/TTL cache
as its model-picker catalog. The live per-vendor `/v1/models` listing path and
Turing's metadata-first kind classification are unchanged — the public catalog only
provides the static reference.

## Relationship to other artifacts

- **Source of truth:** `catalog/model-catalog.json` in this repo; this doc is its
  published contract.
- **Regeneration:** [pipeline.md](./pipeline.md) — the multi-source, propose-and-review pipeline.
- **Positioning:** [STRATEGY.md](../STRATEGY.md) §I (why this is a discoverability asset).
