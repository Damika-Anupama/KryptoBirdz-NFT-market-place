# ACT — Activity & Notifications

> Scope: Toast system, /activity event feed, notification surfaces, and ambient bot-driven market events — all client-side.
> Items: 65 · Done: 0

## Wave-tagged
- [x] ACT-001 (W2) Toast stack shows at most 3 toasts with a "+N more" overflow counter <!-- done:2026-07-29 W2 -->
- [x] ACT-002 (W2) Toasts auto-dismiss with a visible progress bar that pauses on hover <!-- done:2026-07-29 W2 -->
- [x] ACT-003 (W2) Every toast has a close button for immediate manual dismissal <!-- done:2026-07-29 W2 -->
- [x] ACT-004 (W2) /activity page lists all recorded events newest-first <!-- done:2026-07-29 W2 -->
- [x] ACT-005 (W2) Feed timestamps render relatively ("2m ago") and update live without reload <!-- done:2026-07-29 W2 -->
- [x] ACT-006 (W2) Hovering a relative timestamp reveals the absolute date and time <!-- done:2026-07-29 W2 -->
- [x] ACT-007 (W2) Each event type (purchase, like, offer, listing) has a distinct icon <!-- done:2026-07-29 W2 -->
- [x] ACT-008 (W2) Each event type has a distinct accent color on its feed row and toast <!-- done:2026-07-29 W2 -->
- [x] ACT-009 (W2) Filter chips on /activity narrow the feed by event type <!-- done:2026-07-29 W2 -->
- [x] ACT-010 (W2) Filter chips show a live count badge of matching events <!-- done:2026-07-29 W2 -->
- [x] ACT-011 (W2) "Your events" vs "All events" toggle scopes the feed to your wallet's actions <!-- done:2026-07-29 W2 -->
- [x] ACT-012 (W2) Empty feed shows an illustration and a CTA to browse the collection <!-- done:2026-07-29 W2 -->
- [x] ACT-013 (W2) Completed purchases append a feed entry with bird, price, and buyer <!-- done:2026-07-29 W2 -->
- [x] ACT-014 (W2) Likes and unlikes append feed entries naming the bird <!-- done:2026-07-29 W2 -->
- [x] ACT-015 (W2) Offers made, accepted, and declined each append distinct feed entries <!-- done:2026-07-29 W2 -->
- [x] ACT-016 (W2) Listings and delistings append feed entries with the asking price <!-- done:2026-07-29 W2 -->
- [x] ACT-017 (W2) Wallet connect and disconnect are logged as your-events entries <!-- done:2026-07-29 W2 -->
- [x] ACT-018 (W2) Clicking a feed entry navigates to the referenced bird's detail page <!-- done:2026-07-29 W2 -->
- [x] ACT-019 (W2) Activity history persists across page reloads <!-- done:2026-07-29 W2 -->
- [x] ACT-020 (W2) Clear-history action empties the feed after a confirmation dialog <!-- done:2026-07-29 W2 -->
- [ ] ACT-021 (W5) Ambient bot market events generate on a deterministic seeded schedule and feed the page
- [ ] ACT-022 (W5) Bot purchase events appear in the feed with bot persona names and prices
- [ ] ACT-023 (W5) Bot list and delist events appear and update the affected bird's grid price
- [ ] ACT-024 (W5) Pause toggle on /activity halts ambient bot events until resumed
- [ ] ACT-025 (W5) "N new events" pill appears while scrolled down; clicking scrolls to top and reveals them

## Backlog
- [ ] ACT-026 (—) Notification bell in the navbar shows an unread event count badge
- [ ] ACT-027 (—) Bell dropdown previews the 5 most recent events with a link to /activity
- [ ] ACT-028 (—) Mark-all-read clears the unread badge in one click
- [ ] ACT-029 (—) Individual events can be toggled read or unread
- [ ] ACT-030 (—) Export the activity feed as a downloadable CSV file
- [ ] ACT-031 (—) Export full app state (wallet, holdings, activity) as a JSON backup file
- [ ] ACT-032 (—) Import a JSON backup to fully restore app state, with a validation error screen
- [ ] ACT-033 (—) Opt-in Browser Notification API alerts fire for events while the tab is backgrounded
- [ ] ACT-034 (—) Retention setting keeps only the last N events and prunes older ones
- [ ] ACT-035 (—) Feed groups events under sticky day headers (Today, Yesterday, dates)
- [ ] ACT-036 (—) Feed loads older events via infinite scroll as you near the bottom
- [ ] ACT-037 (—) Search box filters the feed by bird name or bot persona
- [ ] ACT-038 (—) Optional sound effect plays on new events, off by default
- [ ] ACT-039 (—) Setting chooses toast position (top-right, bottom-right, bottom-center)
- [ ] ACT-040 (—) Do-not-disturb mode suppresses toasts while still logging events
- [ ] ACT-041 (—) "Since your last visit" digest banner summarizes missed events on return
- [ ] ACT-042 (—) Per-type mute toggles silence chosen event types from toasts
- [ ] ACT-043 (—) Follow a specific bird to highlight its events in the feed
- [ ] ACT-044 (—) Events-per-hour sparkline renders at the top of /activity
- [ ] ACT-045 (—) Copy-link action on an event copies a shareable hash-route URL to it
- [ ] ACT-046 (—) Undo toast reverses reversible actions like an accidental unlike
- [ ] ACT-047 (—) Bot repricing generates price-change events showing old and new price
- [ ] ACT-048 (—) Filter the feed by the rarity tier of the referenced bird
- [ ] ACT-049 (—) Time-range filter limits the feed to 24h, 7d, or all time
- [ ] ACT-050 (—) Filter state encodes into the URL so /activity views are shareable
- [ ] ACT-051 (—) Keyboard navigation moves through feed entries with j/k and opens with Enter
- [ ] ACT-052 (—) Pin important events to a pinned section at the top of the feed
- [ ] ACT-053 (—) Expanding an event reveals full metadata including fake tx hash
- [ ] ACT-054 (—) Clicking a bot persona name opens a popover with its avatar and recent events
- [ ] ACT-055 (—) Whale-alert styling highlights purchases above a configurable ETH threshold
- [ ] ACT-056 (—) Compact vs comfortable feed density toggle persists per user
- [ ] ACT-057 (—) Streak toast celebrates consecutive daily visits
- [ ] ACT-058 (—) Live dot indicator on the navbar Activity link pulses when bots are active
- [ ] ACT-059 (—) Daily activity heat strip shows event volume for the past 30 days
- [ ] ACT-060 (—) Milestone events auto-log (100th event, first Legendary purchase)
- [ ] ACT-061 (—) Quiet-hours schedule suppresses toasts during chosen times of day
- [ ] ACT-062 (—) Per-bird activity tab on the detail page shows only that bird's events
- [ ] ACT-063 (—) Feed entries animate in with a subtle slide that respects reduced-motion
- [ ] ACT-064 (—) Offline banner appears when the tab loses connectivity, feed stays usable
- [ ] ACT-065 (—) Event icons legend popover explains every type and color at a glance
