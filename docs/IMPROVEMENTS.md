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

### §I2 — T39 · Factual capability attributes (`openWeights` + `parameters`)
Two optional, provenance-gated fields. `openWeights` (open-weight/downloadable vs
proprietary-API-only) is a universal, unambiguous fact that strongly informs *type of use*;
`parameters` (total params) is a fact only for open models — absent for the closed frontier
ones, so it can't be a universal intelligence proxy, but it's useful where known. Both
curated/anchored and omitted rather than guessed. They feed the T38 classification (an
open-weight badge, a size hint).

### §I3 — T40 · Cited intelligence / benchmark index
The honest way to signal "how capable" is not our opinion but a **cited third-party number** —
an Artificial Analysis Intelligence Index, LMArena Elo, or similar — carried like `pricing`:
`indicative` + `source` + `lastVerified`, never invented, "verify at the source". Exploratory
(💭): needs a data source the pipeline can ingest and a verification/licensing story before
it's more than an idea. Would let the tier axis rest on measured capability instead of price.
