import { useEffect, useState } from "react";
import type { Bird } from "../data/birdz";
import { createListing } from "../lib/economy";

const PRICE_RE = /^\d+(\.\d{1,4})?$/;

interface ListingModalProps {
  bird: Bird;
  onClose: () => void;
}

export default function ListingModal({ bird, onClose }: ListingModalProps) {
  const [value, setValue] = useState(bird.price.toFixed(2));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const valid = PRICE_RE.test(value) && Number(value) > 0;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`List ${bird.name} for sale`}
      onClick={onClose}
    >
      <div className="panel walletmodal" onClick={(e) => e.stopPropagation()}>
        <h3 className="panel__title">List {bird.name} for sale</h3>
        <label className="field">
          <span className="stat__label">Asking price (ETH)</span>
          <input
            className="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputMode="decimal"
            aria-invalid={!valid}
          />
        </label>
        {!valid && (
          <p className="field__error">
            Enter a positive amount with at most 4 decimal places.
          </p>
        )}
        <p className="walletmodal__note">
          A simulated collector will consider your listing shortly after it
          goes live. A {(0.025 * 100).toFixed(1)}% fee applies on sale.
        </p>
        <div className="purchase__actions">
          <button className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn--primary"
            disabled={!valid}
            onClick={() => {
              createListing(bird, Number(value));
              onClose();
            }}
          >
            List for sale
          </button>
        </div>
      </div>
    </div>
  );
}
