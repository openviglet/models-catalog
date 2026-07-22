# Model Catalog — Design rationale (IMPROVEMENTS)

> The *what/why* for **unshipped** sections only. No status tables, no shipped
> implementation reports (those live in `git log` + [CHANGELOG.md](CHANGELOG.md)).
> Status lives only in [ROADMAP.md](ROADMAP.md).

> **Guardrails these all respect.** **Zero npm dependency** (Node built-ins + inline
> HTML/CSS/JS only), no runtime / server-side query, propose-and-review only, and no
> envelope-shape break (`version` stays `1` — new fields optional and additive). Pricing
> is now in scope but **bounded** to an *indicative US list price* (STRATEGY §I, reversed
> by Block F). Consumer artifacts stay *derived* from the canonical file at emit time, so
> they can never drift from the source of truth.

## §G — Static-site expansion & indexing

The goal — segmented, individually-indexable static pages instead of one SPA — is largely
met already by T26 (per-model/per-vendor pages + `llms.txt`). The scalable path is to
**extend the zero-dep `emit.mjs` generator**, not adopt a framework: Next.js was weighed
and rejected because it would break the foundational zero-dependency bet to solve a
problem the emit path already solves (generating static files from a JSON is a loop, not a
framework need).

### §G1 — T34 · More static landing pages + sitemap
Extend `emit.mjs` with per-capability / per-modality / per-kind landing pages and a
`sitemap.xml` (+ `robots.txt`), so faceted slices become crawlable URLs and the catalog is
easier for search engines and assistants to index and cite. Derived-at-emit like every
other artifact, so it can't drift; zero-dep, no framework.

## §I — Model classification & discovery

Readers want to tell, quickly, what a model is *for* and roughly how capable it is. The hard
constraint: the catalog publishes **facts with provenance, never an invented quality
verdict** — so a subjective "intelligent / less intelligent" label is out (it would be
opinion, decay fast, and erode trust). T38 (shipped) delivered a purely *derived* page view
(use-case tags from kind/capabilities; a tier bucketed from the vendor's own list price — a
transparent market proxy, honestly labelled). The remaining tasks add the *factual inputs*
that a stronger, still-non-opinionated signal needs.

### §I3 — T40 · Cited intelligence / benchmark index (field + shape)
The honest way to signal "how capable" is not our opinion but a **cited third-party number** —
an Artificial Analysis Intelligence Index, LMArena Elo, or similar — carried like `pricing`:
`indicative` + `source` + `lastVerified`, never invented, "verify at the source". This task is
just the *contract* (the `benchmarks` shape); the data comes from T41. Exploratory (💭) because
the shape depends on which source we can ingest under an acceptable licence.

### §I4 — T41 · Benchmark source adapter (populate T40)
T40 is inert without a data path. Add a `SourceAdapter` (same contract as the vendor/LiteLLM
sources) that reads a public, citable leaderboard from a refreshed snapshot and maps its scores
onto catalog ids, stamping `source` + `lastVerified`. Opt-in, offline-replayable, propose-and-
review — a bad or stale fetch can never silently publish, exactly like every other source. The
matching (leaderboard name → catalog vendor/id) is the real work and must fail safe (omit rather
than mis-attribute).

### §I5 — T42 · Per-domain benchmark scores
A single "intelligence" number hides that models are uneven — great at code, weak at math, etc.
Extend `benchmarks` to a few **cited per-domain** scores (general reasoning, coding/SWE-bench,
math) so a reader compares on the axis that matches their use-case. Same provenance discipline;
each score keeps its own source. Honest > tidy.

### §I6 — T43 · Speed & cost-efficiency axis
Capability isn't only "smart" — it's also "fast/cheap enough". Carry cited **throughput**
(tokens/s) and **latency** (time-to-first-token) so the catalog exposes a second axis, and pair
it with the list price for a derived cost-per-capability view. Cited + indicative like pricing;
needs its own data source (often the same leaderboard as T41).

### §I7 — T44 · Filter & sort by tier + use-case
The T38 classification is display-only; make it a discovery tool. Add filter chips (use-case
tags, tier bands) and sorting on the browsable page, reusing the T20 capability/modality filter
machinery and serializing the state into the URL hash (T16), so "show me Frontier reasoning
models" is one click and a shareable link. Page-only, zero-dep, derived from facts already loaded.
