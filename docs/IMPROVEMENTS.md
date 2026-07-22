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

## §H — Provider coverage & pricing sources

The per-model `pricing` field (Block F) only carries prices for providers the catalog
actually lists. Two gaps follow: (1) fast-inference hosts, hyperscalers and aggregators the
market uses aren't represented, so their indicative prices are absent; (2) an indicative
price needs a *canonical place to be verified*. T35 (shipped) added the provider
pricing-source registry (`providers.json`) for (2). T36/T37 close (1) the same way T14 added
DeepSeek/xAI/etc.: map the `litellm_provider` in the adapter + seed curated anchoring ids
(pulled from the cached LiteLLM snapshot, so they're real) — LiteLLM then enriches metadata
**and** indicative per-token prices automatically. No prices are hand-typed.

### §H2 — T36 · Onboard inference providers + Qwen + Azure
Groq, Together AI, Fireworks AI, Cerebras, Alibaba Qwen and Azure AI Foundry are all covered
by LiteLLM but dropped today because the adapter's `PROVIDER_TO_VENDOR` map doesn't list them.
Add the mappings + a curated set of anchoring ids per provider (flagship/common models) so the
anchoring rule admits them; LiteLLM fills the rest. Flip each provider's `catalogVendor` in
`providers.json` from null to the new vendor key.

### §H3 — T37 · Onboard aggregators (OpenRouter + Vercel)
Aggregators re-serve *other* vendors' models, so admitting their full pass-through lists would
duplicate and balloon the catalog. Onboard them with a **curated cap** — a small, explicit id
set — and a clear "gateway, not creator" note, so they're represented without distorting the
per-creator identity model. Revisit the cap if there's demand.

### §G1 — T34 · More static landing pages + sitemap
Extend `emit.mjs` with per-capability / per-modality / per-kind landing pages and a
`sitemap.xml` (+ `robots.txt`), so faceted slices become crawlable URLs and the catalog is
easier for search engines and assistants to index and cite. Derived-at-emit like every
other artifact, so it can't drift; zero-dep, no framework.
