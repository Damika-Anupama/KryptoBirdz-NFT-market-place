# KryptoBirdz — Feature Catalog

The roadmap that turns this demo into a next-level product: **980 tracked
micro-features across 15 epics**, plus a 20-slot `MISC` contingency pool
(assigned only to genuinely new ideas — never filler; 1000 is a ceiling, not a
quota).

**Rules of honesty:** a checkbox flips `[ ]→[x]` only in the commit that
implements the item; an item counts toward the public % only once its wave's
live-deploy check passes; chores, refactors, and dependency bumps count zero.
Cut items become `[~]` and leave the denominator. Full delivery-loop details
live in each wave-close commit.

Recompute this table any time with: `node scripts/features-progress.mjs`

## Progress

| Epic | File | Done | Total | % |
|---|---|---|---|---|
| A11Y | [A11Y-accessibility.md](features/A11Y-accessibility.md) | 0 | 60 | 0% |
| ACT | [ACT-activity.md](features/ACT-activity.md) | 0 | 65 | 0% |
| COL | [COL-collections.md](features/COL-collections.md) | 0 | 65 | 0% |
| DET | [DET-item-detail.md](features/DET-item-detail.md) | 0 | 70 | 0% |
| DEV | [DEV-devex-docs.md](features/DEV-devex-docs.md) | 0 | 65 | 0% |
| FX | [FX-motion.md](features/FX-motion.md) | 0 | 70 | 0% |
| GAM | [GAM-gamification.md](features/GAM-gamification.md) | 0 | 70 | 0% |
| I18N | [I18N-internationalization.md](features/I18N-internationalization.md) | 0 | 55 | 0% |
| MKT | [MKT-marketplace.md](features/MKT-marketplace.md) | 0 | 75 | 0% |
| PER | [PER-personalization.md](features/PER-personalization.md) | 0 | 60 | 0% |
| PWA | [PWA-performance.md](features/PWA-performance.md) | 0 | 60 | 0% |
| SOC | [SOC-social.md](features/SOC-social.md) | 0 | 65 | 0% |
| SRCH | [SRCH-search.md](features/SRCH-search.md) | 0 | 60 | 0% |
| VIZ | [VIZ-dataviz.md](features/VIZ-dataviz.md) | 0 | 65 | 0% |
| WAL | [WAL-wallet.md](features/WAL-wallet.md) | 0 | 75 | 0% |
| **All** | 15 epics | **0** | **980** | **0%** |

## Wave plan

| Wave | Theme | Items | Epics |
|---|---|---|---|
| 0 | Stack migration: Vite 6 + React 18 + TS, test gate, this catalog | — | (infra, counts 0) |
| 1 | "It's a real app now" — routing, item detail, persistence | 65 | DET 35 · MKT 15 · DEV 10 · FX 5 |
| 2 | "The economy works" — wallet, purchases, activity | 70 | WAL 45 · ACT 20 · FX 5 |
| 3 | "Find anything" — search, sort/filter suite, keyboard | 70 | SRCH 40 · MKT 25 · A11Y 5 |
| 4 | "Depth" — 150+ birds, rarity analytics, stats dashboard | 70 | COL 35 · VIZ 30 · PWA 5 |
| 5 | "People & play" — profiles, social, achievements | 70 | SOC 35 · GAM 30 · ACT 5 |
| 6 | "Make it yours, make it fair" — themes, accessibility | 65 | PER 35 · A11Y 25 · FX 5 |
| 7+ | PWA/offline → i18n → FX sweep → long tail (tagged at each wave plan) | 570 | remaining backlog |

## Wave log

| Wave | Closed | Shipped | Deploy | Live check |
|---|---|---|---|---|
| 0 | 2026-07-27 | Vite 6 + React 18 + TS migration · vitest suite (14) + pre-push/pre-deploy gates · this 980-item catalog | gh-pages (`index-DCi7ivj9.js`) | OK — build.json wave:0 confirmed live |
