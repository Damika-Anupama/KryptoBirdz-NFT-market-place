import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Lightbox from "../components/Lightbox";
import Sparkline from "../components/Sparkline";
import { BIRDZ, RARITY, type Bird } from "../data/birdz";
import { traitRarityPct } from "../data/catalogue-stats";
import { getPriceHistory } from "../data/market-sim/price-history";
import {
  getProvenance,
  type ProvenanceEvent,
} from "../data/market-sim/provenance";
import { copyText } from "../lib/clipboard";
import { removeListing, toggleLikeWithActivity } from "../lib/economy";
import { identiconDataUri } from "../lib/identicon";
import { downloadShareCard } from "../lib/shareCard";
import ListingModal from "../components/ListingModal";
import OfferModal from "../components/OfferModal";
import PurchaseModal from "../components/PurchaseModal";
import WalletModal from "../components/WalletModal";
import { useCollectionStore, useIsOwned } from "../stores/collection";
import { useIsLiked } from "../stores/favorites";
import { useRecentStore } from "../stores/recent";
import { showToast } from "../stores/toast";
import {
  useBalance,
  useConnectedPersona,
  useWalletStore,
} from "../stores/wallet";

/** Conservative gas headroom used for the insufficient-funds check. */
const GAS_HEADROOM = 0.008;

function highlightJson(json: string): React.ReactNode[] {
  // Tiny JSON highlighter: keys, strings, numbers, punctuation.
  const parts = json.split(/("(?:[^"\\]|\\.)*"(?:\s*:)?|\b\d+\.?\d*\b)/g);
  return parts.map((part, i) => {
    if (/^".*":$/.test(part.trim())) {
      return (
        <span key={i} className="json__key">
          {part}
        </span>
      );
    }
    if (/^"/.test(part)) {
      return (
        <span key={i} className="json__str">
          {part}
        </span>
      );
    }
    if (/^\d/.test(part)) {
      return (
        <span key={i} className="json__num">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function ProvenanceRow({ ev }: { ev: ProvenanceEvent }) {
  const icons: Record<ProvenanceEvent["type"], string> = {
    mint: "✨",
    transfer: "↔",
    sale: "◆",
  };
  return (
    <li className={`prov__row prov__row--${ev.type}`}>
      <span className="prov__icon" aria-hidden="true">
        {icons[ev.type]}
      </span>
      <div className="prov__body">
        <span className="prov__type">{ev.type}</span>
        <span className="prov__who">
          {ev.from ? (
            <>
              {ev.from} <span className="prov__arrow">→</span> {ev.to}
            </>
          ) : (
            ev.to
          )}
        </span>
      </div>
      <div className="prov__meta">
        {ev.price != null && (
          <span className="prov__price">◆ {ev.price.toFixed(3)}</span>
        )}
        <span className="prov__date">{ev.date}</span>
      </div>
    </li>
  );
}

export default function ItemPage() {
  const { tokenId } = useParams();
  const navigate = useNavigate();

  const idNum = Number(tokenId);
  const bird: Bird | undefined = BIRDZ.find((b) => b.id === idNum);

  const isOwned = useIsOwned(idNum);
  const purchase = useCollectionStore((s) => s.owned[idNum]);
  const liked = useIsLiked(idNum);
  const record = useRecentStore((s) => s.record);
  const persona = useConnectedPersona();
  const balance = useBalance();
  const listedPrice = useWalletStore((s) => s.listings[idNum]);

  const [copiedId, setCopiedId] = useState(false);
  const [copiedMeta, setCopiedMeta] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [buying, setBuying] = useState(false);
  const [listing, setListing] = useState(false);
  const [offering, setOffering] = useState(false);
  const [connectPrompt, setConnectPrompt] = useState(false);

  useEffect(() => {
    if (bird) {
      document.title = `${bird.name} ${bird.tokenId} — KryptoBirdz`;
      record(bird.id);
      window.scrollTo(0, 0);
    }
  }, [bird, record]);

  // Arrow-key navigation between adjacent tokens.
  const goPrev = useCallback(() => {
    if (bird && bird.id > 1) {
      navigate(`/item/${String(bird.id - 1).padStart(4, "0")}`);
    }
  }, [bird, navigate]);
  const goNext = useCallback(() => {
    if (bird && bird.id < BIRDZ.length) {
      navigate(`/item/${String(bird.id + 1).padStart(4, "0")}`);
    }
  }, [bird, navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, lightbox]);

  const history = useMemo(() => (bird ? getPriceHistory(bird) : []), [bird]);

  const provenance = useMemo(() => {
    if (!bird) return [];
    const events = getProvenance(bird);
    if (purchase) {
      events.push({
        type: "sale",
        from: bird.owner,
        to: "you.eth",
        price: purchase.price,
        date: new Date(purchase.at).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        daysAgo: 0,
      });
    }
    return events;
  }, [bird, purchase]);

  const similar = useMemo(() => {
    if (!bird) return [];
    return BIRDZ.filter(
      (b) =>
        b.id !== bird.id &&
        (b.rarity === bird.rarity ||
          b.traits.some((t) => bird.traits.includes(t)))
    ).slice(0, 6);
  }, [bird]);

  const metadata = useMemo(() => {
    if (!bird) return "";
    return JSON.stringify(
      {
        name: bird.name,
        token_id: bird.tokenId,
        description: "A hand-illustrated KryptoBird from the demo aviary.",
        image: bird.image,
        attributes: [
          { trait_type: "Rarity", value: bird.rarity },
          ...bird.traits.map((t) => ({ trait_type: "Trait", value: t })),
        ],
        price_eth: bird.price,
        owner: isOwned ? "you.eth" : bird.owner,
      },
      null,
      2
    );
  }, [bird, isOwned]);

  if (!bird) {
    return (
      <div className="notfound">
        <h1>Unknown token</h1>
        <p>
          Token “{tokenId}” isn't part of the collection. It may have been a
          typo — token ids run 0001–{String(BIRDZ.length).padStart(4, "0")}.
        </p>
        <Link className="btn btn--primary" to="/market">
          Back to the marketplace
        </Link>
      </div>
    );
  }

  const accent = RARITY[bird.rarity].color;
  const marketSearch = sessionStorage.getItem("kb.marketSearch") ?? "";
  const shareUrl = window.location.href;

  const shortfall = bird.price + GAS_HEADROOM - balance;
  const cantAfford = persona != null && !isOwned && shortfall > 0;

  const doBuy = () => {
    if (!persona) {
      setConnectPrompt(true);
      return;
    }
    setBuying(true);
  };

  const doShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${bird.name} — KryptoBirdz`,
          url: shareUrl,
        });
        return;
      } catch {
        // user cancelled or share failed — fall through to menu
      }
    }
    setShareOpen((o) => !o);
  };

  return (
    <main
      className="item"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to={`/market${marketSearch}`}>Market</Link>
        <span aria-hidden="true"> › </span>
        <span aria-current="page">{bird.name}</span>
      </nav>

      <div className="item__layout">
        <div className="item__left">
          <button
            className="item__art"
            onClick={() => setLightbox(true)}
            aria-label={`Enlarge artwork for ${bird.name}`}
          >
            <img
              src={bird.image}
              alt={bird.name}
              style={
                { viewTransitionName: `bird-${bird.id}` } as React.CSSProperties
              }
            />
            <span className="item__zoom-hint" aria-hidden="true">
              🔍 Click to zoom
            </span>
          </button>

          <div className="item__nav">
            <button
              className="btn btn--ghost"
              onClick={goPrev}
              disabled={bird.id === 1}
              aria-label="Previous bird"
            >
              ← Prev
            </button>
            <span className="item__nav-pos">
              {bird.id} / {BIRDZ.length}
            </span>
            <button
              className="btn btn--ghost"
              onClick={goNext}
              disabled={bird.id === BIRDZ.length}
              aria-label="Next bird"
            >
              Next →
            </button>
          </div>

          <section className="panel">
            <h3 className="panel__title">Metadata</h3>
            <pre className="json">{highlightJson(metadata)}</pre>
            <button
              className="btn btn--ghost btn--small"
              onClick={async () => {
                if (await copyText(metadata)) {
                  setCopiedMeta(true);
                  window.setTimeout(() => setCopiedMeta(false), 2000);
                }
              }}
            >
              {copiedMeta ? "Copied ✓" : "Copy JSON"}
            </button>
          </section>
        </div>

        <div className="item__right">
          <div className="item__title-row">
            <h1 className="item__name">{bird.name}</h1>
            <span className="card__rarity item__rarity">{bird.rarity}</span>
          </div>

          <div className="item__idrow">
            <span className="item__token">{bird.tokenId}</span>
            <button
              className="linklike"
              onClick={async () => {
                if (await copyText(bird.tokenId)) {
                  setCopiedId(true);
                  window.setTimeout(() => setCopiedId(false), 2000);
                }
              }}
            >
              {copiedId ? "Copied ✓" : "copy id"}
            </button>
            {isOwned && <span className="owned-badge">Owned by you</span>}
          </div>

          <div className="item__owner">
            <img
              className="item__avatar"
              src={identiconDataUri(
                isOwned ? persona?.address ?? "you.eth" : bird.owner
              )}
              alt=""
              aria-hidden="true"
            />
            <div>
              <span className="item__owner-label">Owner</span>
              <span className="item__owner-handle">
                {isOwned ? `${persona?.name ?? "You"} (you)` : bird.owner}
              </span>
            </div>
          </div>

          <div className="item__buy panel">
            <div className="card__price">
              <span className="card__price-label">Price</span>
              <span className="item__price-value">
                <span className="eth">◆</span> {bird.price.toFixed(2)} ETH
              </span>
            </div>
            <div className="item__buy-actions">
              {!isOwned && (
                <span
                  className="tooltip-wrap"
                  data-tooltip={
                    cantAfford
                      ? `Insufficient funds — you need ◆ ${shortfall.toFixed(4)} more (incl. gas)`
                      : undefined
                  }
                >
                  <button
                    className="btn btn--primary btn--press"
                    onClick={doBuy}
                    disabled={cantAfford}
                  >
                    {persona ? "Buy now" : "Connect to buy"}
                  </button>
                </span>
              )}
              {isOwned &&
                (listedPrice != null ? (
                  <>
                    <span className="listed-tag">
                      Listed · ◆ {listedPrice.toFixed(4)}
                    </span>
                    <button
                      className="btn btn--ghost"
                      onClick={() => removeListing(bird)}
                    >
                      Delist
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn--primary"
                    onClick={() => setListing(true)}
                  >
                    List for sale
                  </button>
                ))}
              {!isOwned && persona && (
                <button
                  className="btn btn--ghost"
                  onClick={() => setOffering(true)}
                >
                  Make offer
                </button>
              )}
              <button
                className={`btn btn--ghost ${liked ? "is-liked" : ""}`}
                onClick={() => toggleLikeWithActivity(bird)}
                aria-pressed={liked}
              >
                {liked ? "♥ Liked" : "♡ Like"} {bird.likes + (liked ? 1 : 0)}
              </button>
              <div className="share">
                <button className="btn btn--ghost" onClick={doShare}>
                  Share ↗
                </button>
                {shareOpen && (
                  <div className="share__menu">
                    <button
                      className="share__option"
                      onClick={async () => {
                        if (await copyText(shareUrl)) {
                          showToast("Link copied to clipboard");
                        }
                        setShareOpen(false);
                      }}
                    >
                      Copy link
                    </button>
                    <button
                      className="share__option"
                      onClick={async () => {
                        const ok = await downloadShareCard(bird);
                        showToast(
                          ok
                            ? "Share card downloaded"
                            : "Could not render share card"
                        );
                        setShareOpen(false);
                      }}
                    >
                      Download share card (PNG)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <section className="panel">
            <h3 className="panel__title">Traits</h3>
            <div className="item__traits">
              {bird.traits.map((t) => (
                <Link
                  key={t}
                  to={`/market?trait=${encodeURIComponent(t)}`}
                  className="trait-pill"
                >
                  <span className="trait-pill__name">{t}</span>
                  <span className="trait-pill__pct">
                    {traitRarityPct(t)}% have this
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="panel">
            <h3 className="panel__title">Price history (30d, simulated)</h3>
            <Sparkline points={history} accent={accent} />
          </section>

          <section className="panel">
            <h3 className="panel__title">Provenance (simulated)</h3>
            <ul className="prov">
              {provenance.map((ev, i) => (
                <ProvenanceRow key={i} ev={ev} />
              ))}
            </ul>
          </section>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="similar">
          <h2 className="section-title">Similar birds</h2>
          <div className="similar__rail">
            {similar.map((b) => (
              <Link
                key={b.id}
                to={`/item/${b.tokenId.replace("#", "")}`}
                className="similar__card"
                style={
                  { "--accent": RARITY[b.rarity].color } as React.CSSProperties
                }
              >
                <img src={b.image} alt={b.name} loading="lazy" />
                <span className="similar__name">{b.name}</span>
                <span className="similar__price">
                  ◆ {b.price.toFixed(2)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {lightbox && (
        <Lightbox
          src={bird.image}
          alt={bird.name}
          onClose={() => setLightbox(false)}
        />
      )}
      {buying && (
        <PurchaseModal bird={bird} onClose={() => setBuying(false)} />
      )}
      {listing && (
        <ListingModal bird={bird} onClose={() => setListing(false)} />
      )}
      {offering && <OfferModal bird={bird} onClose={() => setOffering(false)} />}
      {connectPrompt && (
        <WalletModal onClose={() => setConnectPrompt(false)} />
      )}
    </main>
  );
}
