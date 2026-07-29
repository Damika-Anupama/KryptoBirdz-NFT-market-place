import { useEffect, useState } from "react";
import { REPO_URL } from "../data/links";
import { useCollectionStore } from "../stores/collection";
import { useFavoritesStore } from "../stores/favorites";
import { useRecentStore } from "../stores/recent";
import { showToast } from "../stores/toast";

export default function AboutDemoPage() {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    document.title = "About this demo — KryptoBirdz";
  }, []);

  const resetAll = () => {
    useFavoritesStore.getState().reset();
    useCollectionStore.getState().reset();
    useRecentStore.getState().reset();
    sessionStorage.removeItem("kb.marketScroll");
    sessionStorage.removeItem("kb.marketSearch");
    setConfirming(false);
    showToast("Demo state cleared — you're a fresh visitor again");
  };

  return (
    <main className="docpage">
      <h1 className="section-title">About this demo</h1>
      <p className="section-sub">
        An honest breakdown of what's real and what's simulated.{" "}
        <a
          href={`${REPO_URL}#readme`}
          target="_blank"
          rel="noreferrer"
          className="skiplink-inline"
        >
          Skip to the README ↗
        </a>
      </p>

      <div className="about__grid">
        <div className="about__item">
          <span className="about__icon">🎭</span>
          <h3>Simulated</h3>
          <p>
            The wallet, purchases, prices, price history, provenance, and
            owner handles are all generated deterministically in your browser.
            Nothing touches a blockchain; no real ETH exists here.
          </p>
        </div>
        <div className="about__item">
          <span className="about__icon">💾</span>
          <h3>Persists locally</h3>
          <p>
            Likes, simulated purchases, and recently-viewed birds are saved in
            your browser's localStorage only. They survive reloads, never
            leave your device, and can be wiped below.
          </p>
        </div>
        <div className="about__item">
          <span className="about__icon">✅</span>
          <h3>Real</h3>
          <p>
            The artwork, the interface, the search/filtering, and the{" "}
            <a
              href={`${REPO_URL}/blob/frontend-only/FEATURES.md`}
              target="_blank"
              rel="noreferrer"
            >
              feature roadmap
            </a>{" "}
            being shipped wave by wave. The full dApp with real contracts
            lives on the{" "}
            <a
              href={`${REPO_URL}/tree/main`}
              target="_blank"
              rel="noreferrer"
            >
              main branch
            </a>
            .
          </p>
        </div>
      </div>

      <section className="panel docpage__danger">
        <h3 className="panel__title">Reset the demo</h3>
        <p>
          Clears your likes, simulated purchases, and browsing history from
          this browser.
        </p>
        {confirming ? (
          <div className="docpage__confirm">
            <span>Really clear everything?</span>
            <button className="btn btn--primary" onClick={resetAll}>
              Yes, reset
            </button>
            <button
              className="btn btn--ghost"
              onClick={() => setConfirming(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="btn btn--ghost"
            onClick={() => setConfirming(true)}
          >
            Reset demo state…
          </button>
        )}
      </section>
    </main>
  );
}
