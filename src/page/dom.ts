/* Tiny DOM helpers (T65). The page owns every element it queries, so these assert
 * presence and return a loose element handle — property access (.value, .onclick,
 * .querySelector, .dataset…) stays ergonomic without a null guard at each of the
 * ~70 call sites. The DATA model (types.ts) carries the strict typing; DOM handles
 * deliberately do not. `esc` HTML-escapes; `elClosest` reads e.target as an Element. */

/** getElementById, asserted present. Loosely typed for ergonomic property access. */
export const byId = (id: string): HTMLInputElement =>
  document.getElementById(id) as HTMLInputElement;

/** querySelector within a root (default: document). Loosely typed. */
export const qs = (sel: string, root: ParentNode = document): HTMLInputElement =>
  root.querySelector(sel) as unknown as HTMLInputElement;

/** querySelectorAll → array within a root (default: document). Loosely typed. */
export const qsa = (sel: string, root: ParentNode = document): HTMLInputElement[] =>
  Array.from(root.querySelectorAll(sel)) as unknown as HTMLInputElement[];

/** `.closest(sel)` from an event's target, tolerant of a non-Element target. */
export const elClosest = (e: Event, sel: string): HTMLInputElement | null => {
  const t = e.target as Element | null;
  return (t && t.closest ? t.closest(sel) : null) as unknown as HTMLInputElement | null;
};

/** Minimal HTML escape for text interpolated into SVG/HTML strings. */
export const esc = (s: unknown): string =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

/* ── Toast (T16) ─────────────────────────────────────────
   A transient status message. Lives here because both the interactive core
   (detail/compare) and the boot wiring raise toasts. */
let toastTimer: ReturnType<typeof setTimeout>;
export function toast(msg: string): void {
  const el = byId("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 1600);
}
