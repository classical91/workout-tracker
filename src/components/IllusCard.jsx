import { useState } from "react";
import { T } from "../theme.js";

export function IllusCard({
  label,
  muscles,
  detail,
  reps,
  done,
  color,
  onToggle,
  illusKey,
  IllusMap,
  image,
  link,
}) {
  const [open, setOpen] = useState(false);
  const Illus = image || (IllusMap && IllusMap[illusKey]);

  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        marginBottom: 8,
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        aria-pressed={done}
        onClick={onToggle}
        style={{
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
          padding: "14px 16px",
          cursor: "pointer",
          width: "100%",
          background: "transparent",
          border: "none",
          color: T.text,
          font: "inherit",
          textAlign: "left",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 24,
            height: 24,
            borderRadius: 7,
            border: `2px solid ${color}`,
            background: done ? color : "transparent",
            flexShrink: 0,
            marginTop: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {done && <span style={{ fontSize: 13, color: "#000", fontWeight: 800 }}>✓</span>}
        </span>
        <span style={{ flex: 1 }}>
          <span
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: done ? T.muted : T.text,
                textDecoration: done ? "line-through" : "none",
              }}
            >
              {label}
            </span>
            {reps && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color,
                  background: `${color}18`,
                  borderRadius: 99,
                  padding: "3px 9px",
                  whiteSpace: "nowrap",
                }}
              >
                {reps}
              </span>
            )}
          </span>
          {muscles && (
            <span
              style={{ display: "block", fontSize: 10, color, marginBottom: 4, letterSpacing: 0.3 }}
            >
              {muscles}
            </span>
          )}
          <span
            style={{
              display: "block",
              fontSize: 12,
              color: done ? T.dim : T.muted,
              lineHeight: 1.5,
            }}
          >
            {detail}
          </span>
        </span>
      </button>

      {(link || Illus) && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            padding: "0 16px 14px 54px",
          }}
        >
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1,
                color,
                textDecoration: "none",
              }}
            >
              🔍 VIEW IMAGES
            </a>
          )}
          {Illus && (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={`${open ? "Hide" : "Show"} ${label} form`}
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1,
                border: "none",
                background: "transparent",
                color,
                cursor: "pointer",
                padding: 0,
              }}
            >
              {open ? "▲ HIDE FORM" : "▼ SHOW FORM"}
            </button>
          )}
        </div>
      )}

      {Illus && open && (
        <div
          style={{
            padding: "0 16px 16px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 430,
              aspectRatio: "3 / 2",
              background: "#F7F7F5",
              borderRadius: 16,
              border: `1px solid ${color}20`,
              padding: 6,
              overflow: "hidden",
            }}
          >
            {typeof Illus === "string" ? (
              <img
                src={Illus}
                alt={`${label} exercise form`}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "contain",
                  borderRadius: 12,
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <Illus c={color} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
