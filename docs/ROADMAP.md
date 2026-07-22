# Model Catalog — Roadmap (active backlog)

> **Single source of truth for task status.** Flat, one line per task.
> Only **unshipped** work lives here (📋 designed · 💭 idea · ⏳ partial · 🛠 in-progress).
> Shipped work moves to [CHANGELOG.md](CHANGELOG.md); design rationale (the
> *what/why* per task) lives in [IMPROVEMENTS.md](IMPROVEMENTS.md); strategy/positioning
> lives in [STRATEGY.md](STRATEGY.md).
>
> **How to pick work:** lowest-numbered task in a block whose `deps` are all shipped.
> The `→` pointer is the section in IMPROVEMENTS.md with the full design. The next
> free `T<n>` lives in [last-task.md](last-task.md).

| Symbol | Meaning |
|---|---|
| 📋 | Designed but not started |
| 💭 | Idea worth exploring; needs design |
| ⏳ | Partial — direction is right, more work remains |
| 🛠 | In progress |

> **Block A — Catalog API + regeneration pipeline** shipped in full — the canonical
> catalog, schema, multi-source regeneration pipeline, emit step and the browsable
> public API (see [CHANGELOG.md](CHANGELOG.md) → Block A; migrated from Viglet Turing ES).
>
> **Block B — Client libraries / SDKs** shipped in full (JS/TS · Python · Java) — see
> [CHANGELOG.md](CHANGELOG.md) → Block B.
>
> **Block C — Web experience & discoverability** shipped in full — permalinks + URL
> state, detail drawer, comparison view, command palette, capability/modality filters +
> sortable columns, and the insights dashboard (see [CHANGELOG.md](CHANGELOG.md) → Block C).
>
> **Block D — API surface expansion** shipped in full — the change feed (changes.json +
> Atom feed.xml), CSV/NDJSON exports, stats.json, capability/modality slices + aliases.json,
> the GEO/citability layer (llms.txt + per-vendor/model pages) and the embeddable badge
> (see [CHANGELOG.md](CHANGELOG.md) → Block D).
>
> **Block E — Community & contribution** shipped in full — the "propose a model" flow
> (issue form + CONTRIBUTING + site Contribute section with per-model deep links) and the
> per-vendor coverage/gaps view (coverage.json + heatmap) (see [CHANGELOG.md](CHANGELOG.md)
> → Block E).

## Block F — Cost & commercial offerings

> Reverses the original non-pricing bet (STRATEGY §I): the catalog now carries an
> **optional, indicative US list price** so **Viglet Turing ES** can generate
> consumption/spend reports without every consumer joining to a second source. Bounded
> to US list price, optional, provenance-gated, and flagged **indicative — not
> authoritative** (verify with the vendor). Design rationale → §F.

- **T30** 📋 **Pricing field + schema (strategy reversal)** — add an optional `pricing` object to `ModelEntry` (per-token `inputPer1M`/`outputPer1M` in `USD`, `unit`, `source` + `lastVerified`, plus an `indicative: true` / disclaimer note that it is a non-authoritative US list price), additive to the Draft-2020-12 schema (`version` stays `1`). Foundational for the block. deps: — → §F1
- **T31** 📋 **Pipeline pricing enrichment** — the LiteLLM adapter stops stripping `*cost*`/`*price*` keys and instead maps them into the `pricing` shape (normalized to per-token USD, provenance-stamped); `overrides.json` can pin/correct a price; missing-field-beats-wrong still holds (no invented prices). deps: T30 → §F2
- **T32** 📋 **Surface pricing across the public artifacts** — render `pricing` in the detail drawer + comparison view + an optional page column, per-model/per-vendor pages, CSV/NDJSON columns and `stats.json`/coverage; document it in `api.md` + the client SDK READMEs, each carrying the "indicative, verify with vendor" caveat. deps: T31 → §F3
- **T33** 💭 **Provider consumer plans dataset** — beyond per-API-model pricing, publish the vendors' **consumer subscription plans** (e.g. Claude Pro, Claude Pro Max 5×/20×, ChatGPT Plus/Pro, Gemini Advanced), US-only, as a **separate dataset** (not `ModelEntry` — plans aren't models). Exploratory: needs a data shape, a source/verification story and a scope decision (does a model-identity catalog own subscription tiers at all?). deps: — → §F4

## Block G — Static-site expansion & indexing

> The SPA is already complemented by per-model/per-vendor static pages (T26); extend
> that **zero-dep** emit path rather than adopting a framework. Next.js was considered
> and **rejected** — it would break the foundational zero-dependency bet to solve a
> problem `emit.mjs` already solves. Design rationale → §G.

- **T34** 📋 **More static landing pages + sitemap** — extend `scripts/emit.mjs` (the T26 page generator) with per-capability / per-modality / per-kind static landing pages and a `sitemap.xml` (+ `robots.txt`) so segmented content is individually indexable by search engines and assistants. Zero-dep, derived-at-emit, no framework. deps: — (T26 shipped) → §G1

> The endpoint intentionally stays on its public GitHub Pages URL
> (`openviglet.github.io/model-catalog`) — an unbranded, community-owned home signals
> it is a public resource, not a brand asset.

## Non-goals

- **Pricing is bounded to an indicative US list price.** As of the STRATEGY §I reversal (Block F) the catalog carries an *optional* per-token US **list** price — flagged **indicative, not authoritative** (a reference only, verify with the vendor), provenance-gated and never invented. It is **not** a billing engine: no per-contract, per-region, negotiated or committed-use pricing.
- **No runtime dependency on the pipeline.** It is a local maintenance tool; consumers read the published JSON, not the pipeline.
- **No auto-overwrite / no CI auto-merge.** Regeneration is always propose-and-review (`--apply` only); CI may open a PR but never merges it.
- **No envelope-shape break.** `version` stays `1` — new fields are optional and additive.
