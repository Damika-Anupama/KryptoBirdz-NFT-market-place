import { useEffect, useRef, useState } from "react";

const REDUCED = () =>
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Rolls the displayed balance toward the real value instead of jumping,
 * flashing green on increase and red on decrease.
 */
export default function BalanceTicker({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prev = useRef(value);
  const raf = useRef(0);

  useEffect(() => {
    const from = prev.current;
    if (from === value) return;
    setFlash(value > from ? "up" : "down");
    const flashTimer = window.setTimeout(() => setFlash(null), 900);
    prev.current = value;

    if (REDUCED()) {
      setDisplay(value);
      return () => window.clearTimeout(flashTimer);
    }

    const start = performance.now();
    const dur = 600;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (value - from) * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      window.clearTimeout(flashTimer);
    };
  }, [value]);

  return (
    <span
      className={`balance ${flash ? `balance--${flash}` : ""}`}
      aria-label={`Balance ${value.toFixed(4)} ETH`}
    >
      ◆ {display.toFixed(4)}
    </span>
  );
}
