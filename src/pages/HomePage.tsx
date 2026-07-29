import { useEffect } from "react";
import { Link } from "react-router-dom";
import { BIRDZ, STATS } from "../data/birdz";
import { REPO_URL } from "../data/links";

interface StatProps {
  label: string;
  value: string | number;
  suffix?: string;
}

function Stat({ label, value, suffix }: StatProps) {
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

export default function HomePage() {
  useEffect(() => {
    document.title = "KryptoBirdz — NFT Marketplace Demo";
  }, []);

  return (
    <>
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
            preview the marketplace experience — all rendered right here in
            the browser.
          </p>
          <div className="hero__cta">
            <Link className="btn btn--primary" to="/market">
              Explore collection
            </Link>
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
            <Stat label="Floor" value={STATS.floor.toFixed(2)} suffix=" ETH" />
            <Stat
              label="Volume"
              value={STATS.volume.toFixed(1)}
              suffix=" ETH"
            />
          </div>
        </div>

        <div className="hero__art" aria-hidden="true">
          <div className="hero__stack">
            <img
              src={BIRDZ[4].image}
              alt=""
              className="hero__card hero__card--back"
            />
            <img
              src={BIRDZ[14].image}
              alt=""
              className="hero__card hero__card--mid"
            />
            <img
              src={BIRDZ[0].image}
              alt=""
              className="hero__card hero__card--front"
            />
          </div>
        </div>
      </section>

      <section className="about">
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
              are simulated — see <Link to="/about-demo">what's real</Link> in
              this demo.
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
    </>
  );
}
