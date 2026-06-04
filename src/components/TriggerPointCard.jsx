import { T } from "../theme.js";
import { triggerPointVideos } from "../data/triggerPoints.js";

export function TriggerPointCard({ item, section, isDone, onToggle }) {
  const videoUrl = triggerPointVideos[item.key];

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
        aria-pressed={isDone}
        onClick={onToggle}
        style={{
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
        <span style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span
            aria-hidden="true"
            style={{
              width: 24,
              height: 24,
              borderRadius: 7,
              border: `2px solid ${section.color}`,
              background: isDone ? section.color : "transparent",
              flexShrink: 0,
              marginTop: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isDone && <span style={{ fontSize: 13, color: "#000", fontWeight: 800 }}>✓</span>}
          </span>
          <span style={{ flex: 1 }}>
            <span
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: isDone ? T.muted : T.text,
                  textDecoration: isDone ? "line-through" : "none",
                }}
              >
                {item.name}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: section.color,
                  background: `${section.color}18`,
                  borderRadius: 99,
                  padding: "3px 9px",
                  whiteSpace: "nowrap",
                }}
              >
                {item.muscle}
              </span>
            </span>
            <span style={{ display: "grid", gap: 8 }}>
              {[
                ["PAIN PATTERN", item.pain],
                ["SYMPTOMS", item.symptoms],
                ["RELEASE", item.release],
                ["STRETCH", item.stretch],
              ].map(([heading, text]) => (
                <span key={heading}>
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
                </span>
              ))}
              <span
                style={{
                  display: "block",
                  background: `${section.color}10`,
                  borderLeft: `3px solid ${section.color}`,
                  borderRadius: 6,
                  padding: "8px 10px",
                  fontSize: 11,
                  color: section.color,
                }}
              >
                💡 {item.notes}
              </span>
            </span>
          </span>
        </span>
      </button>
      {videoUrl && (
        <div style={{ padding: "0 16px 14px 54px" }}>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1,
              color: section.color,
              textDecoration: "none",
              padding: "4px 0",
            }}
          >
            ▶ WATCH DEMO
          </a>
        </div>
      )}
    </div>
  );
}
