import { useState } from "react";
import { T } from "../theme.js";

function handleKey(onToggle) {
  return (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };
}

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
  link,
}) {
  const [open, setOpen] = useState(false);
  const Illus = IllusMap && IllusMap[illusKey];
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
      <div
        role="button"
        tabIndex={0}
        aria-pressed={done}
        onClick={onToggle}
        onKeyDown={handleKey(onToggle)}
        style={{
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
          padding: "14px 16px",
          cursor: "pointer",
        }}
      >
        <div
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
        </div>
        <div style={{ flex: 1 }}>
          <div
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
          </div>
          {muscles && (
            <p style={{ fontSize: 10, color, marginBottom: 4, letterSpacing: 0.3 }}>{muscles}</p>
          )}
          <p style={{ fontSize: 12, color: done ? T.dim : T.muted, lineHeight: 1.5 }}>{detail}</p>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "inline-block",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1,
                color,
                textDecoration: "none",
                paddingTop: 6,
              }}
            >
              🔍 SEARCH ON GOOGLE
            </a>
          )}
          {Illus && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((o) => !o);
              }}
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1,
                border: "none",
                background: "transparent",
                color,
                cursor: "pointer",
                paddingTop: 6,
              }}
            >
              {open ? "▲ HIDE FORM" : "▼ SHOW FORM"}
            </button>
          )}
        </div>
      </div>
      {Illus && open && (
        <div style={{ padding: "0 16px 16px", display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: 180,
              height: 200,
              background: `${color}08`,
              borderRadius: 16,
              border: `1px solid ${color}20`,
              padding: 8,
            }}
          >
            {typeof Illus === "string" ? (
              <img
                src={Illus}
                alt={illusKey}
                style={{ width: "100%", display: "block", objectFit: "cover", borderRadius: 12 }}
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
