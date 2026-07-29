import { useEffect } from "react";
import { identiconDataUri } from "../lib/identicon";
import { logActivity } from "../stores/activity";
import { showToast } from "../stores/toast";
import {
  PERSONAS,
  truncateAddress,
  useWalletStore,
} from "../stores/wallet";

export default function WalletModal({ onClose }: { onClose: () => void }) {
  const connect = useWalletStore((s) => s.connect);
  const balances = useWalletStore((s) => s.balances);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Connect a demo wallet"
      onClick={onClose}
    >
      <div className="panel walletmodal" onClick={(e) => e.stopPropagation()}>
        <h3 className="panel__title">Choose a demo wallet</h3>
        <p className="walletmodal__note">
          These are simulated personas — no real wallet or extension is used.
        </p>
        <div className="walletmodal__list">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              className="walletmodal__persona"
              onClick={() => {
                connect(p.id);
                logActivity({
                  type: "connect",
                  birdId: null,
                  price: null,
                  who: "you",
                });
                showToast(`Wallet connected — welcome, ${p.name}`);
                onClose();
              }}
            >
              <img
                src={identiconDataUri(p.address)}
                alt=""
                className="walletmodal__avatar"
              />
              <span className="walletmodal__info">
                <strong>{p.name}</strong>
                <span className="walletmodal__addr">
                  {truncateAddress(p.address)}
                </span>
              </span>
              <span className="walletmodal__balance">
                ◆ {(balances[p.id] ?? p.start).toFixed(4)}
              </span>
            </button>
          ))}
        </div>
        <button className="btn btn--ghost" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
