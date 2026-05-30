import { T, font } from "../theme.js";

// Shown when localStorage writes fail (full, disabled, or private browsing) so
// the user knows their progress may not be saved instead of failing silently.
export function StorageWarning() {
  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: T.red,
        color: "#fff",
        fontFamily: font,
        fontSize: 13,
        fontWeight: 600,
        textAlign: "center",
        padding: "10px 16px",
        boxShadow: "0 -2px 12px rgba(0,0,0,0.4)",
      }}
    >
      ⚠️ Progress could not be saved on this device — it may be lost when you leave.
    </div>
  );
}
