import { T, display } from "../theme.js";
import { BackButton } from "./BackButton.jsx";

export function ScreenHeader({ title, subtitle, emoji, color, onBack }) {
  return (
    <div
      style={{ padding: "28px 20px 16px", borderBottom: `1px solid ${T.border}`, marginBottom: 16 }}
    >
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        <BackButton onBack={onBack} color={color} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
          <span style={{ fontSize: 36 }}>{emoji}</span>
          <div>
            <p style={{ fontSize: 10, letterSpacing: 3, color: T.muted, fontWeight: 600 }}>
              {subtitle}
            </p>
            <h1
              style={{ fontFamily: display, fontSize: 32, color, letterSpacing: 1, lineHeight: 1 }}
            >
              {title}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
