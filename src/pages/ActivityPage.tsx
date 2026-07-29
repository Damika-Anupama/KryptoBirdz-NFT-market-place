import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BIRDZ } from "../data/birdz";
import {
  useActivityStore,
  type ActivityEvent,
  type ActivityType,
} from "../stores/activity";
import { showToast } from "../stores/toast";

const TYPE_META: Record<
  ActivityType,
  { icon: string; color: string; label: string }
> = {
  purchase: { icon: "◆", color: "#34d399", label: "Purchase" },
  sale: { icon: "💰", color: "#34d399", label: "Sale" },
  like: { icon: "♥", color: "#ff6b8b", label: "Like" },
  unlike: { icon: "♡", color: "#ff6b8b", label: "Unlike" },
  "offer-made": { icon: "✉", color: "#3ba9ff", label: "Offer" },
  "offer-accepted": { icon: "✓", color: "#34d399", label: "Offer accepted" },
  "offer-declined": { icon: "✕", color: "#f5b74a", label: "Offer declined" },
  "offer-cancelled": { icon: "⊘", color: "#7d8ba1", label: "Offer cancelled" },
  listing: { icon: "🏷", color: "#a855f7", label: "Listing" },
  delisting: { icon: "🏷", color: "#7d8ba1", label: "Delisting" },
  connect: { icon: "🔌", color: "#22d3ee", label: "Connected" },
  disconnect: { icon: "🔌", color: "#7d8ba1", label: "Disconnected" },
  faucet: { icon: "🚰", color: "#22d3ee", label: "Faucet" },
};

const FILTER_GROUPS: Array<{ key: string; label: string; types: ActivityType[] }> = [
  { key: "all", label: "All", types: [] },
  { key: "purchases", label: "Purchases", types: ["purchase", "sale"] },
  { key: "likes", label: "Likes", types: ["like", "unlike"] },
  {
    key: "offers",
    label: "Offers",
    types: ["offer-made", "offer-accepted", "offer-declined", "offer-cancelled"],
  },
  { key: "listings", label: "Listings", types: ["listing", "delisting"] },
];

function useNowTick(): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(t);
  }, []);
  return now;
}

function relTime(iso: string, now: number): string {
  const diff = Math.max(0, now - new Date(iso).getTime());
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function Row({ ev, now }: { ev: ActivityEvent; now: number }) {
  const meta = TYPE_META[ev.type];
  const bird = ev.birdId ? BIRDZ.find((b) => b.id === ev.birdId) : null;
  const body = (
    <>
      <span
        className="feed__icon"
        style={{ color: meta.color, borderColor: `${meta.color}55` }}
        aria-hidden="true"
      >
        {meta.icon}
      </span>
      <span className="feed__body">
        <span className="feed__label" style={{ color: meta.color }}>
          {meta.label}
        </span>
        <span className="feed__desc">
          <span className="feed__bird">{bird ? bird.name : "—"}</span>
          {ev.price != null && <> · ◆ {ev.price.toFixed(4)}</>}
          <span className="feed__who"> · {ev.who === "you" ? "you" : "bot"}</span>
        </span>
      </span>
      <time
        className="feed__time"
        dateTime={ev.at}
        title={new Date(ev.at).toLocaleString()}
      >
        {relTime(ev.at, now)}
      </time>
    </>
  );
  return bird ? (
    <Link
      to={`/item/${String(bird.id).padStart(4, "0")}`}
      className="feed__row feed__row--link"
    >
      {body}
    </Link>
  ) : (
    <div className="feed__row">{body}</div>
  );
}

export default function ActivityPage() {
  const events = useActivityStore((s) => s.events);
  const clear = useActivityStore((s) => s.clear);
  const [group, setGroup] = useState("all");
  const [mineOnly, setMineOnly] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const now = useNowTick();

  useEffect(() => {
    document.title = "Activity — KryptoBirdz";
    window.scrollTo(0, 0);
  }, []);

  const counts = useMemo(() => {
    const scoped = mineOnly ? events.filter((e) => e.who === "you") : events;
    const map: Record<string, number> = { all: scoped.length };
    for (const g of FILTER_GROUPS.slice(1)) {
      map[g.key] = scoped.filter((e) => g.types.includes(e.type)).length;
    }
    return map;
  }, [events, mineOnly]);

  const visible = useMemo(() => {
    let list = events;
    if (mineOnly) list = list.filter((e) => e.who === "you");
    if (group !== "all") {
      const types = FILTER_GROUPS.find((g) => g.key === group)?.types ?? [];
      list = list.filter((e) => types.includes(e.type));
    }
    return list;
  }, [events, group, mineOnly]);

  return (
    <main className="docpage">
      <div className="market__head">
        <div>
          <h1 className="section-title">Activity</h1>
          <p className="section-sub">
            Everything that has happened in your demo session
          </p>
        </div>
        <div className="market__controls">
          <div className="filters" role="tablist" aria-label="Filter by type">
            {FILTER_GROUPS.map((g) => (
              <button
                key={g.key}
                role="tab"
                aria-selected={group === g.key}
                className={`filter ${group === g.key ? "is-active" : ""}`}
                onClick={() => setGroup(g.key)}
              >
                {g.label}
                <span className="filter__count">{counts[g.key] ?? 0}</span>
              </button>
            ))}
          </div>
          <button
            className={`filter ${mineOnly ? "is-active" : ""}`}
            aria-pressed={mineOnly}
            onClick={() => setMineOnly((m) => !m)}
          >
            Your events
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="empty">
          <span className="about__icon" aria-hidden="true">
            🪶
          </span>
          <p>No activity yet — go make some noise in the aviary.</p>
          <Link className="btn btn--primary" to="/market">
            Browse the collection
          </Link>
        </div>
      ) : (
        <>
          <div className="feed">
            {visible.map((ev) => (
              <Row key={ev.id} ev={ev} now={now} />
            ))}
          </div>
          <div className="feed__footer">
            {confirming ? (
              <span className="docpage__confirm">
                Clear all activity?
                <button
                  className="btn btn--primary btn--small"
                  onClick={() => {
                    clear();
                    setConfirming(false);
                    showToast("Activity history cleared");
                  }}
                >
                  Yes, clear
                </button>
                <button
                  className="btn btn--ghost btn--small"
                  onClick={() => setConfirming(false)}
                >
                  Cancel
                </button>
              </span>
            ) : (
              <button
                className="linklike"
                onClick={() => setConfirming(true)}
              >
                Clear history…
              </button>
            )}
          </div>
        </>
      )}
    </main>
  );
}
