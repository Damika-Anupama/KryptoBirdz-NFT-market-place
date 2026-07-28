# 🦅 KryptoBirdz — NFT Marketplace (Demo Build)

> **This is the `frontend-only` branch** — a self-contained, wallet-free
> demonstration of the KryptoBirdz marketplace UI. It exists so anyone can see
> and click through the project in seconds, without MetaMask, test ETH, or a
> local blockchain.
>
> Looking for the full dApp (Solidity contracts + Truffle + web3)? See the
> [**`main` branch**](https://github.com/Damika-s-Play-Ground/KryptoBirdz-NFT-market-place/tree/main).

<!-- LIVE-DEMO -->
## 🔗 Live demo

### ▶︎ **https://damika-s-play-ground.github.io/KryptoBirdz-NFT-market-place/**

_Deployed from this branch to GitHub Pages — no wallet, no setup, just click._

<p align="left">
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDamika-s-Play-Ground%2FKryptoBirdz-NFT-market-place%2Ftree%2Ffrontend-only&project-name=kryptobirdz-demo&repository-name=kryptobirdz-demo">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
  &nbsp;<em>(one-click mirror on Vercel, optional)</em>
</p>

---

![KryptoBirdz marketplace preview](./webpic.jpeg)

## ✨ What's in this build

A polished, modern marketplace front end rendered entirely in the browser:

- **Animated hero** with a floating NFT card stack and live collection stats.
- **Marketplace grid** of 15 hand-illustrated birds with lazy-loaded artwork.
- **Rarity system** — Common → Rare → Epic → Legendary, each with its own
  accent colour and ribbon.
- **Search + filter** by name, trait, or token id, all client-side and instant.
- **Glassmorphism design** — dark theme, gradient orbs, hover motion, and a
  toast notification layer.
- **Fully responsive** and respects `prefers-reduced-motion`.

Everything runs in **demo mode**: the catalogue is bundled as static data, and
Buy / Like / Connect Wallet actions are simulated. In the full dApp these are
backed by an on-chain **ERC-721** contract accessed through **web3.js**.

## 🗺️ Roadmap: 980 tracked micro-features

This branch is being grown into a full product demo through a
**[980-item feature catalog](./FEATURES.md)** across 15 epics (marketplace,
item detail, simulated wallet & economy, rarity analytics, search, social,
gamification, accessibility, i18n, PWA, …), shipped in verified waves — each
wave is built, tested, deployed, and live-checked before its items count as
done. Current progress lives in [FEATURES.md](./FEATURES.md).

## 🧱 Tech stack

| | |
|---|---|
| Framework | React 18 + Vite 6 + TypeScript (strict) |
| Styling | Hand-written CSS design system (no UI framework) |
| Data | Typed static catalogue (`src/data/birdz.ts`), deterministic simulation |
| Testing | Vitest + Testing Library; pre-push + pre-deploy verify gates |
| Hosting | GitHub Pages (Vercel-ready too) |

No `web3`, `bootstrap`, or `mdb` dependencies — the demo bundle is ~50 kB
gzipped.

## 🚀 Run locally

```bash
git clone -b frontend-only https://github.com/Damika-s-Play-Ground/KryptoBirdz-NFT-market-place.git
cd KryptoBirdz-NFT-market-place
npm install
npm run dev
```

Then open the printed local URL (default <http://localhost:5173>).

Checks and production build:

```bash
npm run verify     # typecheck + full test suite
npm run build      # outputs static assets to ./dist
npm run preview    # serve the production build locally
```

## ☁️ Deployment

This branch is **live on GitHub Pages**, published straight from the built
assets. To (re)deploy after changes:

```bash
npm run deploy     # verify + build, then push ./dist to the gh-pages branch
```

That uses [`gh-pages`](https://www.npmjs.com/package/gh-pages) (a dev
dependency) to publish to the `gh-pages` branch, which GitHub serves at the
Live demo URL above. Assets use relative paths (Vite `base: "./"`), so the
site works under the `/KryptoBirdz-NFT-market-place/` project path without
extra config, and the deploy is gated: type errors or failing tests abort it.

### Alternative: Vercel

Prefer Vercel? Use the **Deploy with Vercel** button near the top, or:

1. Import this repo at <https://vercel.com/new> and set the production branch
   to `frontend-only`.
2. The **Vite** preset is auto-detected; [`vercel.json`](./vercel.json)
   pins the build command, output dir, and SPA rewrite.
3. Deploy.

## 📁 Structure

```
index.html           # Vite entry (root)
public/              # favicon, manifest, build.json wave stamp
src/
  components/
    App.tsx          # the demo UI
    App.css          # design system
    __tests__/       # component smoke tests
  crypto-birdz/      # 15 bird artwork PNGs
  data/
    birdz.ts         # typed catalogue + rarity/stats
    buildInfo.ts     # wave stamp shown in the footer
  main.tsx           # React 18 entry
features/            # the 980-item feature catalog (15 epic files)
FEATURES.md          # catalog index, wave plan, wave log
scripts/features-progress.mjs   # recomputes the progress table
vite.config.ts       # base "./", vitest config
vercel.json          # Vercel build + SPA config
```

## 📄 License

See [LICENSE.md](./LICENSE.md).
