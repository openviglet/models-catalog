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

## §J — Live benchmark & performance ingestion

### §J1 — T45 · Live benchmark/performance source (auto-refresh T41)
T41 proved the data path but leaves population **manual** — a maintainer hand-edits
`pipeline/benchmarks.json`. The next step is to fetch the numbers directly from a public,
citable leaderboard (Artificial Analysis, LMArena, or similar) so `benchmarks` + `performance`
refresh without manual editing, reusing T41's fail-safe matching (leaderboard name → catalog
vendor/id; omit rather than mis-attribute) and its exact output shape. Exploratory (💭) because
it hinges on a source with **(a)** an acceptable licence to republish cited numbers and **(b)** a
stable, fetchable shape (an open API/export beats a scrape). Cached as an offline-replayable
snapshot + propose-and-review like every other source, so a bad or stale fetch never silently
publishes — and, since the numbers are still *cited*, the "verify at the source" framing is
unchanged; this only automates how the snapshot is filled.
