import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { Link, useSearchParams } from "react-router-dom";
import BirdCard from "../components/BirdCard";
import { BIRDZ, RARITY, isRarityTier } from "../data/birdz";
import { useRecentStore } from "../stores/recent";

const FILTERS = ["All", "Legendary", "Epic", "Rare", "Common"] as const;
const SCROLL_KEY = "kb.marketScroll";

export default function MarketplacePage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const rarityParam = params.get("rarity") ?? "All";
  const trait = params.get("trait") ?? "";
  const filter = isRarityTier(rarityParam) ? rarityParam : "All";
  const recentIds = useRecentStore((s) => s.ids);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    document.title = "Marketplace — KryptoBirdz";
  }, []);

  // Remember the current filter/search string so item pages can link back
  // to the exact same market view.
  useEffect(() => {
    const s = params.toString();
    sessionStorage.setItem("kb.marketSearch", s ? `?${s}` : "");
  }, [params]);

  // Restore the grid scroll position when returning from an item page.
  useLayoutEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved) {
      window.scrollTo(0, Number(saved));
    } else {
      window.scrollTo(0, 0);
    }
    return () => {
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    };
  }, []);

  useEffect(() => {
    const onScroll = () =>
      setShowTop(window.scrollY > window.innerHeight * 2);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params);
      if (value && value !== "All") {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      setParams(next, { replace: true });
    },
    [params, setParams]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BIRDZ.filter((b) => {
      const matchesFilter = filter === "All" || b.rarity === filter;
      const matchesTrait =
        !trait || b.traits.some((t) => t.toLowerCase() === trait.toLowerCase());
      const matchesQuery =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.tokenId.toLowerCase().includes(q) ||
        b.traits.some((t) => t.toLowerCase().includes(q));
      return matchesFilter && matchesTrait && matchesQuery;
    });
  }, [filter, query, trait]);

  const recent = recentIds
    .map((id) => BIRDZ.find((b) => b.id === id))
    .filter((b): b is (typeof BIRDZ)[number] => Boolean(b));

  const hasFilters = Boolean(query || filter !== "All" || trait);

  return (
    <main className="market" id="market">
      <div className="market__bar">
        <div className="market__head">
          <div>
            <h2 className="section-title">Marketplace</h2>
            <p className="section-sub" aria-live="polite">
              Showing {visible.length} of {BIRDZ.length} birds
            </p>
          </div>
          <div className="market__controls">
            <input
              className="search"
              type="search"
              placeholder="Search name, trait or #id…"
              value={query}
              onChange={(e) => setParam("q", e.target.value || null)}
              aria-label="Search collection"
            />
            <div
              className="filters"
              role="tablist"
              aria-label="Filter by rarity"
            >
              {FILTERS.map((f) => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={filter === f}
                  className={`filter ${filter === f ? "is-active" : ""}`}
                  style={
                    isRarityTier(f)
                      ? ({ "--accent": RARITY[f].color } as React.CSSProperties)
                      : undefined
                  }
                  onClick={() => setParam("rarity", f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
        {trait && (
          <div className="market__trait-note">
            Filtering by trait <span className="chip chip--active">{trait}</span>
            <button
              className="linklike"
              onClick={() => setParam("trait", null)}
            >
              remove
            </button>
          </div>
        )}
      </div>

      {recent.length > 0 && (
        <section className="recent" aria-label="Recently viewed">
          <h3 className="recent__title">Recently viewed</h3>
          <div className="recent__strip">
            {recent.map((b) => (
              <Link
                key={b.id}
                to={`/item/${b.tokenId.replace("#", "")}`}
                className="recent__thumb"
                title={b.name}
              >
                <img src={b.image} alt={b.name} loading="lazy" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {visible.length === 0 ? (
        <div className="empty">
          <p>No birds match your filters.</p>
          <button
            className="btn btn--primary"
            onClick={() => setParams({}, { replace: true })}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid" key={`${query}|${filter}|${trait}`}>
          {visible.map((bird, i) => (
            <BirdCard key={bird.id} bird={bird} index={i} />
          ))}
        </div>
      )}

      <button
        className={`totop ${showTop ? "is-visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        aria-hidden={!showTop}
        tabIndex={showTop ? 0 : -1}
      >
        ↑
      </button>

      {hasFilters && <span data-testid="has-filters" hidden />}
    </main>
  );
}
