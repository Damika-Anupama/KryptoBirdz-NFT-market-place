# PWA — Performance & PWA

> Scope: Keep the static demo fast at 150+ birds and make it installable, offline-capable, and resource-frugal.
> Items: 60 · Done: 0

## Wave-tagged
- [ ] PWA-001 (W4) Virtualized grid keeps scrolling smooth with 150+ birds rendered
- [ ] PWA-002 (W4) Bird images lazy-load via IntersectionObserver as they approach the viewport
- [ ] PWA-003 (W4) LQIP blur-up placeholders shown while bird images load
- [ ] PWA-004 (W4) Route-level code splitting delivers a visibly faster first paint on the home route
- [ ] PWA-005 (W4) Standardized skeleton states across grid, detail, wallet, and activity views

## Backlog
- [ ] PWA-006 (—) Web app manifest with custom install prompt UI in the nav
- [ ] PWA-007 (—) Service worker precaches the app shell for full offline browsing
- [ ] PWA-008 (—) Offline indicator banner appears when the connection drops
- [ ] PWA-009 (—) Actions taken offline queue and replay on reconnect (simulated sync)
- [ ] PWA-010 (—) Update-available toast appears when a new service worker is waiting
- [ ] PWA-011 (—) Hero assets preloaded so the landing visual appears without a late pop-in
- [ ] PWA-012 (—) Inter self-hosted via @fontsource, removing the Google Fonts request
- [ ] PWA-013 (—) Bird images served as WebP/AVIF with fallbacks for older browsers
- [ ] PWA-014 (—) Activity log migrated from localStorage to IndexedDB with no visible data loss
- [ ] PWA-015 (—) Lighthouse performance score ≥90 verified on the home route
- [ ] PWA-016 (—) Bundle-size badge displayed on the /about-demo page
- [ ] PWA-017 (—) prefers-reduced-data mode serves low-res images and skips decorative effects
- [ ] PWA-018 (—) App shell renders instantly from cache on repeat visits
- [ ] PWA-019 (—) Manifest theme-color matches the dark glassmorphism UI in browser chrome
- [ ] PWA-020 (—) Installed app shows branded splash screen via manifest icons and colors
- [ ] PWA-021 (—) Offline fallback page shows previously viewed birds from cache
- [ ] PWA-022 (—) Stale-while-revalidate strategy keeps images instant yet fresh
- [ ] PWA-023 (—) Activity feed viewable offline from cached data
- [ ] PWA-024 (—) Detail route chunk prefetched when a card link is hovered or focused
- [ ] PWA-025 (—) Idle-time prefetch warms remaining bird thumbnails after first paint
- [ ] PWA-026 (—) Scroll position restored instantly on back navigation to the grid
- [ ] PWA-027 (—) Debounced search keeps typing responsive with the full 150+ bird dataset
- [ ] PWA-028 (—) Filter chip toggles apply without visible jank via memoized filtering
- [ ] PWA-029 (—) CSS containment on cards keeps hover effects from triggering grid-wide layout
- [ ] PWA-030 (—) content-visibility on offscreen sections speeds initial render of long pages
- [ ] PWA-031 (—) Responsive srcset serves right-sized images per viewport width
- [ ] PWA-032 (—) Explicit image dimensions eliminate layout shift as grid images load
- [ ] PWA-033 (—) font-display swap prevents invisible text while Inter loads
- [ ] PWA-034 (—) Subset Inter to used glyph ranges for a smaller first font payload
- [ ] PWA-035 (—) Critical above-the-fold CSS inlined for faster first render
- [ ] PWA-036 (—) Non-critical CSS deferred so it no longer blocks first paint
- [ ] PWA-037 (—) Hero image preloaded with fetchpriority=high for a faster LCP
- [ ] PWA-038 (—) Web vitals panel on /about-demo shows live LCP, CLS, and INP values
- [ ] PWA-039 (—) Performance budget status indicator on /about-demo (pass/fail per metric)
- [ ] PWA-040 (—) Stored demo data compressed so localStorage stays under quota at 150+ birds
- [ ] PWA-041 (—) Activity feed renders batched updates instead of one repaint per event
- [ ] PWA-042 (—) Activity feed list virtualized for long histories
- [ ] PWA-043 (—) Load-more option caps initial DOM size as an alternative to full grid render
- [ ] PWA-044 (—) Avatar images use blurhash placeholders instead of empty boxes
- [ ] PWA-045 (—) Low-end device mode toggle disables backdrop-filter blur for smoother scrolling
- [ ] PWA-046 (—) Settings shows current cache storage usage for the demo
- [ ] PWA-047 (—) Clear cached data button in settings resets caches with confirmation
- [ ] PWA-048 (—) Persistent storage requested with a friendly explainer prompt
- [ ] PWA-049 (—) Installed app icon shows unread activity count via the Badging API
- [ ] PWA-050 (—) Web Share API button shares a bird detail link from supported devices
- [ ] PWA-051 (—) Manifest shortcuts jump straight to Wallet and Activity from the app icon
- [ ] PWA-052 (—) Favorites marked offline show a pending badge until simulated sync completes
- [ ] PWA-053 (—) Slow-connection detection automatically lowers image quality
- [ ] PWA-054 (—) Skeleton UI appears within 100ms of navigation on every route
- [ ] PWA-055 (—) Filter chips interactive within 1s of first load on mid-tier mobile
- [ ] PWA-056 (—) Modal code loads on demand so modals add zero cost to first paint
- [ ] PWA-057 (—) Activity chart libraries lazy-load only when the activity page opens
- [ ] PWA-058 (—) iOS standalone install support with correct icon and status bar styling
- [ ] PWA-059 (—) Install button appears in the footer when the browser signals installability
- [ ] PWA-060 (—) Lighthouse performance score ≥90 verified on the bird detail route
