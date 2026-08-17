import { T, display, font, themeTemplates } from "../theme.js";
import { activities } from "../data/activities.js";

const activityById = Object.fromEntries(activities.map((activity) => [activity.id, activity]));

const groups = [
  {
    label: "TRAINING",
    items: ["weekly-plan", "workout-sets", "simple", "stretch"],
  },
  {
    label: "RECOVERY",
    items: ["calm", "sauna", "foam-roller", "trigger-points", "reflexology"],
  },
  {
    label: "TRACK & LEARN",
    items: ["log", "benefits", "excuses"],
  },
];

function normalizedScreen(screen) {
  if (screen === "simple-exercise") return "simple";
  if (["breathing", "cold-shower", "body-scan", "ohming"].includes(screen)) return "calm";
  if (screen === "quick-timer") return "home";
  return screen;
}

function NavButton({ item, active, onNavigate }) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(item.id)}
      aria-current={active ? "page" : undefined}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "10px 11px",
        borderRadius: 11,
        border: `1px solid ${active ? `${item.color}66` : "transparent"}`,
        background: active ? `${item.color}16` : "transparent",
        color: active ? T.text : T.muted,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: font,
      }}
    >
      <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{item.emoji}</span>
      <span style={{ minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 700,
            color: active ? item.color : T.text,
            lineHeight: 1.2,
          }}
        >
          {item.label}
        </span>
        {item.duration && (
          <span style={{ display: "block", marginTop: 2, fontSize: 9, color: T.muted }}>
            {item.duration}
          </span>
        )}
      </span>
    </button>
  );
}

export function DesktopSidebar({ activeScreen, onNavigate, activeTheme, onThemeChange }) {
  const active = normalizedScreen(activeScreen);

  return (
    <aside
      className="desktop-sidebar"
      style={{
        background: T.surface,
        borderColor: T.border,
        color: T.text,
        fontFamily: font,
      }}
      aria-label="Desktop navigation"
    >
      <div style={{ padding: "2px 6px 14px" }}>
        <div style={{ fontSize: 9, letterSpacing: 2.5, color: T.muted, fontWeight: 700 }}>
          DAILY PRACTICE
        </div>
        <div
          style={{
            marginTop: 5,
            fontFamily: display,
            fontSize: 28,
            letterSpacing: 1.2,
            lineHeight: 1,
          }}
        >
          WELLNESS
        </div>
      </div>

      <NavButton
        item={{ id: "home", label: "Dashboard", emoji: "⌂", color: T.orange }}
        active={active === "home"}
        onNavigate={onNavigate}
      />

      <div style={{ height: 1, background: T.border, margin: "12px 4px" }} />

      <nav style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {groups.map((group) => (
          <div key={group.label}>
            <div
              style={{
                padding: "0 10px 5px",
                fontSize: 8,
                letterSpacing: 1.8,
                color: T.dim,
                fontWeight: 800,
              }}
            >
              {group.label}
            </div>
            <div style={{ display: "grid", gap: 2 }}>
              {group.items.map((id) => {
                const item = activityById[id];
                return (
                  <NavButton
                    key={id}
                    item={item}
                    active={active === id}
                    onNavigate={onNavigate}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div style={{ marginTop: "auto", paddingTop: 18 }}>
        <div style={{ height: 1, background: T.border, marginBottom: 14 }} />
        <div
          style={{
            padding: "0 8px 8px",
            fontSize: 8,
            letterSpacing: 1.8,
            color: T.dim,
            fontWeight: 800,
          }}
        >
          THEME
        </div>
        <div className="sidebar-theme-grid">
          {Object.entries(themeTemplates).map(([name, theme]) => {
            const selected = activeTheme === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => onThemeChange(name)}
                title={theme.description}
                aria-pressed={selected}
                style={{
                  padding: "8px 7px",
                  borderRadius: 9,
                  border: `1px solid ${selected ? theme.tokens.orange : T.border}`,
                  background: selected ? `${theme.tokens.orange}14` : T.surface2,
                  color: selected ? T.text : T.muted,
                  cursor: "pointer",
                  fontFamily: font,
                  fontSize: 9,
                  fontWeight: 700,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: 7,
                    height: 7,
                    marginRight: 5,
                    borderRadius: 99,
                    background: theme.tokens.orange,
                  }}
                />
                {theme.label}
              </button>
            );
          })}
        </div>

        <div className="sidebar-external-links">
          <a
            href="https://diet-plan-production-30bd.up.railway.app"
            target="_blank"
            rel="noreferrer"
          >
            🥗 Diet Plan
          </a>
          <a
            href={activityById.youtube.url}
            target="_blank"
            rel="noreferrer"
          >
            ▶️ Videos
          </a>
        </div>
      </div>
    </aside>
  );
}
