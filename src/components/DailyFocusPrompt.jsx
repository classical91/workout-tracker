import { T, font } from "../theme.js";

export function DailyFocusPrompt({ focus, color, onConfirm, onDismiss }) {
  if (!focus) return null;

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
        style={{
          width: "100%",
          maxWidth: 468,
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
          Add {focus.name} to today&apos;s focuses?
        </h2>
        <p style={{ margin: "0 0 16px", color: T.muted, fontSize: 12, lineHeight: 1.5 }}>
          It will appear on Home with any other focuses you choose today.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
          <button
            type="button"
            onClick={onDismiss}
            style={{
              border: `1px solid ${T.border}`,
              borderRadius: 11,
              padding: 12,
              background: T.surface,
              color: T.muted,
              fontFamily: font,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Not today
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              border: "none",
              borderRadius: 11,
              padding: 12,
              background: color,
              color: "#000",
              fontFamily: font,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Yes, add focus
          </button>
        </div>
      </div>
    </div>
  );
}
