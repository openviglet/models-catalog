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
>
> **Block F — Cost & commercial offerings** shipped in full — the optional indicative
> US-list `pricing` field + schema, LiteLLM pricing enrichment (161 models), pricing
> surfaced across every artifact, and the separate consumer-plans dataset (plans.json)
> (see [CHANGELOG.md](CHANGELOG.md) → Block F).
>
> **Block H — Provider coverage & pricing sources** shipped in full — the provider
> pricing-source registry (providers.json) and onboarding 8 new provider vendors
> (Groq, Together, Fireworks, Cerebras, Qwen, Azure + the OpenRouter/Vercel gateways
> with a curated cap) → 22 vendors / 240 models (see [CHANGELOG.md](CHANGELOG.md) → Block H).

## Block G — Static-site expansion & indexing

> The SPA is already complemented by per-model/per-vendor static pages (T26); extend
> that **zero-dep** emit path rather than adopting a framework. Next.js was considered
> and **rejected** — it would break the foundational zero-dependency bet to solve a
> problem `emit.mjs` already solves. Design rationale → §G.

- **T34** 📋 **More static landing pages + sitemap** — extend `scripts/emit.mjs` (the T26 page generator) with per-capability / per-modality / per-kind static landing pages and a `sitemap.xml` (+ `robots.txt`) so segmented content is individually indexable by search engines and assistants. Zero-dep, derived-at-emit, no framework. deps: — (T26 shipped) → §G1

## Block I — Model classification & discovery

> Help a reader tell what a model is *for* and roughly how capable it is. The derived
> page classification (T38) shipped; the next tasks add the *factual* inputs that make
> a stronger, non-opinionated capability signal possible. Design rationale → §I.

- **T40** 💭 **Cited intelligence / benchmark index (field + shape)** — an optional `benchmarks` object (e.g. an Artificial Analysis Intelligence Index or LMArena Elo) treated exactly like `pricing`: `indicative` + `source` + `lastVerified`, never invented. This is the *honest* "how capable" signal (a cited third-party number, not our verdict). Defines the contract; population is T41. deps: — → §I3
- **T41** 📋 **Benchmark source adapter (populate T40)** — a pipeline `SourceAdapter` that ingests a public, citable capability leaderboard (Artificial Analysis / LMArena) from a periodically-refreshed snapshot into the `benchmarks` field, provenance-stamped (`source` + `lastVerified`), matched to catalog ids. The concrete data path that turns T40 from a shape into real data; opt-in + offline-replayable + propose-and-review like every source. deps: T40 → §I4
- **T42** 📋 **Per-domain benchmark scores** — extend `benchmarks` from one opaque index to a small set of cited per-domain scores (general reasoning, coding/SWE-bench, math), so the capability signal is honest and comparable per use-case rather than a single number. deps: T40 → §I5
- **T43** 💭 **Speed & cost-efficiency axis** — carry cited throughput (tokens/s) + latency (TTFT) from a source, giving a second axis ("fast vs capable") and a derived cost-per-capability view alongside the price tier. Needs a data source; complements T40/T41. deps: — → §I6
- **T44** 📋 **Filter & sort by tier + use-case** — turn the T38 derived classification into interactive discovery: filter chips (use-case tags, tier bands) and sort, mirroring the existing capability/modality filters (T20), serialized into the URL hash. Page-only, factual, zero-dep. deps: — (T38 shipped) → §I7

> The endpoint intentionally stays on its public GitHub Pages URL
> (`openviglet.github.io/model-catalog`) — an unbranded, community-owned home signals
> it is a public resource, not a brand asset.

## Non-goals

- **Pricing is bounded to an indicative US list price.** As of the STRATEGY §I reversal (Block F) the catalog carries an *optional* per-token US **list** price — flagged **indicative, not authoritative** (a reference only, verify with the vendor), provenance-gated and never invented. It is **not** a billing engine: no per-contract, per-region, negotiated or committed-use pricing.
- **No runtime dependency on the pipeline.** It is a local maintenance tool; consumers read the published JSON, not the pipeline.
- **No auto-overwrite / no CI auto-merge.** Regeneration is always propose-and-review (`--apply` only); CI may open a PR but never merges it.
- **No envelope-shape break.** `version` stays `1` — new fields are optional and additive.
