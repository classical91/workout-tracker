import { T } from "../theme.js";

export function ProgressBar({ done, total, color }) {
  const safeTotal = total > 0 ? total : 1;
  const pct = Math.round((done / safeTotal) * 100);
  return (
    <div
      role="progressbar"
      aria-valuenow={done}
      aria-valuemin={0}
      aria-valuemax={total}
      style={{
        background: `${color}10`,
        border: `1px solid ${color}25`,
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 16,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: T.muted, letterSpacing: 1, fontWeight: 600 }}>
          PROGRESS
        </span>
        <span style={{ fontSize: 11, color, fontWeight: 700 }}>
          {done}/{total}
        </span>
      </div>
      <div style={{ height: 6, background: T.surface2, borderRadius: 99, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 99,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}
