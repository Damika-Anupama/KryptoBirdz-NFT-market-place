import { BIRDZ, type Bird } from "../data/birdz";
import { hashString, mulberry32 } from "../data/market-sim/rng";
import { logActivity } from "../stores/activity";
import { useCollectionStore } from "../stores/collection";
import { useFavoritesStore } from "../stores/favorites";
import { showToast } from "../stores/toast";
import { useWalletStore, type Offer } from "../stores/wallet";

/** Marketplace fee taken when a bot buys your listing. */
export const SALE_FEE_RATE = 0.025;

let txCounter = 0;

/** Plausible unique fake tx hash: 0x + 64 hex chars. */
export function makeTxHash(birdId: number): string {
  txCounter += 1;
  const rand = mulberry32(
    hashString(`tx:${birdId}:${Date.now()}:${txCounter}`)
  );
  let hex = "";
  for (let i = 0; i < 8; i++) {
    hex += Math.floor(rand() * 0xffffffff)
      .toString(16)
      .padStart(8, "0");
  }
  return `0x${hex}`;
}

/** Deterministic per-hash gas fee in a realistic 0.001–0.008 ETH band. */
export function gasFor(txHash: string): number {
  const r = mulberry32(hashString(`gas:${txHash}`))();
  return Math.round((0.001 + r * 0.007) * 10000) / 10000;
}

/** ~7% of transactions revert, decided deterministically from the hash. */
export function txFails(txHash: string): boolean {
  return mulberry32(hashString(`fail:${txHash}`))() < 0.07;
}

export interface PurchaseQuote {
  txHash: string;
  gas: number;
  total: number;
}

export function quotePurchase(bird: Bird): PurchaseQuote {
  const txHash = makeTxHash(bird.id);
  const gas = gasFor(txHash);
  return {
    txHash,
    gas,
    total: Math.round((bird.price + gas) * 10000) / 10000,
  };
}

/**
 * Settle a quoted purchase: debit, record ownership + history, log activity.
 * Returns false when the simulated transaction reverts (balance untouched).
 */
export function settlePurchase(bird: Bird, quote: PurchaseQuote): boolean {
  const wallet = useWalletStore.getState();
  if (txFails(quote.txHash)) return false;
  wallet.debit(quote.total);
  useCollectionStore.getState().buy(bird.id, bird.price);
  wallet.addHistory({
    birdId: bird.id,
    kind: "purchase",
    price: bird.price,
    gas: quote.gas,
    txHash: quote.txHash,
    at: new Date().toISOString(),
  });
  logActivity({ type: "purchase", birdId: bird.id, price: bird.price, who: "you" });
  return true;
}

export function toggleLikeWithActivity(bird: Bird): void {
  const wasLiked = Boolean(useFavoritesStore.getState().liked[bird.id]);
  useFavoritesStore.getState().toggle(bird.id);
  logActivity({
    type: wasLiked ? "unlike" : "like",
    birdId: bird.id,
    price: null,
    who: "you",
  });
}

export function createListing(bird: Bird, price: number): void {
  useWalletStore.getState().list(bird.id, price);
  logActivity({ type: "listing", birdId: bird.id, price, who: "you" });
  showToast(`${bird.name} listed for ${price.toFixed(4)} ETH`);
  scheduleBotBuyer(bird.id);
}

export function removeListing(bird: Bird): void {
  useWalletStore.getState().delist(bird.id);
  logActivity({ type: "delisting", birdId: bird.id, price: null, who: "you" });
  showToast(`${bird.name} delisted`);
}

/** Bot buys your listing after a short delay, crediting price minus fee. */
export function settleBotPurchase(birdId: number): void {
  const wallet = useWalletStore.getState();
  const price = wallet.listings[birdId];
  const bird = BIRDZ.find((b) => b.id === birdId);
  if (price == null || !bird) return;
  const proceeds = Math.round(price * (1 - SALE_FEE_RATE) * 10000) / 10000;
  wallet.delist(birdId);
  // Ownership transfers away from you.
  const owned = { ...useCollectionStore.getState().owned };
  delete owned[birdId];
  useCollectionStore.setState({ owned });
  wallet.credit(proceeds);
  wallet.addHistory({
    birdId,
    kind: "sale",
    price,
    gas: 0,
    txHash: makeTxHash(birdId),
    at: new Date().toISOString(),
  });
  logActivity({ type: "sale", birdId, price, who: "bot" });
  showToast(
    `A collector bought ${bird.name} for ${price.toFixed(4)} ETH ` +
      `(you received ${proceeds.toFixed(4)} after the ${SALE_FEE_RATE * 100}% fee)`
  );
}

export function scheduleBotBuyer(birdId: number): void {
  const delay = 8000 + mulberry32(hashString(`buyer:${birdId}`))() * 8000;
  window.setTimeout(() => settleBotPurchase(birdId), delay);
}

const DECLINE_REASONS = [
  "the seller is holding out for a Legendary premium",
  "the seller just entered diamond-hands mode",
  "the seller thinks the floor is about to rise",
  "the seller only accepts offers in full moons",
  "the seller is emotionally attached to this bird",
];

/** Bot decision: generous offers accepted; low-balls usually declined. */
export function decideOffer(offer: Offer, listPrice: number): "accepted" | "declined" {
  const ratio = offer.amount / listPrice;
  if (ratio >= 0.9) return "accepted";
  const r = mulberry32(hashString(`offer:${offer.id}:${offer.birdId}`))();
  return ratio >= 0.7 && r > 0.5 ? "accepted" : "declined";
}

export function declineReason(offerId: number): string {
  const r = mulberry32(hashString(`reason:${offerId}`))();
  return DECLINE_REASONS[Math.floor(r * DECLINE_REASONS.length)];
}

export function makeOffer(bird: Bird, amount: number): Offer {
  const wallet = useWalletStore.getState();
  const offer: Offer = {
    id: Date.now() * 100 + (txCounter += 1),
    birdId: bird.id,
    amount,
    status: "pending",
    createdAt: Date.now(),
    resolveAt:
      Date.now() +
      6000 +
      Math.floor(mulberry32(hashString(`wait:${bird.id}:${Date.now()}`))() * 6000),
  };
  wallet.addOffer(offer);
  logActivity({ type: "offer-made", birdId: bird.id, price: amount, who: "you" });
  return offer;
}

export function cancelOffer(offerId: number): void {
  const offer = useWalletStore.getState().offers.find((o) => o.id === offerId);
  if (!offer || offer.status !== "pending") return;
  useWalletStore.getState().updateOffer(offerId, "cancelled");
  logActivity({
    type: "offer-cancelled",
    birdId: offer.birdId,
    price: offer.amount,
    who: "you",
  });
}

/** Resolve one due offer; used by the timer sweep below. */
export function resolveOffer(offer: Offer): void {
  const bird = BIRDZ.find((b) => b.id === offer.birdId);
  if (!bird || offer.status !== "pending") return;
  const verdict = decideOffer(offer, bird.price);
  const wallet = useWalletStore.getState();
  if (verdict === "accepted") {
    const gas = gasFor(makeTxHash(bird.id));
    wallet.updateOffer(offer.id, "accepted");
    wallet.debit(Math.round((offer.amount + gas) * 10000) / 10000);
    useCollectionStore.getState().buy(bird.id, offer.amount);
    wallet.addHistory({
      birdId: bird.id,
      kind: "purchase",
      price: offer.amount,
      gas,
      txHash: makeTxHash(bird.id),
      at: new Date().toISOString(),
    });
    logActivity({
      type: "offer-accepted",
      birdId: bird.id,
      price: offer.amount,
      who: "bot",
    });
    showToast(`Offer accepted! ${bird.name} is yours for ${offer.amount.toFixed(4)} ETH`);
  } else {
    wallet.updateOffer(offer.id, "declined");
    logActivity({
      type: "offer-declined",
      birdId: bird.id,
      price: offer.amount,
      who: "bot",
    });
    showToast(`Offer declined — ${declineReason(offer.id)}`);
  }
}

/** Sweep for offers whose bot response is due (also covers reloads). */
export function resolveDueOffers(now = Date.now()): void {
  for (const offer of useWalletStore.getState().offers) {
    if (offer.status === "pending" && offer.resolveAt <= now) {
      resolveOffer(offer);
    }
  }
}
