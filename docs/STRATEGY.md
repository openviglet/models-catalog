# Model Catalog — Strategy & positioning

> Business/positioning decisions (markets, deprecations, bets). Not a backlog —
> numbered work lives in [ROADMAP.md](ROADMAP.md).

## §I A vendor-neutral market reference — identity, kind, and US list pricing

**The bet.** There is no good open, browsable, *identity-and-kind-first* reference
for "which models exist, of what kind, with what context window and capabilities."
LiteLLM's `model_prices_and_context_window.json` is the de-facto registry but it is
pricing-first and not designed to be browsed. Publishing a free, unauthenticated,
CORS-open, versioned catalog keyed by vendor + kind fills that gap and doubles as a
discoverability/authority asset for **Viglet Turing ES** (the GEO thesis: be the
thing tools and assistants cite when asked "what embedding models does OpenAI
have?").

**Pricing — reversed 2026-07-22.** This catalog originally carried *no* cost or
price: the regeneration pipeline stripped every `*cost*`/`*price*` key, on the
reasoning that pricing changes constantly, varies by contract/region, and is already
tracked by LiteLLM. That stance is **reversed**. The driver is concrete: **Viglet
Turing ES needs per-token cost to generate consumption/spend reports**, and having
every consumer separately join this catalog to a second pricing source is more
fragile than publishing the number once, with provenance, next to the identity it
belongs to. The catalog now carries an **optional per-token US list price** per model,
sourced + `lastVerified` like every other regenerated field. Bounds we accept to keep
the maintenance and legal surface contained:

- **US list price only** — not per-contract, per-region, negotiated or committed-use
  pricing. One public reference number, not a billing engine.
- **Optional + best-effort** — a model with no trusted price omits it (the
  missing-field-beats-wrong rule still holds); a price is never invented.
- **Provenance-gated** — a price publishes only with a `source` + `lastVerified`, and
  only ever through propose-and-review, exactly like identity fields.

LiteLLM stays the upstream we enrich from — we now *keep* its price keys (mapped into
our shape and normalized to per-token USD) instead of stripping them. Implementation
is tracked as **Block F** in [ROADMAP.md](ROADMAP.md).

**Trust model.** The value of a reference is trust, so provenance is first-class
(`sources`/`lastVerified` per entry) and the canonical file is only ever updated via
propose-and-review — a bad upstream fetch must never silently poison the reference.

**Relationship to Viglet Turing ES.** Turing consumes this catalog as its
model-picker reference (remote fetch, offline-tolerant) but does not own it. Keeping
the catalog in its own repo lets it version, publish and evolve independently of the
product release cycle, and lets other tools depend on it without depending on Turing.
