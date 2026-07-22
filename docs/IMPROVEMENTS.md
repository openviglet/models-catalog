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

## §F — Cost & commercial offerings

The original bet was identity-not-pricing (STRATEGY §I). It is reversed for one concrete
reason: **Viglet Turing ES needs per-token cost to produce consumption/spend reports**,
and a single provenance-stamped number published next to the model identity is less
fragile than making every consumer join the catalog to a second pricing source. The
whole block is deliberately *bounded* so it doesn't become the maintenance/legal
liability the old stance feared — the price is an **indicative US list reference, not an
authoritative or contract-accurate quote**, and is always optional + sourced.

### §F4 — T33 · Provider consumer plans dataset
Beyond per-API-model pricing, vendors sell **consumer subscription plans** (Claude Pro,
Claude Pro Max 5×/20×, ChatGPT Plus/Pro, Gemini Advanced, …). Exploratory (💭): these are
*not* models, so they can't live in `ModelEntry` — they'd be a **separate dataset**, and
the open scope question is whether a model-identity catalog should own subscription tiers
at all, or whether this belongs in a different resource. Needs a data shape and a
source/verification story before it's more than an idea. US-only to start.

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
