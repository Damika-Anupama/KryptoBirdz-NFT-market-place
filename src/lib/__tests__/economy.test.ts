import { beforeEach, describe, expect, it } from "vitest";
import { BIRDZ } from "../../data/birdz";
import {
  SALE_FEE_RATE,
  decideOffer,
  gasFor,
  makeOffer,
  makeTxHash,
  quotePurchase,
  resolveOffer,
  settleBotPurchase,
  settlePurchase,
  txFails,
} from "../economy";
import { useActivityStore } from "../../stores/activity";
import { useCollectionStore } from "../../stores/collection";
import { useWalletStore, PERSONAS } from "../../stores/wallet";

const bird = BIRDZ[3]; // Frost Sparrow, 0.65 ETH — cheap enough for all personas

function freshWallet() {
  localStorage.clear();
  useWalletStore.setState({
    connectedId: null,
    balances: {},
    listings: {},
    offers: [],
    history: [],
    faucetClaims: {},
  });
  useCollectionStore.setState({ owned: {} });
  useActivityStore.setState({ events: [], nextId: 1 });
  useWalletStore.getState().connect(PERSONAS[0].id);
}

beforeEach(freshWallet);

describe("tx primitives", () => {
  it("generates unique 66-char hashes", () => {
    const a = makeTxHash(1);
    const b = makeTxHash(1);
    expect(a).toMatch(/^0x[0-9a-f]{64}$/);
    expect(a).not.toBe(b);
  });

  it("gas is deterministic per hash and within the realistic band", () => {
    const h = makeTxHash(2);
    expect(gasFor(h)).toBe(gasFor(h));
    for (let i = 0; i < 30; i++) {
      const g = gasFor(makeTxHash(i));
      expect(g).toBeGreaterThanOrEqual(0.001);
      expect(g).toBeLessThanOrEqual(0.008);
    }
  });

  it("failure verdict is deterministic per hash", () => {
    const h = makeTxHash(3);
    expect(txFails(h)).toBe(txFails(h));
  });
});

describe("settlePurchase", () => {
  it("debits price+gas, records ownership, history, and activity", () => {
    // Find a quote that will not revert.
    let quote = quotePurchase(bird);
    for (let i = 0; i < 200 && txFails(quote.txHash); i++) {
      quote = quotePurchase(bird);
    }
    const before = useWalletStore.getState().balances[PERSONAS[0].id];
    expect(settlePurchase(bird, quote)).toBe(true);
    const after = useWalletStore.getState().balances[PERSONAS[0].id];
    expect(after).toBeCloseTo(before - quote.total, 4);
    expect(useCollectionStore.getState().owned[bird.id]).toBeDefined();
    expect(useWalletStore.getState().history[0].txHash).toBe(quote.txHash);
    expect(useActivityStore.getState().events[0].type).toBe("purchase");
  });

  it("a reverting tx leaves the balance and ownership untouched", () => {
    let quote = quotePurchase(bird);
    for (let i = 0; i < 400 && !txFails(quote.txHash); i++) {
      quote = quotePurchase(bird);
    }
    if (!txFails(quote.txHash)) return; // statistically unreachable
    const before = useWalletStore.getState().balances[PERSONAS[0].id];
    expect(settlePurchase(bird, quote)).toBe(false);
    expect(useWalletStore.getState().balances[PERSONAS[0].id]).toBe(before);
    expect(useCollectionStore.getState().owned[bird.id]).toBeUndefined();
  });
});

describe("offers", () => {
  it("generous offers (>=90% of list) are always accepted", () => {
    const offer = makeOffer(bird, bird.price);
    expect(decideOffer(offer, bird.price)).toBe("accepted");
  });

  it("low-ball offers (<70% of list) are always declined", () => {
    const offer = makeOffer(bird, bird.price * 0.5);
    expect(decideOffer(offer, bird.price)).toBe("declined");
  });

  it("an accepted offer transfers ownership and debits the wallet", () => {
    const offer = makeOffer(bird, bird.price);
    const before = useWalletStore.getState().balances[PERSONAS[0].id];
    resolveOffer(offer);
    const state = useWalletStore.getState();
    expect(state.offers.find((o) => o.id === offer.id)?.status).toBe(
      "accepted"
    );
    expect(useCollectionStore.getState().owned[bird.id]).toBeDefined();
    expect(state.balances[PERSONAS[0].id]).toBeLessThan(before);
  });

  it("offer-made and resolution events land in the activity feed", () => {
    const offer = makeOffer(bird, bird.price);
    resolveOffer(offer);
    const types = useActivityStore.getState().events.map((e) => e.type);
    expect(types).toContain("offer-made");
    expect(types).toContain("offer-accepted");
  });
});

describe("listings and bot buyer", () => {
  it("bot purchase credits proceeds minus fee and removes ownership", () => {
    useCollectionStore.getState().buy(bird.id, bird.price);
    useWalletStore.getState().list(bird.id, 2);
    const before = useWalletStore.getState().balances[PERSONAS[0].id];
    settleBotPurchase(bird.id);
    const after = useWalletStore.getState().balances[PERSONAS[0].id];
    expect(after).toBeCloseTo(before + 2 * (1 - SALE_FEE_RATE), 4);
    expect(useCollectionStore.getState().owned[bird.id]).toBeUndefined();
    expect(useWalletStore.getState().listings[bird.id]).toBeUndefined();
    expect(useWalletStore.getState().history[0].kind).toBe("sale");
  });
});

describe("wallet store", () => {
  it("connect initialises the persona's starting balance once", () => {
    expect(useWalletStore.getState().balances[PERSONAS[0].id]).toBe(
      PERSONAS[0].start
    );
    useWalletStore.getState().debit(1);
    useWalletStore.getState().disconnect();
    useWalletStore.getState().connect(PERSONAS[0].id);
    expect(useWalletStore.getState().balances[PERSONAS[0].id]).toBe(
      PERSONAS[0].start - 1
    );
  });

  it("faucet claim credits 1 ETH and records the claim time", () => {
    const before = useWalletStore.getState().balances[PERSONAS[0].id];
    useWalletStore.getState().claimFaucet();
    expect(useWalletStore.getState().balances[PERSONAS[0].id]).toBeCloseTo(
      before + 1,
      4
    );
    expect(
      useWalletStore.getState().faucetClaims[PERSONAS[0].id]
    ).toBeGreaterThan(0);
  });

  it("reset restores the starting balance and clears everything", () => {
    useWalletStore.getState().debit(3);
    useWalletStore.getState().list(1, 5);
    useWalletStore.getState().claimFaucet();
    useWalletStore.getState().resetWallet();
    const s = useWalletStore.getState();
    expect(s.balances[PERSONAS[0].id]).toBe(PERSONAS[0].start);
    expect(Object.keys(s.listings)).toHaveLength(0);
    expect(s.history).toHaveLength(0);
    expect(Object.keys(s.faucetClaims)).toHaveLength(0);
  });
});
