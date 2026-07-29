import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { BIRDZ } from "../../data/birdz";
import { useCollectionStore } from "../../stores/collection";
import { useFavoritesStore } from "../../stores/favorites";
import { useRecentStore } from "../../stores/recent";

function renderAt(hash: string) {
  window.location.hash = hash;
  return render(<App />);
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  useFavoritesStore.getState().reset();
  useCollectionStore.getState().reset();
  useRecentStore.getState().reset();
});

afterEach(() => {
  cleanup();
  window.location.hash = "";
});

describe("shell + home", () => {
  it("renders hero, nav, and footer wave stamp at /", async () => {
    renderAt("#/");
    expect(
      await screen.findByRole("heading", { level: 1, name: /collect the flock/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Marketplace" })
    ).toBeInTheDocument();
    expect(screen.getByText(/demonstration build/i)).toBeInTheDocument();
  });
});

describe("marketplace route", () => {
  it("renders one card per bird at /market", async () => {
    renderAt("#/market");
    const cards = await screen.findAllByRole("article");
    expect(cards).toHaveLength(BIRDZ.length);
  });

  it("restores a search query from the URL (?q=)", async () => {
    renderAt("#/market?q=phoenix");
    const cards = await screen.findAllByRole("article");
    expect(cards).toHaveLength(1);
    expect(within(cards[0]).getByText("Solar Phoenix")).toBeInTheDocument();
  });

  it("restores a rarity filter from the URL (?rarity=)", async () => {
    renderAt("#/market?rarity=Legendary");
    const legendary = BIRDZ.filter((b) => b.rarity === "Legendary");
    const cards = await screen.findAllByRole("article");
    expect(cards).toHaveLength(legendary.length);
  });

  it("filters by trait from the URL (?trait=)", async () => {
    renderAt("#/market?trait=Nocturnal");
    const nocturnal = BIRDZ.filter((b) => b.traits.includes("Nocturnal"));
    const cards = await screen.findAllByRole("article");
    expect(cards).toHaveLength(nocturnal.length);
  });

  it("typing in search updates the URL and narrows the grid", async () => {
    const user = userEvent.setup();
    renderAt("#/market");
    const box = await screen.findByRole("searchbox");
    await user.type(box, "raven");
    expect(await screen.findAllByRole("article")).toHaveLength(1);
    expect(window.location.hash).toContain("q=raven");
  });

  it("shows empty state with a working clear-filters button", async () => {
    const user = userEvent.setup();
    renderAt("#/market?q=zzzz");
    expect(await screen.findByText(/no birds match/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /clear filters/i }));
    expect(await screen.findAllByRole("article")).toHaveLength(BIRDZ.length);
  });

  it("persists likes across a re-render via the store", async () => {
    const user = userEvent.setup();
    renderAt("#/market");
    const cards = await screen.findAllByRole("article");
    const likeBtn = within(cards[0]).getByRole("button", { name: /like/i });
    const before = likeBtn.textContent;
    await user.click(likeBtn);
    expect(likeBtn.textContent).not.toBe(before);
    expect(Object.keys(useFavoritesStore.getState().liked)).toHaveLength(1);
  });
});

describe("item route", () => {
  it("renders the full detail page for a valid token", async () => {
    renderAt("#/item/0001");
    expect(
      await screen.findByRole("heading", { level: 1, name: "Celestial Songbird" })
    ).toBeInTheDocument();
    expect(screen.getByText("#0001")).toBeInTheDocument();
    expect(screen.getByText(/price history/i)).toBeInTheDocument();
    expect(screen.getByText(/provenance/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Market" })).toBeInTheDocument();
  });

  it("shows an unknown-token page with a back link for bad ids", async () => {
    renderAt("#/item/9999");
    expect(await screen.findByText(/unknown token/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to the marketplace/i })
    ).toBeInTheDocument();
  });

  it("disables Prev on the first token and Next on the last", async () => {
    renderAt("#/item/0001");
    expect(
      await screen.findByRole("button", { name: /previous bird/i })
    ).toBeDisabled();
    cleanup();
    renderAt(`#/item/${String(BIRDZ.length).padStart(4, "0")}`);
    expect(
      await screen.findByRole("button", { name: /next bird/i })
    ).toBeDisabled();
  });

  it("simulated buy records ownership and shows the owned badge", async () => {
    const user = userEvent.setup();
    renderAt("#/item/0003");
    const buyBtn = await screen.findByRole("button", { name: /buy now/i });
    await user.click(buyBtn);
    expect(useCollectionStore.getState().owned[3]).toBeDefined();
    expect(await screen.findByText("Owned by you")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /in your collection/i })
    ).toBeDisabled();
  });

  it("records the visit in recently-viewed", async () => {
    renderAt("#/item/0002");
    await screen.findByRole("heading", { level: 1, name: "Neon Nightjar" });
    expect(useRecentStore.getState().ids).toContain(2);
  });
});

describe("404 route", () => {
  it("renders the lost-bird page for unknown paths", async () => {
    renderAt("#/definitely-not-a-page");
    expect(
      await screen.findByText(/this bird has flown/i)
    ).toBeInTheDocument();
  });
});

describe("toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("appears on Connect Wallet and auto-dismisses", async () => {
    window.location.hash = "#/";
    render(<App />);
    const btn = await vi.waitFor(() => {
      const b = screen.getByRole("button", { name: /connect wallet/i });
      return b;
    });
    fireEvent.click(btn);
    const toast = screen.getByRole("status");
    expect(toast).toHaveClass("is-visible");
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(toast).not.toHaveClass("is-visible");
  });
});
