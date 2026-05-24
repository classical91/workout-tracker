import { display } from "../theme.js";

export function CompletionBanner({ color, emoji, text }) {
  return (
    <div
      style={{
        marginTop: 16,
        background: `${color}15`,
        border: `1px solid ${color}40`,
        borderRadius: 14,
        padding: 18,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 6 }}>{emoji}</div>
      <p style={{ fontFamily: display, fontSize: 24, color, letterSpacing: 1 }}>{text}</p>
    </div>
  );
}
