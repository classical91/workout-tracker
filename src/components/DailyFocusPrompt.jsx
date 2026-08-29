import { useEffect, useRef } from "react";
import { T, font } from "../theme.js";

// Shared bottom-sheet used wherever something can be added to today's focuses.
// The wording is overridable so the trigger-point map can ask about a hotspot
// ("Focus on Upper Trapezius today?") without a second dialog implementation,
// and `secondaryLabel`/`onSecondary` add the map's "View details" escape hatch.
export function DailyFocusPrompt({
  focus,
  color,
  onConfirm,
  onDismiss,
  title,
  description,
  confirmLabel = "Yes, add focus",
  dismissLabel = "Not today",
  secondaryLabel,
  onSecondary,
}) {
  const sheetRef = useRef(null);
  const confirmRef = useRef(null);
  const open = Boolean(focus);

  useEffect(() => {
    if (!open) return undefined;

    confirmRef.current?.focus();

    // Escape closes on desktop, and Tab is kept inside the sheet so the page
    // behind the overlay can't be reached while it is up.
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onDismiss?.();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = sheetRef.current?.querySelectorAll("button, [href], [tabindex]");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onDismiss]);

  if (!open) return null;

  const buttonBase = {
    borderRadius: 11,
    padding: 12,
    fontFamily: font,
    fontWeight: 700,
    cursor: "pointer",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-focus-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 30,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: 16,
        background: "rgba(0, 0, 0, 0.62)",
      }}
    >
      <div
        ref={sheetRef}
        style={{
          width: "100%",
          maxWidth: 468,
          maxHeight: "calc(100vh - 32px)",
          overflowY: "auto",
          padding: 18,
          borderRadius: 16,
          border: `1px solid ${color}66`,
          background: T.surface2,
          boxShadow: "0 18px 60px rgba(0, 0, 0, 0.45)",
        }}
      >
        <p
          style={{
            margin: "0 0 5px",
            color,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.16em",
          }}
        >
          TODAY&apos;S FOCUS
        </p>
        <h2
          id="daily-focus-title"
          style={{ margin: "0 0 6px", fontSize: 19, lineHeight: 1.25 }}
        >
          {title || `Add ${focus.name} to today's focuses?`}
        </h2>
        <p style={{ margin: "0 0 16px", color: T.muted, fontSize: 12, lineHeight: 1.5 }}>
          {description || "It will appear on Home with any other focuses you choose today."}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
          <button
            type="button"
            onClick={onDismiss}
            style={{
              ...buttonBase,
              border: `1px solid ${T.border}`,
              background: T.surface,
              color: T.muted,
            }}
          >
            {dismissLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            style={{ ...buttonBase, border: "none", background: color, color: "#000" }}
          >
            {confirmLabel}
          </button>
        </div>
        {secondaryLabel && onSecondary && (
          <button
            type="button"
            onClick={onSecondary}
            style={{
              ...buttonBase,
              width: "100%",
              marginTop: 9,
              padding: 10,
              border: `1px solid ${color}40`,
              background: "transparent",
              color,
              fontSize: 12,
            }}
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  );
}
