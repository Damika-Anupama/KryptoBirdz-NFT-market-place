import { describe, expect, it } from "vitest";
import { BIRDZ } from "../../birdz";
import { hashString, mulberry32 } from "../rng";
import { getPriceHistory } from "../price-history";
import { getProvenance } from "../provenance";

describe("rng", () => {
  it("is deterministic for the same seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("differs across seeds", () => {
    expect(mulberry32(1)()).not.toBe(mulberry32(2)());
  });

  it("hashString is stable and 32-bit", () => {
    expect(hashString("#0001")).toBe(hashString("#0001"));
    expect(hashString("#0001")).not.toBe(hashString("#0002"));
    expect(hashString("anything")).toBeGreaterThanOrEqual(0);
  });
});

describe("price history", () => {
  const bird = BIRDZ[0];

  it("is deterministic per token", () => {
    expect(getPriceHistory(bird)).toEqual(getPriceHistory(bird));
  });

  it("ends exactly at the bird's list price", () => {
    const series = getPriceHistory(bird);
    expect(series[series.length - 1].price).toBeCloseTo(bird.price, 3);
    expect(series[series.length - 1].daysAgo).toBe(0);
  });

  it("has the requested length and positive prices", () => {
    const series = getPriceHistory(bird, 14);
    expect(series).toHaveLength(14);
    for (const p of series) {
      expect(p.price).toBeGreaterThan(0);
      expect(p.date).toMatch(/^[A-Z][a-z]{2} \d{1,2}$/);
    }
  });
});

describe("provenance", () => {
  it("is deterministic per token and starts with a mint", () => {
    for (const bird of BIRDZ) {
      const events = getProvenance(bird);
      expect(events).toEqual(getProvenance(bird));
      expect(events[0].type).toBe("mint");
      expect(events[0].from).toBeNull();
    }
  });

  it("ends with the current owner receiving the bird", () => {
    for (const bird of BIRDZ) {
      const events = getProvenance(bird);
      expect(events[events.length - 1].to).toBe(bird.owner);
    }
  });

  it("orders events from oldest to newest", () => {
    const events = getProvenance(BIRDZ[7]);
    for (let i = 1; i < events.length; i++) {
      expect(events[i].daysAgo).toBeLessThanOrEqual(events[i - 1].daysAgo);
    }
  });
});
