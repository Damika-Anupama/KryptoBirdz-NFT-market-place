import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BIRDZ } from "../data/birdz";
import { cancelOffer, resolveDueOffers } from "../lib/economy";
import { copyText } from "../lib/clipboard";
import { identiconDataUri } from "../lib/identicon";
import { logActivity } from "../stores/activity";
import { useCollectionStore } from "../stores/collection";
import { showToast } from "../stores/toast";
import {
  FAUCET_COOLDOWN_MS,
  truncateAddress,
  useBalance,
  useConnectedPersona,
  useWalletStore,
} from "../stores/wallet";
import BalanceTicker from "./BalanceTicker";

function useNow(intervalMs: number): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(t);
  }, [intervalMs]);
  return now;
}

function fmtCountdown(ms: number): string {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

export default function WalletPanel() {
  const persona = useConnectedPersona();
  const balance = useBalance();
  const disconnect = useWalletStore((s) => s.disconnect);
  const offers = useWalletStore((s) => s.offers);
  const history = useWalletStore((s) => s.history);
  const faucetClaims = useWalletStore((s) => s.faucetClaims);
  const claimFaucet = useWalletStore((s) => s.claimFaucet);
  const resetWallet = useWalletStore((s) => s.resetWallet);
  const owned = useCollectionStore((s) => s.owned);

  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resetText, setResetText] = useState("");
  const now = useNow(1000);

  // Sweep bot responses for due offers (also covers page reloads).
  useEffect(() => {
    resolveDueOffers();
    const t = window.setInterval(() => resolveDueOffers(), 2000);
    return () => window.clearInterval(t);
  }, []);

  if (!persona) return null;

  const ownedIds = Object.keys(owned).map(Number);
  const portfolio = ownedIds.reduce((sum, id) => {
    const bird = BIRDZ.find((b) => b.id === id);
    return sum + (bird?.price ?? 0);
  }, 0);

  const lastClaim = faucetClaims[persona.id] ?? 0;
  const nextClaimIn = lastClaim + FAUCET_COOLDOWN_MS - now;
  const canClaim = nextClaimIn <= 0;
  const pendingOffers = offers.filter((o) => o.status === "pending");

  return (
    <div className="wallet">
      <button
        className="wallet__pill"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <img
          src={identiconDataUri(persona.address)}
          alt=""
          className="wallet__avatar"
        />
        <BalanceTicker value={balance} />
        <span className="wallet__addr">{truncateAddress(persona.address)}</span>
      </button>

      {open && (
        <div className="wallet__panel panel">
          <div className="wallet__row">
            <span className="wallet__addr-full">
              {truncateAddress(persona.address)}
            </span>
            <button
              className="linklike"
              onClick={async () => {
                if (await copyText(persona.address)) {
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                }
              }}
            >
              {copied ? "Copied ✓" : "copy"}
            </button>
          </div>

          <div className="wallet__stats">
            <div>
              <span className="stat__label">Portfolio</span>
              <strong>◆ {portfolio.toFixed(4)}</strong>
            </div>
            <div>
              <span className="stat__label">Owned</span>
              <strong>
                {ownedIds.length}{" "}
                <Link
                  to="/market"
                  className="linklike"
                  onClick={() => setOpen(false)}
                >
                  view
                </Link>
              </strong>
            </div>
          </div>

          <div className="wallet__section">
            <span className="stat__label">Faucet</span>
            {canClaim ? (
              <button
                className="btn btn--ghost btn--small"
                onClick={() => {
                  claimFaucet();
                  logActivity({
                    type: "faucet",
                    birdId: null,
                    price: 1,
                    who: "you",
                  });
                  showToast("Faucet claimed: +1.0000 ETH");
                }}
              >
                Claim +1 ETH
              </button>
            ) : (
              <span className="wallet__cooldown">
                next claim in {fmtCountdown(nextClaimIn)}
              </span>
            )}
          </div>

          {pendingOffers.length > 0 && (
            <div className="wallet__section">
              <span className="stat__label">Pending offers</span>
              <ul className="wallet__list">
                {pendingOffers.map((o) => {
                  const bird = BIRDZ.find((b) => b.id === o.birdId);
                  return (
                    <li key={o.id} className="wallet__list-row">
                      <span>
                        {bird?.name ?? `#${o.birdId}`} · ◆{" "}
                        {o.amount.toFixed(4)} ·{" "}
                        {Math.round((now - o.createdAt) / 1000)}s ago
                      </span>
                      <button
                        className="linklike"
                        onClick={() => {
                          cancelOffer(o.id);
                          showToast("Offer cancelled");
                        }}
                      >
                        cancel
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {history.length > 0 && (
            <div className="wallet__section">
              <span className="stat__label">History</span>
              <ul className="wallet__list">
                {history.slice(0, 5).map((h, i) => {
                  const bird = BIRDZ.find((b) => b.id === h.birdId);
                  return (
                    <li key={i} className="wallet__list-row">
                      <Link
                        to={`/item/${String(h.birdId).padStart(4, "0")}`}
                        onClick={() => setOpen(false)}
                      >
                        {h.kind === "sale" ? "Sold" : "Bought"}{" "}
                        {bird?.name ?? `#${h.birdId}`} · ◆ {h.price.toFixed(4)}
                      </Link>
                      <span className="wallet__when">
                        {new Date(h.at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="wallet__section wallet__danger">
            <span className="stat__label">Danger zone</span>
            <div className="wallet__reset">
              <input
                className="search wallet__reset-input"
                placeholder='type "RESET"'
                value={resetText}
                onChange={(e) => setResetText(e.target.value)}
                aria-label="Type RESET to enable wallet reset"
              />
              <button
                className="btn btn--ghost btn--small"
                disabled={resetText !== "RESET"}
                onClick={() => {
                  resetWallet();
                  useCollectionStore.getState().reset();
                  setResetText("");
                  showToast("Wallet reset — balance restored");
                }}
              >
                Reset wallet
              </button>
            </div>
          </div>

          <button
            className="btn btn--ghost btn--small wallet__disconnect"
            onClick={() => {
              disconnect();
              logActivity({
                type: "disconnect",
                birdId: null,
                price: null,
                who: "you",
              });
              setOpen(false);
              showToast("Wallet disconnected");
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
