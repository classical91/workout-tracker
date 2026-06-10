import { useState } from "react";
import { T } from "../theme.js";
import { triggerPointVideos } from "../data/triggerPoints.js";

export function TriggerPointCard({ item, section }) {
  const [expanded, setExpanded] = useState(false);
  const videoUrl = triggerPointVideos[item.key];
  const imagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
    `${item.name} trigger point ${item.muscle}`,
  )}`;

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
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
        style={{
          padding: "14px 16px",
          cursor: "pointer",
          width: "100%",
          background: "transparent",
          border: "none",
          color: T.text,
          font: "inherit",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{item.name}</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: section.color,
              background: `${section.color}18`,
              borderRadius: 99,
              padding: "3px 9px",
              whiteSpace: "nowrap",
              alignSelf: "flex-start",
            }}
          >
            {item.muscle}
          </span>
        </span>
        <span
          aria-hidden="true"
          style={{
            color: section.color,
            fontSize: 14,
            flexShrink: 0,
            transform: expanded ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        >
          ▾
        </span>
      </button>

      {expanded && (
        <div style={{ padding: "0 16px 14px" }}>
          <a
            href={imagesUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: `${section.color}12`,
              border: `1px solid ${section.color}40`,
              borderRadius: 10,
              padding: "10px 12px",
              marginBottom: 12,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              color: section.color,
              textDecoration: "none",
            }}
          >
            🔍 VIEW IMAGES
          </a>

          <div style={{ display: "grid", gap: 8 }}>
            {[
              ["PAIN PATTERN", item.pain],
              ["SYMPTOMS", item.symptoms],
              ["RELEASE", item.release],
              ["STRETCH", item.stretch],
            ].map(([heading, text]) => (
              <div key={heading}>
                <span
                  style={{
                    display: "block",
                    fontSize: 10,
                    color: section.color,
                    fontWeight: 700,
                    letterSpacing: 1,
                    marginBottom: 3,
                  }}
                >
                  {heading}
                </span>
                <span style={{ display: "block", fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
                  {text}
                </span>
              </div>
            ))}
            <div
              style={{
                background: `${section.color}10`,
                borderLeft: `3px solid ${section.color}`,
                borderRadius: 6,
                padding: "8px 10px",
                fontSize: 11,
                color: section.color,
              }}
            >
              💡 {item.notes}
            </div>
          </div>

          {videoUrl && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: 12,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1,
                color: section.color,
                textDecoration: "none",
              }}
            >
              ▶ WATCH DEMO
            </a>
          )}
        </div>
      )}
    </div>
  );
}
