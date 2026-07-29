import { useEffect, useState } from "react";
import type { Bird } from "../data/birdz";
import { makeOffer } from "../lib/economy";
import { showToast } from "../stores/toast";
import { useBalance } from "../stores/wallet";

const PRICE_RE = /^\d+(\.\d{1,4})?$/;

interface OfferModalProps {
  bird: Bird;
  onClose: () => void;
}

export default function OfferModal({ bird, onClose }: OfferModalProps) {
  const balance = useBalance();
  const [value, setValue] = useState((bird.price * 0.85).toFixed(2));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const num = Number(value);
  const wellFormed = PRICE_RE.test(value) && num > 0;
  const affordable = num <= balance;
  const valid = wellFormed && affordable;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Make an offer on ${bird.name}`}
      onClick={onClose}
    >
      <div className="panel walletmodal" onClick={(e) => e.stopPropagation()}>
        <h3 className="panel__title">Make an offer on {bird.name}</h3>
        <p className="walletmodal__note">
          Listed at ◆ {bird.price.toFixed(2)}. Your balance: ◆{" "}
          {balance.toFixed(4)}.
        </p>
        <label className="field">
          <span className="stat__label">Offer amount (ETH)</span>
          <input
            className="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputMode="decimal"
            aria-invalid={!valid}
          />
        </label>
        {!wellFormed && (
          <p className="field__error">
            Enter a positive amount with at most 4 decimal places.
          </p>
        )}
        {wellFormed && !affordable && (
          <p className="field__error">
            That's more than your balance (◆ {balance.toFixed(4)}).
          </p>
        )}
        <div className="purchase__actions">
          <button className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn--primary"
            disabled={!valid}
            onClick={() => {
              makeOffer(bird, num);
              showToast(
                "Offer submitted — the seller (a bot) will respond shortly"
              );
              onClose();
            }}
          >
            Submit offer
          </button>
        </div>
      </div>
    </div>
  );
}
