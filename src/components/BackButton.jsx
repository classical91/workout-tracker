import { T, font } from "../theme.js";

export function BackButton({ onBack, color }) {
  return (
    <button
      onClick={onBack}
      aria-label="Go back"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: color || T.muted,
        fontSize: 13,
        fontFamily: font,
        letterSpacing: 1,
        padding: "0 0 4px",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      ← BACK
    </button>
  );
}
