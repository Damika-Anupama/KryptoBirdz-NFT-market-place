import { beforeEach, describe, expect, it } from "vitest";
import { useCollectionStore } from "../collection";
import { useFavoritesStore } from "../favorites";
import { useRecentStore } from "../recent";

beforeEach(() => {
  localStorage.clear();
  useFavoritesStore.getState().reset();
  useCollectionStore.getState().reset();
  useRecentStore.getState().reset();
});

describe("favorites store", () => {
  it("toggles likes on and off", () => {
    const s = useFavoritesStore.getState();
    s.toggle(3);
    expect(useFavoritesStore.getState().liked[3]).toBe(true);
    useFavoritesStore.getState().toggle(3);
    expect(useFavoritesStore.getState().liked[3]).toBeUndefined();
  });

  it("persists to localStorage under kb.favorites", () => {
    useFavoritesStore.getState().toggle(5);
    expect(localStorage.getItem("kb.favorites")).toContain('"5"');
  });
});

describe("collection store", () => {
  it("records purchases with price and timestamp", () => {
    useCollectionStore.getState().buy(7, 1.7);
    const rec = useCollectionStore.getState().owned[7];
    expect(rec.price).toBe(1.7);
    expect(rec.at).toBeTruthy();
  });
});

describe("recent store", () => {
  it("keeps most-recent-first, deduped, capped at 8", () => {
    const s = useRecentStore.getState;
    for (let i = 1; i <= 10; i++) s().record(i);
    s().record(5);
    expect(s().ids[0]).toBe(5);
    expect(s().ids).toHaveLength(8);
    expect(new Set(s().ids).size).toBe(8);
  });
});
