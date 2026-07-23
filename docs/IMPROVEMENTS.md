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

## §P — Trust, compliance & project health

> Non-code hardening surfaced by an outside review (legal + open-source-project
> lens). The catalog already nails the hard part — provenance and the
> "indicative, verify at the source" pricing discipline. What's thin is
> everything *around* the data: third-party-mark attribution, the licence of the
> data (vs the code), a privacy note for the one surface that phones home, and
> the community-health files a "community-owned reference" is judged by. None of
> these touch the schema or add a runtime dependency.

### §P4 — Ask-widget privacy note

The "Ask the catalog" widget ships enabled (`data-ask-endpoint="default"`) and
POSTs the visitor's question to an external structured-RAG backend
(`turing-demo.viglet.org`). Everything else on the page is self-contained, so a
visitor reasonably assumes nothing leaves the browser. A one-line disclosure at
the input ("your question is sent to Viglet Turing ES to answer it") is the
minimum transparency bar (and the honest one under GDPR-style expectations).

### §P5 — Self-host web fonts

`index.html` pulls Inter / Plus Jakarta Sans / JetBrains Mono from
`fonts.googleapis.com` at runtime, which hands the visitor's IP to a third party
on every load. Self-hosting the font files (still no *build* dependency — just
committed `.woff2` + `@font-face`) squares the page with its own "self-contained,
CORS-open, zero-auth" claim and erases the privacy footnote. Purely additive to
`public/`; keep the same faces so the design is unchanged.

### §P6 — Project-health & governance files

The repo has `LICENSE`, `README`, `CONTRIBUTING` and a mature propose-and-review
pipeline, but lacks the community-health files reviewers and org-adoption
policies (and OpenSSF scorecards) look for: **`SECURITY.md`** (how to report a
vulnerability) and **`CODE_OF_CONDUCT.md`**. Add both, plus a short governance
note making the "community-owned, by Viglet" relationship explicit — who
maintains it and how decisions are made — so the neutrality claim is backed by
visible process, not just assertion.
