import { useEffect } from "react";

const SHORTCUTS: Array<[string, string]> = [
  ["← / →", "Previous / next bird (on item pages)"],
  ["Esc", "Close lightbox or dialogs"],
  ["+ / −", "Zoom in / out inside the lightbox"],
  ["?", "Toggle this help"],
];

export default function ShortcutsModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onClick={onClose}
    >
      <div
        className="panel shortcuts"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="panel__title">Keyboard shortcuts</h3>
        <dl className="shortcuts__list">
          {SHORTCUTS.map(([keys, desc]) => (
            <div key={keys} className="shortcuts__row">
              <dt>
                <kbd>{keys}</kbd>
              </dt>
              <dd>{desc}</dd>
            </div>
          ))}
        </dl>
        <button className="btn btn--primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
