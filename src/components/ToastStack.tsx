import { MAX_VISIBLE_TOASTS, useToastStore } from "../stores/toast";

export default function ToastStack() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  const setPaused = useToastStore((s) => s.setPaused);

  const visible = toasts.slice(0, MAX_VISIBLE_TOASTS);
  const overflow = toasts.length - visible.length;

  return (
    <div className="toaststack" role="region" aria-label="Notifications">
      {visible.map((t, i) => (
        <div
          key={t.id}
          className="toaststack__toast"
          style={{ "--stack-i": i } as React.CSSProperties}
          role="status"
          onPointerEnter={() => setPaused(t.id, true)}
          onPointerLeave={() => setPaused(t.id, false)}
        >
          <span className="toaststack__msg">{t.message}</span>
          <button
            className="toaststack__close"
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss notification"
          >
            ✕
          </button>
          <span
            className={`toaststack__progress ${t.paused ? "is-paused" : ""}`}
            style={{ animationDuration: `${t.duration}ms` }}
          />
        </div>
      ))}
      {overflow > 0 && (
        <div className="toaststack__overflow">+{overflow} more</div>
      )}
    </div>
  );
}
