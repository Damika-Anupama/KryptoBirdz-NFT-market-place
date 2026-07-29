import { useCallback, useEffect, useState } from "react";

interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const ZOOM_STEPS = [1, 1.5, 2.25, 3];

export default function Lightbox({ src, alt, onClose }: LightboxProps) {
  const [zoomIdx, setZoomIdx] = useState(0);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") {
        setZoomIdx((i) => Math.min(i + 1, ZOOM_STEPS.length - 1));
      }
      if (e.key === "-") setZoomIdx((i) => Math.max(i - 1, 0));
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onKey]);

  const zoom = ZOOM_STEPS[zoomIdx];

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} — enlarged view`}
      onClick={onClose}
    >
      <div className="lightbox__inner" onClick={(e) => e.stopPropagation()}>
        <img
          src={src}
          alt={alt}
          className="lightbox__img"
          style={{ transform: `scale(${zoom})` }}
        />
      </div>
      <div className="lightbox__controls" onClick={(e) => e.stopPropagation()}>
        <button
          className="btn btn--ghost"
          onClick={() => setZoomIdx((i) => Math.max(i - 1, 0))}
          disabled={zoomIdx === 0}
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          className="btn btn--ghost"
          onClick={() => setZoomIdx(0)}
          disabled={zoomIdx === 0}
        >
          Reset
        </button>
        <button
          className="btn btn--ghost"
          onClick={() =>
            setZoomIdx((i) => Math.min(i + 1, ZOOM_STEPS.length - 1))
          }
          disabled={zoomIdx === ZOOM_STEPS.length - 1}
          aria-label="Zoom in"
        >
          +
        </button>
        <button className="btn btn--primary" onClick={onClose}>
          Close ✕
        </button>
      </div>
    </div>
  );
}
