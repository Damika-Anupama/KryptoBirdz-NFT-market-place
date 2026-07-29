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
import { useActivityStore } from "../../stores/activity";
import { useCollectionStore } from "../../stores/collection";
import { useFavoritesStore } from "../../stores/favorites";
import { useRecentStore } from "../../stores/recent";
import { useToastStore } from "../../stores/toast";
import { PERSONAS, useWalletStore } from "../../stores/wallet";

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
  useToastStore.getState().clearAll();
  useActivityStore.setState({ events: [], nextId: 1 });
  useWalletStore.setState({
    connectedId: null,
    balances: {},
    listings: {},
    offers: [],
    history: [],
    faucetClaims: {},
  });
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

  it("prompts to connect when buying without a wallet", async () => {
    const user = userEvent.setup();
    renderAt("#/item/0003");
    const buyBtn = await screen.findByRole("button", {
      name: /connect to buy/i,
    });
    await user.click(buyBtn);
    expect(
      await screen.findByRole("dialog", { name: /connect a demo wallet/i })
    ).toBeInTheDocument();
  });

  it("connected wallet sees Buy now and can open the purchase review", async () => {
    useWalletStore.getState().connect(PERSONAS[0].id);
    const user = userEvent.setup();
    renderAt("#/item/0003");
    const buyBtn = await screen.findByRole("button", { name: /buy now/i });
    await user.click(buyBtn);
    expect(await screen.findByText(/review purchase/i)).toBeInTheDocument();
    expect(screen.getByText(/est\. gas fee/i)).toBeInTheDocument();
  });

  it("owned birds offer List for sale instead of Buy", async () => {
    useWalletStore.getState().connect(PERSONAS[0].id);
    useCollectionStore.getState().buy(3, 2.8);
    renderAt("#/item/0003");
    expect(
      await screen.findByRole("button", { name: /list for sale/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Owned by you")).toBeInTheDocument();
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

describe("wallet connect flow", () => {
  it("connect modal lists 3 personas; choosing one shows the balance pill", async () => {
    const user = userEvent.setup();
    renderAt("#/");
    const btn = await screen.findByRole("button", { name: /connect wallet/i });
    await user.click(btn);
    const dialog = await screen.findByRole("dialog", {
      name: /connect a demo wallet/i,
    });
    expect(within(dialog).getAllByRole("button")).toHaveLength(4); // 3 personas + cancel
    await user.click(within(dialog).getByText(PERSONAS[0].name));
    expect(useWalletStore.getState().connectedId).toBe(PERSONAS[0].id);
    expect(
      await screen.findByLabelText(/balance 10\.0000 eth/i)
    ).toBeInTheDocument();
    // Connected toast lands in the stack, and the connect event is logged.
    expect(screen.getByText(/wallet connected/i)).toBeInTheDocument();
    expect(useActivityStore.getState().events[0].type).toBe("connect");
  });
});

describe("activity page", () => {
  it("shows an empty state with a browse CTA when nothing has happened", async () => {
    renderAt("#/activity");
    expect(await screen.findByText(/no activity yet/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /browse the collection/i })
    ).toBeInTheDocument();
  });

  it("lists events with type filters and counts", async () => {
    useActivityStore.getState().log({
      type: "purchase",
      birdId: 1,
      price: 4.2,
      who: "you",
    });
    useActivityStore.getState().log({
      type: "like",
      birdId: 2,
      price: null,
      who: "you",
    });
    renderAt("#/activity");
    expect(await screen.findByText("Celestial Songbird")).toBeInTheDocument();
    const likesTab = screen.getByRole("tab", { name: /likes/i });
    expect(likesTab).toHaveTextContent("1");
    const user = userEvent.setup();
    await user.click(likesTab);
    expect(screen.queryByText("Celestial Songbird")).not.toBeInTheDocument();
    expect(screen.getByText("Neon Nightjar")).toBeInTheDocument();
  });
});

describe("toast stack", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows at most 3 toasts with an overflow counter and auto-dismisses", () => {
    renderAt("#/");
    act(() => {
      for (let i = 1; i <= 5; i++) {
        useToastStore.getState().show(`toast ${i}`);
      }
    });
    expect(screen.getAllByRole("status")).toHaveLength(3);
    expect(screen.getByText("+2 more")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(3300);
    });
    expect(screen.queryAllByRole("status")).toHaveLength(0);
  });

  it("close button dismisses a toast immediately", () => {
    renderAt("#/");
    act(() => {
      useToastStore.getState().show("bye");
    });
    fireEvent.click(screen.getByRole("button", { name: /dismiss/i }));
    expect(screen.queryByText("bye")).not.toBeInTheDocument();
  });
});
