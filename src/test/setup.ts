import "@testing-library/jest-dom/vitest";
import { configure } from "@testing-library/dom";

// Lazy route chunks can take several seconds to transform on first load in
// jsdom, especially with test files running in parallel workers.
configure({ asyncUtilTimeout: 10000 });

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
