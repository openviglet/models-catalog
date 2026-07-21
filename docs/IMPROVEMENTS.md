# Model Catalog — Design rationale (IMPROVEMENTS)

> The *what/why* for **unshipped** sections only. No status tables, no shipped
> implementation reports (those live in `git log` + [CHANGELOG.md](CHANGELOG.md)).
> Status lives only in [ROADMAP.md](ROADMAP.md).

## §I Extended self-hosted / aggregator sources (T4)

The shipped pipeline anchors ids from five cloud vendors' live listing APIs plus
LiteLLM enrichment. The non-cloud rows (`ollama`, `bedrock`, `vertex-ai`) currently
have no *authoritative* live source in the pipeline — they survive only via
carry-forward + LiteLLM, which cannot introduce new ids (the anchoring rule). Add
sources behind the existing `SourceAdapter` contract:

- **Ollama** — the public library index + a local `ollama list` for what's actually
  pulled; kind from the model family.
- **Bedrock** — `ListFoundationModels` (AWS SDK / signed request); maps provider +
  modalities onto the taxonomy.
- **HuggingFace** — for local ONNX embedding models, resolve dimensions + metadata
  from the model card / config.

Each is opt-in and key/credential-gated exactly like the cloud adapters (missing
credential → skip, never fail). This closes the anchoring gap for self-hosted rows.

## §III Branded custom domain for the endpoint (T6)

The endpoint currently lives at the GitHub Pages default
(`openviglet.github.io/models-catalog`). A branded domain (e.g. `models.viglet.org`)
is friendlier for external consumers and decouples the public URL from the repo
name. Add a `public/CNAME`, set `CATALOG_SOURCE_URL` at emit time so the envelope's
`$schema`/`source` + the docs point at the branded host, and update Turing's
`turing.models-catalog.url` default. Because the URL is outward-facing and external
consumers may pin it, keep the old Pages URL resolving (redirect) for a deprecation
window.

## §VI Client libraries / SDKs (T9 JS/TS · T10 Python · T11 Java)

The catalog is "just JSON over HTTPS", so any consumer *can* fetch it directly — but
each one then re-invents the same boilerplate: URL selection (rolling vs pinned
`catalog-v1.json`), flattening entries with their `vendor`, kind/vendor filtering,
and caching. A thin per-language client removes that duplication and gives consumers
a typed surface that tracks the additive schema, without pulling the pipeline in.

Shared design across the three languages, so they stay predictable:

- **Read-only + published-endpoint only.** A client fetches `catalog.json` (or a
  pinned `catalog-vN.json`) — and, once T7/T8 ship, `index.json` / faceted slices for
  smaller payloads — over `fetch`/`HttpClient`/`urllib`. It never touches the pipeline
  or the canonical file, and carries **no pricing** (nothing to expose — the API has none).
- **Typed models mirroring `ModelEntry`.** TS interfaces, Python `dataclass`, Java
  `record`; unknown fields tolerated so a schema addition never breaks an old client
  (matches the additive-schema contract). `version` stays `1`.
- **Same small surface everywhere:** load/refresh, `all()`, `byKind(kind)`,
  `byVendor(vendor)`, `get(vendor, id)`, plus in-memory caching with an optional TTL.
- **Minimal dependencies, matching repo ethos.** JS: zero-dep npm (browser + Node).
  Python: stdlib `urllib` only (no `requests`). Java: JDK `HttpClient` + a tiny JSON
  read (or a single well-scoped parser), no heavy framework.

Each is independently versioned/publishable and its own shippable task (one commit
per language). The Java one generalizes the fetch Turing already hand-rolls for its
model-picker, so it has a first real consumer.
