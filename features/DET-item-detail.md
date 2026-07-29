# DET — Item Detail & Provenance

> Scope: The /item/:id page — artwork, traits, pricing, sharing, and simulated ownership history.
> Items: 70 · Done: 0

## Wave-tagged
- [x] DET-001 (W1) /item/:id route renders a full detail page for any catalogue bird <!-- done:2026-07-29 W1 -->
- [x] DET-002 (W1) 404 not-found page with a back-to-market link for unknown token ids <!-- done:2026-07-29 W1 -->
- [x] DET-003 (W1) Breadcrumb "Market › <bird name>" at the top of the detail page <!-- done:2026-07-29 W1 -->
- [x] DET-004 (W1) Large artwork panel with a rarity-tinted glow border <!-- done:2026-07-29 W1 -->
- [x] DET-005 (W1) Rarity badge and tier label shown beside the bird name <!-- done:2026-07-29 W1 -->
- [x] DET-006 (W1) Price in ETH with a Buy button on the detail page <!-- done:2026-07-29 W1 -->
- [x] DET-007 (W1) Simulated buy on detail page sets owner to you and shows a toast <!-- done:2026-07-29 W1 -->
- [x] DET-008 (W1) "Owned by you" badge when the connected wallet owns the bird <!-- done:2026-07-29 W1 -->
- [x] DET-009 (W1) Trait pills listed with trait name and value <!-- done:2026-07-29 W1 -->
- [x] DET-010 (W1) Clicking a trait pill opens /market filtered to that trait <!-- done:2026-07-29 W1 -->
- [x] DET-011 (W1) Each trait pill shows its rarity percentage across the catalogue <!-- done:2026-07-29 W1 -->
- [x] DET-012 (W1) Copy-token-id button with a "Copied" feedback state <!-- done:2026-07-29 W1 -->
- [x] DET-013 (W1) Prev/next buttons navigate to adjacent token ids <!-- done:2026-07-29 W1 -->
- [x] DET-014 (W1) Left/right arrow keys navigate to the previous/next bird <!-- done:2026-07-29 W1 -->
- [x] DET-015 (W1) Prev/next controls disable at the first and last token <!-- done:2026-07-29 W1 -->
- [x] DET-016 (W1) Clicking the artwork opens a zoom lightbox overlay <!-- done:2026-07-29 W1 -->
- [x] DET-017 (W1) Lightbox closes via Esc, overlay click, or close button <!-- done:2026-07-29 W1 -->
- [x] DET-018 (W1) Zoom in/out and reset controls inside the lightbox <!-- done:2026-07-29 W1 -->
- [x] DET-019 (W1) Similar-birds rail of 6 birds sharing rarity or a trait <!-- done:2026-07-29 W1 -->
- [x] DET-020 (W1) Similar-bird cards link to their own detail pages <!-- done:2026-07-29 W1 -->
- [x] DET-021 (W1) Price-history sparkline seeded deterministically per token <!-- done:2026-07-29 W1 -->
- [x] DET-022 (W1) Hovering the sparkline shows the point's price and simulated date <!-- done:2026-07-29 W1 -->
- [x] DET-023 (W1) Owner display with handle and generated identicon avatar <!-- done:2026-07-29 W1 -->
- [x] DET-024 (W1) Like button on the detail page stays in sync with the market card <!-- done:2026-07-29 W1 -->
- [x] DET-025 (W1) Share menu with a copy-link action and confirmation toast <!-- done:2026-07-29 W1 -->
- [x] DET-026 (W1) Share menu uses the Web Share API when available, copy fallback otherwise <!-- done:2026-07-29 W1 -->
- [x] DET-027 (W1) Download a canvas-rendered share-card PNG with art, name, and price <!-- done:2026-07-29 W1 -->
- [x] DET-028 (W1) Simulated metadata JSON viewer with syntax highlighting <!-- done:2026-07-29 W1 -->
- [x] DET-029 (W1) Copy-metadata-JSON button with a "Copied" feedback state <!-- done:2026-07-29 W1 -->
- [x] DET-030 (W1) Provenance timeline of mint, transfers, and sales seeded per token <!-- done:2026-07-29 W1 -->
- [x] DET-031 (W1) Provenance entries show event type, wallet handles, price, and date <!-- done:2026-07-29 W1 -->
- [x] DET-032 (W1) A simulated purchase appends a new sale event to the provenance timeline <!-- done:2026-07-29 W1 -->
- [x] DET-033 (W1) Back-to-market link restores the previous scroll position and filters <!-- done:2026-07-29 W1 -->
- [x] DET-034 (W1) Document title set to the bird's name and token id <!-- done:2026-07-29 W1 -->
- [x] DET-035 (W1) Detail deep links survive a hard refresh via HashRouter <!-- done:2026-07-29 W1 -->

## Backlog
- [ ] DET-036 (—) Toggle traits between pill view and a detailed table view
- [ ] DET-037 (—) Rarity rank chip, e.g. "#12 of 150 by rarity score"
- [ ] DET-038 (—) Rarity score breakdown panel showing each trait's contribution
- [ ] DET-039 (—) "Above/below tier average" value badge next to the price
- [ ] DET-040 (—) Similar-birds rail toggle: same rarity vs shared trait
- [ ] DET-041 (—) Slideshow mode cycles through the catalogue starting from the current bird
- [ ] DET-042 (—) Make-offer simulation with offers stored locally per bird
- [ ] DET-043 (—) Accept or decline pending offers on birds you own
- [ ] DET-044 (—) Price-history range toggle: 7d / 30d / all
- [ ] DET-045 (—) Filter the provenance timeline by event type
- [ ] DET-046 (—) Export the provenance timeline as a JSON download
- [ ] DET-047 (—) Owner handle links to that owner's profile page
- [ ] DET-048 (—) Report/flag action with a local confirmation state (simulated)
- [ ] DET-049 (—) Deterministic flavor-text bio paragraph generated per token
- [ ] DET-050 (—) Synthesized WebAudio chirp unique to each bird on artwork click
- [ ] DET-051 (—) Confetti burst animation on a successful purchase
- [ ] DET-052 (—) Add-to-watchlist button on the detail page
- [ ] DET-053 (—) Personal note per bird, editable and stored locally
- [ ] DET-054 (—) QR code rendered for the item's deep link
- [ ] DET-055 (—) Color palette strip extracted from the artwork
- [ ] DET-056 (—) Prev/next navigates within the active filtered market set
- [ ] DET-057 (—) Swipe left/right navigation between birds on touch devices
- [ ] DET-058 (—) Drag-to-pan inside the lightbox while zoomed
- [ ] DET-059 (—) Copy a trait as a search-syntax snippet (e.g. trait:flame)
- [ ] DET-060 (—) "Featured bird of the day" badge with a countdown to rotation
- [ ] DET-061 (—) Activity feed on the page listing this bird's session events
- [ ] DET-062 (—) Historical owners count stat chip from provenance data
- [ ] DET-063 (—) Last-sale price with delta versus the current list price
- [ ] DET-064 (—) "You viewed this N times" counter stored locally
- [ ] DET-065 (—) Compare this bird against another chosen via a picker
- [ ] DET-066 (—) Sticky mini-header with name and Buy button appears on scroll
- [ ] DET-067 (—) Keyboard shortcut B opens the buy confirmation on the detail page
- [ ] DET-068 (—) Print-optimized layout for the detail page
- [ ] DET-069 (—) Open raw metadata JSON in a new tab via a blob URL
- [ ] DET-070 (—) Gift/transfer simulation to a chosen handle adds a provenance entry
