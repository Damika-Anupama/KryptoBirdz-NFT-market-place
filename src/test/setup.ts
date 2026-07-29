import "@testing-library/jest-dom/vitest";

// jsdom stubs for browser APIs the app calls.
window.scrollTo = (() => {}) as typeof window.scrollTo;
if (typeof window.matchMedia !== "function") {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}
