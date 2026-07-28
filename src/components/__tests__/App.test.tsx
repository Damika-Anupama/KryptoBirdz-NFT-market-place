import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { BIRDZ } from "../../data/birdz";

describe("App smoke", () => {
  it("renders the shell: nav brand, hero title, marketplace, footer", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: /collect the flock/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /marketplace/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/demonstration build/i)).toBeInTheDocument();
  });

  it("renders one card per bird", () => {
    render(<App />);
    expect(screen.getAllByRole("article")).toHaveLength(BIRDZ.length);
  });
});

describe("search", () => {
  it("filters the grid by name", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByRole("searchbox"), "phoenix");
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(1);
    expect(within(cards[0]).getByText("Solar Phoenix")).toBeInTheDocument();
  });

  it("shows the empty state for a no-match query", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByRole("searchbox"), "zzzz");
    expect(screen.getByText(/no birds match/i)).toBeInTheDocument();
  });
});

describe("rarity filter", () => {
  it("narrows to legendary birds only", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("tab", { name: "Legendary" }));
    const legendary = BIRDZ.filter((b) => b.rarity === "Legendary");
    expect(screen.getAllByRole("article")).toHaveLength(legendary.length);
  });
});

describe("toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("appears on Buy and auto-dismisses", () => {
    render(<App />);
    const firstCard = screen.getAllByRole("article")[0];
    fireEvent.click(within(firstCard).getByRole("button", { name: /buy now/i }));
    const toast = screen.getByRole("status");
    expect(toast).toHaveClass("is-visible");
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(toast).not.toHaveClass("is-visible");
  });
});
