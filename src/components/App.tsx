import { Suspense, lazy, useEffect, useState } from "react";
import {
  HashRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import DebugPanel from "./DebugPanel";
import ShortcutsModal from "./ShortcutsModal";
import ToastStack from "./ToastStack";
import WalletModal from "./WalletModal";
import WalletPanel from "./WalletPanel";
import { BUILD_INFO } from "../data/buildInfo";
import { REPO_URL } from "../data/links";
import { useWalletStore } from "../stores/wallet";
import "./App.css";

const HomePage = lazy(() => import("../pages/HomePage"));
const MarketplacePage = lazy(() => import("../pages/MarketplacePage"));
const ItemPage = lazy(() => import("../pages/ItemPage"));
const ActivityPage = lazy(() => import("../pages/ActivityPage"));
const AboutDemoPage = lazy(() => import("../pages/AboutDemoPage"));
const ChangelogPage = lazy(() => import("../pages/ChangelogPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

function SkeletonGrid() {
  return (
    <div className="market" aria-hidden="true">
      <div className="grid">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="card card--skeleton">
            <div className="skeleton skeleton--media" />
            <div className="card__body">
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--line skeleton--short" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Shell() {
  const location = useLocation();
  const [params] = useSearchParams();
  const debug = params.get("debug") === "1";
  const [shortcuts, setShortcuts] = useState(false);
  const [walletModal, setWalletModal] = useState(false);
  const connected = useWalletStore((s) => s.connectedId != null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (e.key === "?") setShortcuts((s) => !s);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="app">
      <div className="bg-orbs" aria-hidden="true">
        <span className="orb orb--1" />
        <span className="orb orb--2" />
        <span className="orb orb--3" />
      </div>

      <header className="nav">
        <Link className="nav__brand" to="/">
          <span className="nav__logo">🦅</span>
          <span>
            Krypto<span className="nav__brand-accent">Birdz</span>
          </span>
        </Link>
        <nav className="nav__links">
          <NavLink to="/market">Marketplace</NavLink>
          <NavLink to="/activity">Activity</NavLink>
          <NavLink to="/about-demo">About</NavLink>
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </nav>
        {connected ? (
          <WalletPanel />
        ) : (
          <button
            className="btn btn--ghost"
            onClick={() => setWalletModal(true)}
          >
            Connect Wallet
          </button>
        )}
      </header>

      <div className="demo-strip">
        ✦ Live demo build — a static preview of the on-chain KryptoBirdz
        marketplace. No wallet or gas required.
      </div>

      <div className="page" key={location.pathname}>
        <ErrorBoundary>
          <Suspense fallback={<SkeletonGrid />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/market" element={<MarketplacePage />} />
              <Route path="/item/:tokenId" element={<ItemPage />} />
              <Route path="/activity" element={<ActivityPage />} />
              <Route path="/about-demo" element={<AboutDemoPage />} />
              <Route path="/changelog" element={<ChangelogPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>

      <footer className="footer">
        <div className="footer__brand">
          <span className="nav__logo">🦅</span> KryptoBirdz
        </div>
        <p className="footer__note">
          Demonstration build · Wave {BUILD_INFO.wave} ·{" "}
          <Link to="/changelog">changelog</Link> · not affiliated with any live
          token sale ·{" "}
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            source on GitHub
          </a>
        </p>
      </footer>

      <ToastStack />

      {walletModal && <WalletModal onClose={() => setWalletModal(false)} />}
      {shortcuts && <ShortcutsModal onClose={() => setShortcuts(false)} />}
      {debug && <DebugPanel />}
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}
