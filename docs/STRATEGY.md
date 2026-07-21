# Model Catalog — Strategy & positioning

> Business/positioning decisions (markets, deprecations, bets). Not a backlog —
> numbered work lives in [ROADMAP.md](ROADMAP.md).

## §I A vendor-neutral market reference — identity + kind, not pricing

**The bet.** There is no good open, browsable, *identity-and-kind-first* reference
for "which models exist, of what kind, with what context window and capabilities."
LiteLLM's `model_prices_and_context_window.json` is the de-facto registry but it is
pricing-first and not designed to be browsed. Publishing a free, unauthenticated,
CORS-open, versioned catalog keyed by vendor + kind fills that gap and doubles as a
discoverability/authority asset for **Viglet Turing ES** (the GEO thesis: be the
thing tools and assistants cite when asked "what embedding models does OpenAI
have?").

**Deliberately not pricing.** The catalog carries identity, kind, context/output
windows, dimensions, modalities, capability hints and lifecycle — **never cost or
price**. Pricing changes constantly, varies by contract/region, and is exactly what
LiteLLM already tracks; competing there adds maintenance burden and legal surface
for no strategic gain. The regeneration pipeline enforces this: the LiteLLM adapter
strips every `*cost*`/`*price*` key. This non-pricing stance is a standing product
decision, not a task.

**Trust model.** The value of a reference is trust, so provenance is first-class
(`sources`/`lastVerified` per entry) and the canonical file is only ever updated via
propose-and-review — a bad upstream fetch must never silently poison the reference.

**Relationship to Viglet Turing ES.** Turing consumes this catalog as its
model-picker reference (remote fetch, offline-tolerant) but does not own it. Keeping
the catalog in its own repo lets it version, publish and evolve independently of the
product release cycle, and lets other tools depend on it without depending on Turing.
