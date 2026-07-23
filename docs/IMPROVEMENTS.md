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

### §P6 — Project-health & governance files

The repo has `LICENSE`, `README`, `CONTRIBUTING` and a mature propose-and-review
pipeline, but lacks the community-health files reviewers and org-adoption
policies (and OpenSSF scorecards) look for: **`SECURITY.md`** (how to report a
vulnerability) and **`CODE_OF_CONDUCT.md`**. Add both, plus a short governance
note making the "community-owned, by Viglet" relationship explicit — who
maintains it and how decisions are made — so the neutrality claim is backed by
visible process, not just assertion.
