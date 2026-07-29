import { useState } from "react";
import { BIRDZ } from "../data/birdz";
import { useCollectionStore } from "../stores/collection";
import { useFavoritesStore } from "../stores/favorites";
import { useRecentStore } from "../stores/recent";
import { showToast } from "../stores/toast";

type Scenario = "fresh" | "collector" | "whale";

function applyScenario(s: Scenario) {
  const fav = useFavoritesStore.getState();
  const col = useCollectionStore.getState();
  const rec = useRecentStore.getState();
  fav.reset();
  col.reset();
  rec.reset();
  if (s === "collector") {
    [2, 5, 9].forEach((id) => {
      const b = BIRDZ.find((x) => x.id === id);
      if (b) col.buy(b.id, b.price);
    });
    [1, 3, 5, 7].forEach((id) => fav.toggle(id));
    [2, 5, 9, 1].forEach((id) => rec.record(id));
  }
  if (s === "whale") {
    BIRDZ.slice(0, 8).forEach((b) => col.buy(b.id, b.price));
    BIRDZ.slice(0, 10).forEach((b) => fav.toggle(b.id));
    BIRDZ.slice(0, 8).forEach((b) => rec.record(b.id));
  }
  showToast(`Scenario applied: ${s}`);
}

export default function DebugPanel() {
  const [open, setOpen] = useState(false);
  const liked = useFavoritesStore((s) => s.liked);
  const owned = useCollectionStore((s) => s.owned);
  const recent = useRecentStore((s) => s.ids);

  return (
    <div className="debug">
      <button
        className="debug__toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        🐞 debug
      </button>
      {open && (
        <div className="debug__panel panel">
          <h3 className="panel__title">Debug</h3>
          <div className="debug__scenarios">
            <span>Seed scenario:</span>
            {(["fresh", "collector", "whale"] as const).map((s) => (
              <button
                key={s}
                className="btn btn--ghost btn--small"
                onClick={() => applyScenario(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <pre className="json debug__state">
            {JSON.stringify(
              {
                favorites: Object.keys(liked).map(Number),
                owned: Object.keys(owned).map(Number),
                recent,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
