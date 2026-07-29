import { useMemo, useState } from "react";
import type { PricePoint } from "../data/market-sim/price-history";

interface SparklineProps {
  points: PricePoint[];
  width?: number;
  height?: number;
  accent?: string;
}

export default function Sparkline({
  points,
  width = 320,
  height = 72,
  accent = "#22d3ee",
}: SparklineProps) {
  const [hover, setHover] = useState<number | null>(null);

  const { path, area, coords } = useMemo(() => {
    const prices = points.map((p) => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const span = max - min || 1;
    const pad = 6;
    const xs = points.map(
      (_, i) => pad + (i / (points.length - 1)) * (width - pad * 2)
    );
    const ys = points.map(
      (p) => height - pad - ((p.price - min) / span) * (height - pad * 2)
    );
    const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
    const a = `${d} L${xs[xs.length - 1]},${height} L${xs[0]},${height} Z`;
    return { path: d, area: a, coords: xs.map((x, i) => ({ x, y: ys[i] })) };
  }, [points, width, height]);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;
    let best = 0;
    let bestDist = Infinity;
    coords.forEach((c, i) => {
      const d = Math.abs(c.x - x);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setHover(best);
  };

  const h = hover != null ? points[hover] : null;

  return (
    <div className="sparkline">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="sparkline__svg"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label={`Price history: ${points[0]?.price} to ${
          points[points.length - 1]?.price
        } ETH over ${points.length} days`}
      >
        <path d={area} fill={accent} opacity="0.12" />
        <path d={path} fill="none" stroke={accent} strokeWidth="2" />
        {hover != null && (
          <>
            <line
              x1={coords[hover].x}
              y1={0}
              x2={coords[hover].x}
              y2={height}
              stroke={accent}
              strokeWidth="1"
              opacity="0.4"
            />
            <circle
              cx={coords[hover].x}
              cy={coords[hover].y}
              r="4"
              fill={accent}
            />
          </>
        )}
      </svg>
      <div className="sparkline__tip" aria-live="polite">
        {h ? (
          <>
            <strong>{h.price.toFixed(3)} ETH</strong> · {h.date}
          </>
        ) : (
          <span className="sparkline__hint">Hover for price &amp; date</span>
        )}
      </div>
    </div>
  );
}
