# SRCH — Search

> Scope: Finding birds fast — search input, query syntax, command palette, and result feedback.
> Items: 60 · Done: 0

## Wave-tagged
- [ ] SRCH-001 (W3) Press / anywhere to focus the search input
- [ ] SRCH-002 (W3) Esc clears the query and blurs the search input
- [ ] SRCH-003 (W3) Debounced filtering (~200 ms) so results update smoothly while typing
- [ ] SRCH-004 (W3) Live match-count label under the input updates as you type
- [ ] SRCH-005 (W3) Fuzzy typo-tolerant matching (e.g. "phenix" finds "Phoenix")
- [ ] SRCH-006 (W3) Matched substrings highlighted in result names
- [ ] SRCH-007 (W3) Search matches trait values as well as names
- [ ] SRCH-008 (W3) Search matches rarity tier names (e.g. "legendary")
- [ ] SRCH-009 (W3) Search by token id with a # prefix (e.g. #007)
- [ ] SRCH-010 (W3) Query syntax rarity:epic filters by rarity tier
- [ ] SRCH-011 (W3) Query syntax price:<2 and price:>0.5 filter by price bounds
- [ ] SRCH-012 (W3) Query syntax trait:<value> filters by a specific trait
- [ ] SRCH-013 (W3) Syntax tokens combine with free text in a single query
- [ ] SRCH-014 (W3) Invalid syntax token shows an inline hint instead of zero results
- [ ] SRCH-015 (W3) Search history shows the last 5 queries on input focus
- [ ] SRCH-016 (W3) Clicking a history entry re-runs that query
- [ ] SRCH-017 (W3) Clear-search-history button removes all saved queries
- [ ] SRCH-018 (W3) Ctrl/Cmd+K opens a command palette overlay
- [ ] SRCH-019 (W3) Palette lists matching birds with artwork thumbnails as you type
- [ ] SRCH-020 (W3) Enter on a palette bird result navigates to its item page
- [ ] SRCH-021 (W3) Arrow keys move the highlighted row inside the palette
- [ ] SRCH-022 (W3) Palette navigation commands: go to Market, Stats, Activity, Profile, Settings
- [ ] SRCH-023 (W3) Palette action commands: connect wallet, shuffle grid, clear filters
- [ ] SRCH-024 (W3) Palette shows a "Recent" section when opened with no query
- [ ] SRCH-025 (W3) Esc closes the palette and returns focus to the prior element
- [ ] SRCH-026 (W3) Empty state offers 3 clickable suggested example queries
- [ ] SRCH-027 (W3) Query synced to ?q= via replaceState so typing does not spam history
- [ ] SRCH-028 (W3) Screen-reader live region announces "N results" when the count changes
- [ ] SRCH-029 (W3) Clear (×) button inside the search input resets the query
- [ ] SRCH-030 (W3) Header search on any page navigates to /market with the query applied
- [ ] SRCH-031 (W3) / shortcut is ignored while typing in another input or textarea
- [ ] SRCH-032 (W3) Matching is case-insensitive and diacritic-insensitive
- [ ] SRCH-033 (W3) Multi-word queries match all words in any order
- [ ] SRCH-034 (W3) Quoted phrases match exactly (e.g. "ice wing")
- [ ] SRCH-035 (W3) Negation syntax -rarity:common excludes matching birds
- [ ] SRCH-036 (W3) Name matches rank above trait matches in result order
- [ ] SRCH-037 (W3) Exact #id lookups pin the matching bird to the top instantly
- [ ] SRCH-038 (W3) Enter in the search input moves focus to the first result card
- [ ] SRCH-039 (W3) Matched trait text highlighted on card trait pills too
- [ ] SRCH-040 (W3) Subtle pending indicator in the input while the debounce is in flight

## Backlog
- [ ] SRCH-041 (—) Voice search via the Web Speech API where supported
- [ ] SRCH-042 (—) Autocomplete dropdown suggests names and traits while typing
- [ ] SRCH-043 (—) "Did you mean …" suggestion for near-miss queries
- [ ] SRCH-044 (—) Saved searches with custom names, re-runnable from a list
- [ ] SRCH-045 (—) Toggle to search within the watchlist only
- [ ] SRCH-046 (—) Owner handle search with an @ prefix (e.g. @birdwhale)
- [ ] SRCH-047 (—) Query syntax likes:>10 filters by like count
- [ ] SRCH-048 (—) Query syntax sort:price-asc applies a sort from the search box
- [ ] SRCH-049 (—) Palette theme commands toggle dark/light mode
- [ ] SRCH-050 (—) "Your top queries this session" panel in the empty state
- [ ] SRCH-051 (—) Regex mode toggle for power-user pattern matching
- [ ] SRCH-052 (—) Fuzzy sensitivity setting: strict or loose matching
- [ ] SRCH-053 (—) Results grouped under rarity tier headers in list view
- [ ] SRCH-054 (—) Hovering a palette result shows an inline preview card
- [ ] SRCH-055 (—) Palette rows show each bird's price and rarity badge
- [ ] SRCH-056 (—) "I'm feeling lucky" runs a random suggested query
- [ ] SRCH-057 (—) Option to restore the last query automatically on reload
- [ ] SRCH-058 (—) Highlight color follows the rarity tier of the matched bird
- [ ] SRCH-059 (—) Export the current search results as a JSON download
- [ ] SRCH-060 (—) ? shortcut opens a search-syntax cheat-sheet modal
