import { T } from "../theme.js";
import { triggerPointVideos } from "../data/triggerPoints.js";

function handleKey(onToggle) {
  return (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };
}

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
      <div
        role="button"
        tabIndex={0}
        aria-pressed={isDone}
        onClick={onToggle}
        onKeyDown={handleKey(onToggle)}
        style={{ padding: "14px 16px", cursor: "pointer" }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div
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
          </div>
          <div style={{ flex: 1 }}>
            <div
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
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <div>
                <p
                  style={{
                    fontSize: 10,
                    color: section.color,
                    fontWeight: 700,
                    letterSpacing: 1,
                    marginBottom: 3,
                  }}
                >
                  PAIN PATTERN
                </p>
                <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{item.pain}</p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: 10,
                    color: section.color,
                    fontWeight: 700,
                    letterSpacing: 1,
                    marginBottom: 3,
                  }}
                >
                  SYMPTOMS
                </p>
                <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{item.symptoms}</p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: 10,
                    color: section.color,
                    fontWeight: 700,
                    letterSpacing: 1,
                    marginBottom: 3,
                  }}
                >
                  RELEASE
                </p>
                <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{item.release}</p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: 10,
                    color: section.color,
                    fontWeight: 700,
                    letterSpacing: 1,
                    marginBottom: 3,
                  }}
                >
                  STRETCH
                </p>
                <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{item.stretch}</p>
              </div>
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
              {videoUrl && (
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
