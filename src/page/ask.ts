/* "Ask the catalog" widget (T61).
 *
 * An OPTIONAL chat box on the orient surface that POSTs a plain-language question
 * to a configurable structured-RAG backend and renders the grounded answer with
 * **cited model deep-links** — each returned citation id resolves to the T17 drawer
 * (`#vendor/id`, opened by the hash router in controls.ts). It stays HIDDEN unless
 * `#ask[data-ask-endpoint]` is set: an empty attribute → the section never shows and
 * the site stays fully self-contained + zero-dep. The literal value "default" targets
 * the turing-demo.viglet.org catalog copilot; any other value is used verbatim. No API
 * key ever lives in the page — the backend holds it; the widget only sends the question. */
import { byId, esc, elClosest } from "./dom.js";
import { state } from "./state.js";
import { vendorLabel } from "./format.js";

/** Default backend when `data-ask-endpoint="default"` — Turing ES's catalog copilot. */
const DEFAULT_ASK_ENDPOINT = "https://turing-demo.viglet.org/api/sn/model-catalog/copilot";

/** Locale sent with the question. It must match the backend SN **site-instance**
 * locale (the catalog is ingested under en-US), NOT the visitor's browser language:
 * retrieval is locale-scoped, so a mismatched locale (e.g. a pt-BR browser) returns
 * zero hits and the copilot answers "no matching results" to every question. Override
 * via `#ask[data-ask-locale]` if a backend indexes the catalog under another locale. */
const DEFAULT_ASK_LOCALE = "en-US";

/** Example prompts when qa-eval.jsonl (T62) isn't reachable (offline / not emitted). */
const FALLBACK_EXAMPLES = [
  "What is the cheapest embedding model?",
  "Which chat model has the largest context window?",
  "List open-weight chat models I can self-host.",
];

interface QaLine {
  question?: string;
  example?: boolean;
}

/** A returned citation, normalised from the backend's shape. */
interface Citation {
  id: string;
  title?: string;
  url?: string;
}

let busy = false;

/** Resolve the configured endpoint: empty/unset → null (stay hidden). */
function resolveEndpoint(raw: string | undefined): string | null {
  const v = (raw ?? "").trim();
  if (!v) return null;
  return v === "default" ? DEFAULT_ASK_ENDPOINT : v;
}

export function initAsk(): void {
  const section = byId("ask");
  const endpoint = resolveEndpoint(section.dataset.askEndpoint);
  if (!endpoint) return; // no endpoint configured → self-contained, section stays hidden
  const locale = (section.dataset.askLocale ?? "").trim() || DEFAULT_ASK_LOCALE;
  section.hidden = false;
  loadExamples();
  byId("ask-form").addEventListener("submit", (e) => {
    e.preventDefault();
    ask(endpoint, locale, byId("ask-q").value);
  });
  byId("ask-examples").addEventListener("click", (e) => {
    const chip = elClosest(e, "[data-q]");
    if (!chip) return;
    const q = chip.dataset.q ?? "";
    byId("ask-q").value = q;
    ask(endpoint, locale, q);
  });
}

/** Seed the example-prompt chips from the published qa-eval.jsonl (T62). */
async function loadExamples(): Promise<void> {
  let questions: string[] = [];
  try {
    const r = await fetch("./qa-eval.jsonl");
    if (r.ok) {
      questions = (await r.text())
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l): QaLine | null => { try { return JSON.parse(l) as QaLine; } catch { return null; } })
        .filter((o): o is QaLine => !!o && o.example === true && typeof o.question === "string")
        .map((o) => o.question as string);
    }
  } catch { /* offline / not emitted → fall back */ }
  if (!questions.length) questions = FALLBACK_EXAMPLES;
  renderExamples(questions.slice(0, 6));
}

function renderExamples(questions: string[]): void {
  byId("ask-examples").innerHTML =
    `<span class="ask-ex-label">Try</span>` +
    questions.map((q) => `<button type="button" class="ask-ex" data-q="${attr(q)}">${esc(q)}</button>`).join("");
}

/** Escape a value for an HTML double-quoted attribute (esc handles & and <). */
function attr(s: string): string {
  return esc(s).replace(/"/g, "&quot;");
}

async function ask(endpoint: string, locale: string, raw: string): Promise<void> {
  const q = raw.trim();
  const answer = byId("ask-answer");
  if (!q) { byId("ask-q").focus(); return; }
  if (busy) return;
  busy = true;
  byId("ask-send").disabled = true;
  answer.hidden = false;
  answer.innerHTML = `<div class="ask-loading"><span class="ask-spin" aria-hidden="true"></span> Asking the catalog…</div>`;
  try {
    // The catalog-copilot contract (Turing TurSNCatalogCopilotAPI): a multi-turn
    // conversation body — the widget is single-shot, so one user turn — plus the
    // site-instance locale (see DEFAULT_ASK_LOCALE). No API key: the backend holds it.
    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: q }], locale }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    answer.innerHTML = renderAnswer(await r.json());
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    answer.innerHTML =
      `<div class="ask-error">Couldn't reach the answer backend (${esc(msg)}). ` +
      `The catalog itself is fully browsable — try <a href="#browse">Explore</a> or press <kbd>⌘K</kbd>.</div>`;
  } finally {
    busy = false;
    byId("ask-send").disabled = false;
  }
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

/** Tolerant answer-text extraction — the backend contract is still stabilising. */
function extractText(data: Record<string, unknown>): string {
  for (const k of ["answer", "text", "message", "output", "response", "content"]) {
    const v = data[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  const choices = data.choices; // OpenAI-ish shape
  if (Array.isArray(choices) && choices.length) {
    const content = asRecord(asRecord(choices[0]).message).content;
    if (typeof content === "string") return content;
  }
  return "";
}

/** Tolerant citation extraction → normalised { id, title?, url? } list.
 * The catalog-copilot returns `citations: [{ rank, id, title, url, score }]`; the
 * fallbacks cover other backends / shapes while the contract stabilises. */
function extractCitations(data: Record<string, unknown>): Citation[] {
  const out: Citation[] = [];
  for (const k of ["citations", "sources", "models", "results", "cited"]) {
    const arr = data[k];
    if (!Array.isArray(arr)) continue;
    for (const item of arr) {
      if (typeof item === "string") { out.push({ id: item }); continue; }
      const o = asRecord(item);
      const vendor = typeof o.vendor === "string" ? o.vendor : null;
      const rawId = [o.id, o.modelId, o.key].find((x) => typeof x === "string") as string | undefined;
      if (!rawId) continue;
      out.push({
        id: vendor && !rawId.includes("/") ? `${vendor}/${rawId}` : rawId,
        title: typeof o.title === "string" ? o.title : undefined,
        url: typeof o.url === "string" ? o.url : undefined,
      });
    }
    if (out.length) break;
  }
  return out;
}

/** Map a returned citation to a catalog key ("vendor/id"), or null if unresolved/ambiguous. */
function resolveKey(cit: string): string | null {
  if (state.byKey.has(cit)) return cit;
  const matches: string[] = [];
  for (const key of state.byKey.keys()) {
    if (key.slice(key.indexOf("/") + 1) === cit) matches.push(key); // bare id → its vendor/id
  }
  return matches.length === 1 ? matches[0] : null;
}

/** Render one citation: a deep-link into the drawer when the id resolves, else the
 * backend's own url/title, else plain text — so a claim always shows its evidence. */
function citeChip(c: Citation): string {
  const key = resolveKey(c.id);
  if (key) {
    const m = state.byKey.get(key)!;
    return `<a class="ask-cite" href="#${encodeURI(key)}"><span class="mid">${esc(m.id)}</span> <span class="lbl">${esc(vendorLabel(m.vendor))}</span></a>`;
  }
  const label = esc(c.title || c.id);
  return c.url
    ? `<a class="ask-cite" href="${esc(c.url)}" target="_blank" rel="noopener">${label} <span class="lbl">↗</span></a>`
    : `<span class="ask-cite ask-cite-plain">${label}</span>`;
}

function paragraphs(text: string): string {
  return esc(text).split(/\n{2,}/).map((p) => `<p>${p.replaceAll("\n", "<br>")}</p>`).join("");
}

function renderAnswer(data: unknown): string {
  const rec = asRecord(data);
  const text = extractText(rec);
  const cites = extractCitations(rec);
  const errMsg = typeof rec.error === "string" ? rec.error : "";

  let body: string;
  if (text) {
    body = `<div class="ask-text">${paragraphs(text)}</div>`;
  } else if (rec.available === false) {
    // The copilot can't run (e.g. no default LLM configured) — surface its reason.
    body = `<div class="ask-error">The catalog copilot is unavailable${errMsg ? ` (${esc(errMsg)})` : ""}. Browse the catalog below or press <kbd>⌘K</kbd>.</div>`;
  } else if (cites.length) {
    // Degraded: retrieval matched rows but no synthesized prose — still show evidence.
    body = `<div class="ask-text"><p class="lbl">No synthesized answer${errMsg ? ` (${esc(errMsg)})` : ""} — here are the matching models.</p></div>`;
  } else {
    body = `<div class="ask-text"><p class="lbl">No answer${errMsg ? ` (${esc(errMsg)})` : ""}.</p></div>`;
  }

  const summary = typeof rec.groundedQuerySummary === "string" && rec.groundedQuerySummary.trim()
    ? `<p class="ask-summary lbl">Interpreted as: ${esc(rec.groundedQuerySummary)}</p>` : "";
  const citeHtml = cites.length
    ? `<div class="ask-cites"><span class="ask-cites-label">Cited models</span><div class="ask-cite-list">${cites.map(citeChip).join("")}</div></div>`
    : "";
  return body + summary + citeHtml +
    `<p class="ask-caveat lbl">Grounded on the catalog — figures are indicative / cited, verify at the source. Click a cited model to open its full record.</p>`;
}
