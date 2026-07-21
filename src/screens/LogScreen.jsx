import { useMemo, useState } from "react";
import { ACTIVITY_FILTERS } from "../constants/activityTypes.js";
import { ActivityLogCard } from "../components/ActivityLogCard.jsx";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { T, font } from "../theme.js";

export function LogScreen({ onBack, log, onClear, onClearToday, onUpdate, onDelete }) {
  const [filter, setFilter] = useState("all");
  const today = new Date().toDateString();
  const hasToday = log.some((entry) => new Date(entry.ts).toDateString() === today);
  const filteredLog = useMemo(
    () => (filter === "all" ? log : log.filter((entry) => entry.category === filter)),
    [filter, log]
  );
  const grouped = filteredLog.reduce((groups, entry) => {
    const day = new Date(entry.ts).toLocaleDateString("en-CA", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    groups[day] ||= [];
    groups[day].push(entry);
    return groups;
  }, {});

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: font,
        color: T.text,
        paddingBottom: 60,
      }}
    >
      <ScreenHeader
        title="Activity Log"
        subtitle="ONE HISTORY · EVERY PRACTICE"
        emoji="📋"
        color={T.yellow}
        onBack={onBack}
      />
      <main style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        <div
          aria-label="Filter activities"
          style={{
            display: "flex",
            gap: 7,
            overflowX: "auto",
            paddingBottom: 14,
            scrollbarWidth: "none",
          }}
        >
          {ACTIVITY_FILTERS.map((item) => (
            <button
              type="button"
              key={item.value}
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
              style={{
                flex: "0 0 auto",
                border: `1px solid ${filter === item.value ? T.yellow : T.border}`,
                background: filter === item.value ? `${T.yellow}18` : T.surface,
                color: filter === item.value ? T.yellow : T.muted,
                borderRadius: 99,
                padding: "7px 11px",
                fontFamily: font,
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 150ms ease, border-color 150ms ease",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {log.length === 0 ? (
          <div style={{ textAlign: "center", padding: "54px 0", color: T.muted }}>
            <div style={{ fontSize: 46, marginBottom: 14 }}>📋</div>
            <p>No activities yet. Complete a session or log a sauna visit to begin.</p>
          </div>
        ) : filteredLog.length === 0 ? (
          <div style={{ textAlign: "center", padding: "44px 0", color: T.muted, fontSize: 13 }}>
            No {filter} activities yet.
          </div>
        ) : (
          Object.entries(grouped).map(([day, entries]) => (
            <section key={day} style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 10, letterSpacing: 2, color: T.muted, marginBottom: 10 }}>
                {day.toUpperCase()}
              </h2>
              {entries.map((entry) => (
                <ActivityLogCard
                  key={entry.id}
                  entry={entry}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))}
            </section>
          ))
        )}

        {log.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              borderTop: `1px solid ${T.border}`,
              paddingTop: 16,
            }}
          >
            {hasToday && (
              <button
                type="button"
                onClick={onClearToday}
                style={{
                  background: "none",
                  border: `1px solid ${T.yellow}55`,
                  borderRadius: 10,
                  padding: "10px 16px",
                  color: T.yellow,
                  cursor: "pointer",
                  fontFamily: font,
                  fontSize: 12,
                }}
              >
                Clear today
              </button>
            )}
            <button
              type="button"
              onClick={onClear}
              style={{
                background: "none",
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: "10px 16px",
                color: T.muted,
                cursor: "pointer",
                fontFamily: font,
                fontSize: 12,
              }}
            >
              Clear entire log
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
