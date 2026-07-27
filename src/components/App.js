import React, { useMemo, useState, useCallback } from "react";
import { BIRDZ, RARITY, STATS } from "../data/birdz";
import "./App.css";

const REPO_URL =
  "https://github.com/Damika-s-Play-Ground/KryptoBirdz-NFT-market-place";

const FILTERS = ["All", "Legendary", "Epic", "Rare", "Common"];

function Stat({ label, value, suffix }) {
  return (
    <div className="stat">
      <span className="stat__value">
        {value}
        {suffix && <span className="stat__suffix">{suffix}</span>}
      </span>
      <span className="stat__label">{label}</span>
    </div>
  );
}

function BirdCard({ bird, onAction }) {
  const accent = RARITY[bird.rarity].color;
  return (
    <article
      className="card"
      style={{ "--accent": accent }}
      tabIndex={0}
    >
      <div className="card__media">
        <img src={bird.image} alt={bird.name} loading="lazy" />
        <span className="card__rarity">{bird.rarity}</span>
        <button
          className="card__like"
          onClick={() => onAction(`Liked ${bird.name}`)}
          aria-label={`Like ${bird.name}`}
        >
          ♥ {bird.likes}
        </button>
      </div>

      <div className="card__body">
        <div className="card__row">
          <h3 className="card__name">{bird.name}</h3>
          <span className="card__token">{bird.tokenId}</span>
        </div>

        <div className="card__traits">
          {bird.traits.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>

        <div className="card__footer">
          <div className="card__price">
            <span className="card__price-label">Price</span>
            <span className="card__price-value">
              <span className="eth">◆</span> {bird.price.toFixed(2)} ETH
            </span>
          </div>
          <button
            className="btn btn--buy"
            onClick={() => onAction(`Demo: “Buy ${bird.name}” — connect a wallet in the full dApp`)}
          >
            Buy now
          </button>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast({ message, id: message + Math.floor(performance.now()) });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BIRDZ.filter((b) => {
      const matchesFilter = filter === "All" || b.rarity === filter;
      const matchesQuery =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.tokenId.toLowerCase().includes(q) ||
        b.traits.some((t) => t.toLowerCase().includes(q));
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  return (
    <div className="app">
      <div className="bg-orbs" aria-hidden="true">
        <span className="orb orb--1" />
        <span className="orb orb--2" />
        <span className="orb orb--3" />
      </div>

      {/* NAVBAR */}
      <header className="nav">
        <a className="nav__brand" href="#top">
          <span className="nav__logo">🦅</span>
          <span>
            Krypto<span className="nav__brand-accent">Birdz</span>
          </span>
        </a>
        <nav className="nav__links">
          <a href="#market">Marketplace</a>
          <a href="#about">About</a>
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </nav>
        <button
          className="btn btn--ghost"
          onClick={() =>
            showToast("Demo mode — wallet connection lives in the full dApp")
          }
        >
          Connect Wallet
        </button>
      </header>

      {/* DEMO BANNER */}
      <div className="demo-strip">
        ✦ Live demo build — a static preview of the on-chain KryptoBirdz
        marketplace. No wallet or gas required.
      </div>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="hero__copy">
          <span className="hero__eyebrow">ERC-721 · Ethereum · Web3</span>
          <h1 className="hero__title">
            Collect the flock of
            <span className="hero__title-grad"> KryptoBirdz</span>
          </h1>
          <p className="hero__sub">
            A hand-illustrated generative aviary of {STATS.items} unique
            non-fungible birds. Explore the collection, filter by rarity, and
            preview the marketplace experience — all rendered right here in the
            browser.
          </p>
          <div className="hero__cta">
            <a className="btn btn--primary" href="#market">
              Explore collection
            </a>
            <a
              className="btn btn--ghost"
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
            >
              View source
            </a>
          </div>
          <div className="hero__stats">
            <Stat label="Items" value={STATS.items} />
            <Stat label="Owners" value={STATS.owners} />
            <Stat
              label="Floor"
              value={STATS.floor.toFixed(2)}
              suffix=" ETH"
            />
            <Stat
              label="Volume"
              value={STATS.volume.toFixed(1)}
              suffix=" ETH"
            />
          </div>
        </div>

        <div className="hero__art" aria-hidden="true">
          <div className="hero__stack">
            <img src={BIRDZ[4].image} alt="" className="hero__card hero__card--back" />
            <img src={BIRDZ[14].image} alt="" className="hero__card hero__card--mid" />
            <img src={BIRDZ[0].image} alt="" className="hero__card hero__card--front" />
          </div>
        </div>
      </section>

      {/* MARKETPLACE */}
      <main className="market" id="market">
        <div className="market__head">
          <div>
            <h2 className="section-title">Marketplace</h2>
            <p className="section-sub">
              {visible.length} of {BIRDZ.length} birds
            </p>
          </div>
          <div className="market__controls">
            <input
              className="search"
              type="search"
              placeholder="Search name, trait or #id…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search collection"
            />
            <div className="filters" role="tablist" aria-label="Filter by rarity">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={filter === f}
                  className={`filter ${filter === f ? "is-active" : ""}`}
                  style={
                    RARITY[f] ? { "--accent": RARITY[f].color } : undefined
                  }
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="empty">No birds match “{query}”. Try another search.</p>
        ) : (
          <div className="grid">
            {visible.map((bird) => (
              <BirdCard key={bird.id} bird={bird} onAction={showToast} />
            ))}
          </div>
        )}
      </main>

      {/* ABOUT */}
      <section className="about" id="about">
        <h2 className="section-title">About this build</h2>
        <div className="about__grid">
          <div className="about__item">
            <span className="about__icon">🎨</span>
            <h3>Frontend-only</h3>
            <p>
              This branch strips the Solidity/Truffle backend so the interface
              can be hosted anywhere as a zero-config static site.
            </p>
          </div>
          <div className="about__item">
            <span className="about__icon">⚡</span>
            <h3>Demo mode</h3>
            <p>
              Catalogue data is bundled locally. Buy, like and connect actions
              are simulated — the real dApp talks to an ERC-721 contract via
              MetaMask.
            </p>
          </div>
          <div className="about__item">
            <span className="about__icon">🔗</span>
            <h3>Full source</h3>
            <p>
              The complete marketplace — smart contracts, migrations and web3
              wiring — lives on the{" "}
              <a href={REPO_URL} target="_blank" rel="noreferrer">
                main branch
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer__brand">
          <span className="nav__logo">🦅</span> KryptoBirdz
        </div>
        <p className="footer__note">
          Demonstration build · not affiliated with any live token sale ·{" "}
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            source on GitHub
          </a>
        </p>
      </footer>

      {/* TOAST */}
      <div className={`toast ${toast ? "is-visible" : ""}`} role="status">
        {toast?.message}
      </div>
    </div>
  );
}
