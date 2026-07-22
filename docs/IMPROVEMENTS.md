# Model Catalog — Design rationale (IMPROVEMENTS)

> The *what/why* for **unshipped** sections only. No status tables, no shipped
> implementation reports (those live in `git log` + [CHANGELOG.md](CHANGELOG.md)).
> Status lives only in [ROADMAP.md](ROADMAP.md).

> **Guardrails these all respect.** Every task below is inline HTML/CSS/JS or an
> emitted static file — **no build step, no runtime, no npm dependency, no server-side
> query**, no pricing, and no envelope-shape break (`version` stays `1`). New consumer
> artifacts are *derived* from the canonical file at emit time, exactly like today's
> `index.json` / faceted slices, so they can never drift from the source of truth.

_No active design sections — every planned block (A–E) has shipped. When new work is
proposed, add its rationale here under a new `## §<letter>` heading and track status in
[ROADMAP.md](ROADMAP.md)._
