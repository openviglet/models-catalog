---
name: roadmap-docs
description: How to maintain the model-catalog roadmap/docs — the four docs/ files (ROADMAP.md, CHANGELOG.md, IMPROVEMENTS.md, STRATEGY.md), their single-responsibility split, the cross-file sync rules, and task numbering via docs/last-task.md. Use whenever adding a new task, marking a task shipped, editing any of those four docs, or picking the next T-number.
---

# Roadmap & docs maintenance

## ⛔ One task, one commit (non-negotiable)

- **One task → one commit.** The moment a task is complete and validated, do the
  doc sync + commit **before touching the next task**. Finishing a task means *the
  commit landed* — code + `ROADMAP`/`CHANGELOG`/`last-task.md` sync in that one commit.
- **A multi-task request is NOT permission to batch.** Run tasks one-at-a-time,
  committing after each. A single giant diff spanning many tasks is the failure this
  rule prevents.
- **Self-check before starting task N+1:** run `git status`/`git log -1`. If the
  previous task's work is not committed, commit it first.

## The four files

Each has one job — never duplicate content between them:

| File | Single responsibility | Granularity |
|---|---|---|
| `docs/ROADMAP.md` | **Task status** — the only source of truth for what's done/active. Unshipped only (📋 designed · 💭 idea · ⏳ partial · 🛠 in-progress). | one line per task |
| `docs/CHANGELOG.md` | What has **shipped** — a searchable index; `git log` is authoritative for detail. | one line per shipped task |
| `docs/IMPROVEMENTS.md` | **Design rationale** (what/why) for *unshipped* sections only. No status markers, no shipped reports. | prose per active section |
| `docs/STRATEGY.md` | Business/positioning (markets, deprecations, bets). | prose |

Reference docs (the *how-to*, not roadmap) live in `docs/references/`:
`api.md` (the public contract) and `pipeline.md` (the maintainer workflow).

## Task numbering

The next free `T<n>` lives in **`docs/last-task.md`**. Read it before adding a task,
use `T<n+1>`, then bump the counter + append a one-line log entry. T-numbers are
**non-contiguous across blocks** — never infer the next number from a block header
range or a `git log` scan. `last-task.md` is a terse index: the counter, the next
**block letter**, and a one-line-per-task log — nothing more.

- **A log entry is exactly ONE line**: `- **T<n> SHIPPED** (Block X §Y — short title) — YYYY-MM-DD.`
  The full implementation story goes in the **commit message** + the **CHANGELOG.md**
  one-liner, never here.
- **CHANGELOG.md (not ROADMAP.md) is authoritative for the real maximum block** —
  ROADMAP lists only unshipped work.

## Cross-file update rules

1. **When a task ships:** move its one-liner from `ROADMAP.md` → `CHANGELOG.md`
   (under its block), and **delete** its design subsection from `IMPROVEMENTS.md`
   (`git log` is the history — don't leave a shipped report behind).
2. **When you add a task:** add the one-liner to `ROADMAP.md` (with `deps` + a
   `→ §x` pointer) and, if it needs design, add the rationale subsection to
   `IMPROVEMENTS.md`. Status lives **only** in `ROADMAP.md`.
3. **Status belongs to exactly one file.** If a status marker in `IMPROVEMENTS.md`
   disagrees with the roadmap files, the roadmap files win — fix/remove the stale one.
4. **Keep entries terse** — what + why + pointer (~1 sentence). Detail goes in
   code/commits.
5. **Strategy ≠ backlog.** Pricing/market/deprecation discussion goes in
   `STRATEGY.md`, never as a numbered task.
6. **Non-goals are binding.** Check `ROADMAP.md` → "Non-goals" before proposing new
   work (no pricing, no runtime dependency, no auto-overwrite, no envelope break).
7. **Commit the instant a task finishes** — doc sync (rules 1–2, bump `last-task.md`)
   in the same commit as the code, so the docs never drift from what shipped. One
   commit per finished task.

## Repo-specific reminders

- **Zero-dependency** pipeline/emit/page — don't introduce npm dependencies.
- **Propose, never auto-overwrite** — the canonical file changes only via
  `npm run regen -- --apply`; CI opens a PR, never merges.
- **Non-pricing** — never add cost/price fields; the LiteLLM adapter strips them.
- **Additive schema** — new `ModelEntry` fields stay optional; `version` stays `1`
  unless the envelope shape breaks (then bump `catalog-vN.json` too).
