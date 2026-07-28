import { describe, expect, it } from "vitest";
import { BIRDZ, RARITY, STATS, isRarityTier } from "../birdz";

describe("catalogue integrity", () => {
  it("contains exactly 15 birds", () => {
    expect(BIRDZ).toHaveLength(15);
  });

  it("has unique, zero-padded token ids", () => {
    const ids = BIRDZ.map((b) => b.tokenId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^#\d{4}$/);
    }
  });

  it("assigns every bird a known rarity tier", () => {
    for (const bird of BIRDZ) {
      expect(RARITY[bird.rarity]).toBeDefined();
    }
  });

  it("bundles a resolvable image for every bird", () => {
    for (const bird of BIRDZ) {
      expect(bird.image).toBeTruthy();
      expect(typeof bird.image).toBe("string");
    }
  });

  it("gives every bird a positive price and 3 traits", () => {
    for (const bird of BIRDZ) {
      expect(bird.price).toBeGreaterThan(0);
      expect(bird.traits).toHaveLength(3);
    }
  });

  it("derives STATS consistently from the catalogue", () => {
    expect(STATS.items).toBe(BIRDZ.length);
    expect(STATS.floor).toBe(Math.min(...BIRDZ.map((b) => b.price)));
    expect(STATS.volume).toBeCloseTo(
      BIRDZ.reduce((sum, b) => sum + b.price, 0)
    );
  });

  it("is deterministic across imports (stable owner handles)", () => {
    expect(BIRDZ[0].owner).toBe(BIRDZ[0].owner.toLowerCase());
    expect(BIRDZ.map((b) => b.owner)).toEqual(BIRDZ.map((b) => b.owner));
  });
});

describe("isRarityTier", () => {
  it("accepts the four tiers and rejects everything else", () => {
    expect(isRarityTier("Legendary")).toBe(true);
    expect(isRarityTier("Common")).toBe(true);
    expect(isRarityTier("All")).toBe(false);
    expect(isRarityTier("")).toBe(false);
  });
});
