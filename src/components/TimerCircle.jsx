import { T } from "../theme.js";

export function TimerCircle({
  size = 220,
  radius = 90,
  viewBox = "0 0 200 200",
  cx = 100,
  cy = 100,
  strokeWidth = 8,
  color,
  pct = 0,
  smooth = true,
  children,
}) {
  const C = 2 * Math.PI * radius;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg viewBox={viewBox} width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={T.surface2}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={C}
          strokeDashoffset={C * (1 - pct / 100)}
          strokeLinecap="round"
          style={{ transition: smooth ? "stroke-dashoffset 0.8s ease" : "none" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          textAlign: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
