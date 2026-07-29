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
import { BUILD_INFO } from "../data/buildInfo";
import { REPO_URL } from "../data/links";
import { useToastMessage, showToast } from "../stores/toast";
import "./App.css";

const HomePage = lazy(() => import("../pages/HomePage"));
const MarketplacePage = lazy(() => import("../pages/MarketplacePage"));
const ItemPage = lazy(() => import("../pages/ItemPage"));
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
  const toast = useToastMessage();
  const [params] = useSearchParams();
  const debug = params.get("debug") === "1";
  const [shortcuts, setShortcuts] = useState(false);

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
          <NavLink to="/about-demo">About</NavLink>
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </nav>
        <button
          className="btn btn--ghost"
          onClick={() =>
            showToast("Demo mode — the simulated wallet arrives in Wave 2")
          }
        >
          Connect Wallet
        </button>
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

      <div className={`toast ${toast ? "is-visible" : ""}`} role="status">
        {toast}
      </div>

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
