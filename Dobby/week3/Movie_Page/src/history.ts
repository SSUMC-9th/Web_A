// src/history.ts
export const NAV_EVENT = "app:navigate";

function saveScrollIntoState() {
  const s = history.state || {};
  history.replaceState({ ...s, __scrollY: window.scrollY }, document.title, location.href);
}

export function navigate(to: string, opts: { replace?: boolean; state?: unknown } = {}) {
  const { replace = false, state = {} } = opts;
  saveScrollIntoState();
  history[replace ? "replaceState" : "pushState"](state, "", to);
  dispatchEvent(new Event(NAV_EVENT));
  window.scrollTo(0, 0);
}
