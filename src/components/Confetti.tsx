import { useMemo } from "react";

const COLORS = ["#7c5cff", "#22d3ee", "#f5b74a", "#34d399", "#ff6b8b"];

/** Lightweight CSS confetti burst; renders nothing under reduced motion. */
export default function Confetti({ count = 28 }: { count?: number }) {
  const reduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 37) % 100,
        delay: ((i * 53) % 40) / 100,
        color: COLORS[i % COLORS.length],
        drift: ((i * 29) % 120) - 60,
        spin: ((i * 41) % 360) + 180,
      })),
    [count]
  );

  if (reduced) return null;

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti__piece"
          style={
            {
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              background: p.color,
              "--drift": `${p.drift}px`,
              "--spin": `${p.spin}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
