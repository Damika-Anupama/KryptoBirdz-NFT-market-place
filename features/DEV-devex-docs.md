# DEV — DX, Docs & Quality

> Scope: User-verifiable developer experience, documentation, debugging, and quality features surfaced inside the demo — no chores, refactors, or ordinary tests.
> Items: 65 · Done: 0

## Wave-tagged
- [x] DEV-001 (W1) ErrorBoundary with friendly fallback and a copy-error-details button <!-- done:2026-07-29 W1 -->
- [x] DEV-002 (W1) 404 route with a lost-bird illustration and a link back home <!-- done:2026-07-29 W1 -->
- [x] DEV-003 (W1) /about-demo page honestly explaining what is simulated and what persists <!-- done:2026-07-29 W1 -->
- [x] DEV-004 (W1) Footer build/wave stamp showing version and current wave <!-- done:2026-07-29 W1 -->
- [x] DEV-005 (W1) In-app changelog page fed from the wave history <!-- done:2026-07-29 W1 -->
- [x] DEV-006 (W1) Keyboard shortcuts help modal opened with the `?` key <!-- done:2026-07-29 W1 -->
- [x] DEV-007 (W1) Skip-to-README link on the about page <!-- done:2026-07-29 W1 -->
- [x] DEV-008 (W1) Demo reset button that clears all local state after a confirmation dialog <!-- done:2026-07-29 W1 -->
- [x] DEV-009 (W1) Seed scenario switcher (fresh-user/collector/whale) behind ?debug=1 <!-- done:2026-07-29 W1 -->
- [x] DEV-010 (W1) Debug panel behind ?debug=1 showing live store states <!-- done:2026-07-29 W1 -->

## Backlog
- [ ] DEV-011 (—) /gallery route rendering every UI component state (storybook-lite)
- [ ] DEV-012 (—) FEATURES.md progress badge rendered in-app
- [ ] DEV-013 (—) Guided first-visit tour, skippable and persisted
- [ ] DEV-014 (—) Per-page document meta titles for every route
- [ ] DEV-015 (—) Print stylesheet for purchase receipts
- [ ] DEV-016 (—) Copy-as-markdown button for bird data on the detail page
- [ ] DEV-017 (—) Keyboard-navigable sitemap page listing all routes
- [ ] DEV-018 (—) localStorage usage inspector in the debug panel
- [ ] DEV-019 (—) Store coverage gate surfaced as an in-app quality badge (counted once)
- [ ] DEV-020 (—) README screenshot refresh reflected on the about page (max 1/wave)
- [ ] DEV-021 (—) Export/import the full demo state as a JSON file
- [ ] DEV-022 (—) Copy-shareable-deep-link button on every page
- [ ] DEV-023 (—) Offline banner when the browser loses connectivity
- [ ] DEV-024 (—) New-build notice prompting a refresh when a newer deploy is detected
- [ ] DEV-025 (—) FPS meter toggle in the debug panel
- [ ] DEV-026 (—) Simulated latency slider in the debug panel
- [ ] DEV-027 (—) Force-error button in the debug panel to demo the ErrorBoundary
- [ ] DEV-028 (—) Time-travel control advancing the simulated clock from the debug panel
- [ ] DEV-029 (—) Filterable event log viewer in the debug panel
- [ ] DEV-030 (—) State schema version display with a migration notice for old data
- [ ] DEV-031 (—) Printable keyboard shortcut cheatsheet page
- [ ] DEV-032 (—) Accessibility statement page describing supported features
- [ ] DEV-033 (—) Focus-outline audit mode highlighting all focusable elements, behind ?debug=1
- [ ] DEV-034 (—) Route list page with a one-line description of each screen
- [ ] DEV-035 (—) Report-an-issue link prefilled with an app state summary
- [ ] DEV-036 (—) Toast history panel listing recent notifications
- [ ] DEV-037 (—) Data freshness indicator showing the last simulation tick time
- [ ] DEV-038 (—) Credits and licenses page for art and libraries
- [ ] DEV-039 (—) Storage quota warning when localStorage nears its limit
- [ ] DEV-040 (—) Corrupted-state recovery flow offering a safe reset
- [ ] DEV-041 (—) Feature-flag panel behind ?debug=1 to preview unreleased features
- [ ] DEV-042 (—) Copy current store snapshot to clipboard as JSON
- [ ] DEV-043 (—) Diff viewer comparing current state vs seed defaults in the debug panel
- [ ] DEV-044 (—) Bot-simulation pause/resume control in the debug panel
- [ ] DEV-045 (—) Deterministic seed input reproducing an exact economy state
- [ ] DEV-046 (—) "What changed since your last visit" digest on return visits
- [ ] DEV-047 (—) Per-component render counter overlay behind ?debug=1
- [ ] DEV-048 (—) Filters and sort encoded in the URL hash so reloads restore the view
- [ ] DEV-049 (—) First-run detector showing a welcome banner vs a returning-user banner
- [ ] DEV-050 (—) Console easter egg with an ASCII bird and help commands
- [ ] DEV-051 (—) aria-live announcement log visible in the debug panel
- [ ] DEV-052 (—) Broken-image fallback placeholder with a retry button
- [ ] DEV-053 (—) Performance page showing bundle size per route from the build manifest
- [ ] DEV-054 (—) Lighthouse score badge on the about page, updated per wave
- [ ] DEV-055 (—) Contrast checker overlay behind ?debug=1
- [ ] DEV-056 (—) Reduced-data mode toggle that swaps heavy images for placeholders
- [ ] DEV-057 (—) Glossary page of NFT terms with in-app tooltip links
- [ ] DEV-058 (—) Error toasts include a copy-diagnostics action
- [ ] DEV-059 (—) Simulated network-activity viewer in the debug panel
- [ ] DEV-060 (—) Downloadable JSON changelog feed from the changelog page
- [ ] DEV-061 (—) Per-wave QA checklist page with checkable items persisted locally
- [ ] DEV-062 (—) Export your session activity (views, likes, purchases) as CSV
- [ ] DEV-063 (—) Pseudo-locale toggle behind ?debug=1 to verify translatable strings
- [ ] DEV-064 (—) Slow-device mode simulating low-end rendering behind ?debug=1
- [ ] DEV-065 (—) Build info page showing commit hash, build date, and dependency versions
