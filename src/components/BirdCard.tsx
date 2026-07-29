import React, { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { RARITY, type Bird } from "../data/birdz";
import { useFavoritesStore, useIsLiked } from "../stores/favorites";

const REDUCED_MOTION = () =>
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface BirdCardProps {
  bird: Bird;
  /** Stagger index for the grid entrance animation. */
  index?: number;
}

export default function BirdCard({ bird, index = 0 }: BirdCardProps) {
  const accent = RARITY[bird.rarity].color;
  const liked = useIsLiked(bird.id);
  const toggle = useFavoritesStore((s) => s.toggle);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || REDUCED_MOTION() || e.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--tilt-x", `${(-py * 6).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${(px * 8).toFixed(2)}deg`);
  }, []);

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  }, []);

  const itemId = bird.tokenId.replace("#", "");

  return (
    <article
      ref={ref}
      className="card card--tilt"
      style={
        {
          "--accent": accent,
          "--stagger": `${Math.min(index, 12) * 45}ms`,
        } as React.CSSProperties
      }
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <Link
        to={`/item/${itemId}`}
        className="card__media"
        aria-label={`View ${bird.name} details`}
        viewTransition
      >
        <img
          src={bird.image}
          alt={bird.name}
          loading="lazy"
          className={loaded ? "is-loaded" : ""}
          onLoad={() => setLoaded(true)}
          style={{ viewTransitionName: `bird-${bird.id}` } as React.CSSProperties}
        />
        <span className="card__rarity">{bird.rarity}</span>
      </Link>
      <button
        className={`card__like ${liked ? "is-liked" : ""}`}
        onClick={() => toggle(bird.id)}
        aria-pressed={liked}
        aria-label={`Like ${bird.name}`}
      >
        ♥ {bird.likes + (liked ? 1 : 0)}
      </button>

      <div className="card__body">
        <div className="card__row">
          <h3 className="card__name">
            <Link to={`/item/${itemId}`} className="card__name-link">
              {bird.name}
            </Link>
          </h3>
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
          <Link className="btn btn--buy" to={`/item/${itemId}`}>
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
