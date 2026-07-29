import { useEffect, useMemo, useState } from "react";
import type { Bird } from "../data/birdz";
import { quotePurchase, settlePurchase, txFails } from "../lib/economy";
import { copyText } from "../lib/clipboard";
import { useBalance } from "../stores/wallet";
import Confetti from "./Confetti";

type Step = "review" | "pending" | "confirmed" | "failed";

interface PurchaseModalProps {
  bird: Bird;
  onClose: () => void;
}

export default function PurchaseModal({ bird, onClose }: PurchaseModalProps) {
  const quote = useMemo(() => quotePurchase(bird), [bird]);
  const willFail = useMemo(() => txFails(quote.txHash), [quote]);
  const balance = useBalance();
  const [step, setStep] = useState<Step>("review");
  const [confirmations, setConfirmations] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [copied, setCopied] = useState(false);

  const dismissable = step !== "pending";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissable) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismissable, onClose]);

  useEffect(() => {
    if (step !== "pending") return;
    const t = window.setInterval(() => {
      setConfirmations((c) => {
        if (c >= 12) {
          window.clearInterval(t);
          const ok = settlePurchase(bird, quote);
          setStep(ok ? "confirmed" : "failed");
          return c;
        }
        return c + 1;
      });
    }, 180);
    return () => window.clearInterval(t);
  }, [step, bird, quote]);

  useEffect(() => {
    if (step === "confirmed") {
      const t = window.setTimeout(() => setShowReceipt(true), 900);
      return () => window.clearTimeout(t);
    }
  }, [step]);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Buy ${bird.name}`}
      onClick={dismissable ? onClose : undefined}
    >
      <div
        className={`panel purchase purchase--${step}`}
        onClick={(e) => e.stopPropagation()}
      >
        {step === "review" && (
          <div className="purchase__step">
            <h3 className="panel__title">Review purchase</h3>
            <div className="purchase__item">
              <img src={bird.image} alt="" className="purchase__thumb" />
              <div>
                <strong>{bird.name}</strong>
                <span className="purchase__token">{bird.tokenId}</span>
              </div>
            </div>
            <dl className="purchase__lines">
              <div>
                <dt>Item price</dt>
                <dd>◆ {bird.price.toFixed(4)}</dd>
              </div>
              <div>
                <dt>Est. gas fee</dt>
                <dd>◆ {quote.gas.toFixed(4)}</dd>
              </div>
              <div className="purchase__total">
                <dt>Total</dt>
                <dd>◆ {quote.total.toFixed(4)}</dd>
              </div>
              <div>
                <dt>Your balance</dt>
                <dd>◆ {balance.toFixed(4)}</dd>
              </div>
            </dl>
            <div className="purchase__actions">
              <button className="btn btn--ghost" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn--primary btn--press"
                disabled={balance < quote.total}
                onClick={() => setStep("pending")}
              >
                Confirm purchase
              </button>
            </div>
          </div>
        )}

        {step === "pending" && (
          <div className="purchase__step">
            <h3 className="panel__title">Transaction pending…</h3>
            <p className="purchase__hash">tx {quote.txHash.slice(0, 22)}…</p>
            <div
              className="purchase__progress"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={12}
              aria-valuenow={confirmations}
            >
              <span
                className="purchase__progress-fill"
                style={{ width: `${(confirmations / 12) * 100}%` }}
              />
            </div>
            <p className="purchase__confs">
              {confirmations} / 12 block confirmations
            </p>
            <p className="purchase__note">
              Simulated — this dialog can't be closed mid-transaction.
            </p>
          </div>
        )}

        {step === "confirmed" && (
          <div className="purchase__step purchase__step--success">
            <Confetti />
            <span className="purchase__check" aria-hidden="true">
              <svg viewBox="0 0 52 52" className="check">
                <circle className="check__circle" cx="26" cy="26" r="24" />
                <path className="check__mark" d="M14 27l8 8 16-17" />
              </svg>
            </span>
            <h3 className="panel__title">Purchase confirmed!</h3>
            {showReceipt && (
              <div className="purchase__receipt">
                <dl className="purchase__lines">
                  <div>
                    <dt>Item</dt>
                    <dd>
                      {bird.name} {bird.tokenId}
                    </dd>
                  </div>
                  <div>
                    <dt>Price</dt>
                    <dd>◆ {bird.price.toFixed(4)}</dd>
                  </div>
                  <div>
                    <dt>Gas</dt>
                    <dd>◆ {quote.gas.toFixed(4)}</dd>
                  </div>
                  <div>
                    <dt>New balance</dt>
                    <dd>◆ {balance.toFixed(4)}</dd>
                  </div>
                  <div>
                    <dt>Time</dt>
                    <dd>{new Date().toLocaleString()}</dd>
                  </div>
                  <div className="purchase__hashline">
                    <dt>Tx hash</dt>
                    <dd>
                      <code>{quote.txHash.slice(0, 18)}…</code>
                      <button
                        className="linklike"
                        onClick={async () => {
                          if (await copyText(quote.txHash)) {
                            setCopied(true);
                            window.setTimeout(() => setCopied(false), 2000);
                          }
                        }}
                      >
                        {copied ? "Copied ✓" : "copy"}
                      </button>
                    </dd>
                  </div>
                </dl>
                <button className="btn btn--primary" onClick={onClose}>
                  Done
                </button>
              </div>
            )}
          </div>
        )}

        {step === "failed" && (
          <div className="purchase__step">
            <span className="purchase__failicon" aria-hidden="true">
              ⚠️
            </span>
            <h3 className="panel__title">Transaction reverted</h3>
            <p className="purchase__note">
              The simulated network rejected tx{" "}
              <code>{quote.txHash.slice(0, 14)}…</code> ("out of gas").
              Your balance was not charged — this happens to ~7% of demo
              transactions on purpose.
            </p>
            <div className="purchase__actions">
              <button className="btn btn--primary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}

        {willFail && step === "review" && <span hidden data-testid="doomed" />}
      </div>
    </div>
  );
}
