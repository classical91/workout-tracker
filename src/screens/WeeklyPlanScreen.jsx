import { useState } from "react";
import { T, font, display } from "../theme.js";
import { ScreenHeader } from "../components/ScreenHeader.jsx";
import { weeklyPlan } from "../data/weeklyPlan.js";
import { planForDate, planIndexForDate } from "../utils/weeklyPlanDay.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { STORAGE_KEYS } from "../constants/storageKeys.js";

function startOfWeek(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeekRange(monday) {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

// One option of a "pick one" item. Options with a screen open it; the rest
// (swimming, paddle boarding, …) are logged from the home screen.
function ChoiceChip({ choice, color, onNavigate }) {
  const clickable = !!choice.screen;
  const Tag = clickable ? "button" : "span";
  return (
    <Tag
      {...(clickable ? { type: "button", onClick: () => onNavigate(choice.screen) } : {})}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: T.surface,
        border: `1px solid ${clickable ? color : T.border}`,
        borderRadius: 99,
        padding: "4px 10px",
        color: T.text,
        font: "inherit",
        fontSize: 11.5,
        fontWeight: 600,
        cursor: clickable ? "pointer" : "default",
      }}
    >
      <span aria-hidden>{choice.emoji}</span>
      {choice.name}
      {clickable && (
        <span style={{ color }} aria-hidden>
          ›
        </span>
      )}
    </Tag>
  );
}

function PlanItem({ item, color, onNavigate }) {
  // An item with choices holds its own buttons, so it is never one itself.
  const clickable = !!item.screen && !item.choices;
  const Tag = clickable ? "button" : "div";
  return (
    <Tag
      {...(clickable ? { type: "button", onClick: () => onNavigate(item.screen) } : {})}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        boxSizing: "border-box",
        background: T.surface2,
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        padding: "10px 12px",
        marginTop: 8,
        color: T.text,
        font: "inherit",
        textAlign: "left",
        cursor: clickable ? "pointer" : "default",
      }}
      onMouseEnter={(e) => {
        if (clickable) e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.border;
      }}
    >
      <span style={{ fontSize: 22, flexShrink: 0 }}>{item.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700 }}>{item.name}</div>
        <div style={{ fontSize: 11.5, color: T.muted, marginTop: 1 }}>{item.detail}</div>
        {item.choices && (
          <div
            role="group"
            aria-label={item.name}
            style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}
          >
            {item.choices.map((choice) => (
              <ChoiceChip key={choice.name} choice={choice} color={color} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </div>
      {clickable && (
        <span style={{ color, fontSize: 16, flexShrink: 0 }} aria-hidden>
          ›
        </span>
      )}
    </Tag>
  );
}

function DayCard({ plan, isToday, onNavigate, dateLabel }) {
  return (
    <div
      style={{
        background: T.surface,
        borderStyle: "solid",
        borderWidth: "1px 1px 1px 3px",
        borderColor: `${isToday ? plan.color : T.border} ${isToday ? plan.color : T.border} ${isToday ? plan.color : T.border} ${plan.color}`,
        borderRadius: 14,
        padding: "14px 16px 16px",
        marginBottom: 12,
        boxShadow: isToday ? `0 0 0 1px ${plan.color}` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 24 }}>{plan.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{ fontFamily: display, fontSize: 20, letterSpacing: 1, color: plan.color }}
            >
              {plan.day}
            </span>
            {isToday && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  color: T.bg,
                  background: plan.color,
                  borderRadius: 99,
                  padding: "3px 8px",
                }}
              >
                TODAY
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: T.muted, letterSpacing: 1, fontWeight: 600 }}>
            {dateLabel ? `${dateLabel.toUpperCase()} · ` : ""}
            {plan.theme.toUpperCase()} · {plan.focus.toUpperCase()}
          </div>
        </div>
      </div>
      {plan.items.map((item) => (
        <PlanItem key={item.name} item={item} color={plan.color} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

const WEEKDAY_HEADERS = weeklyPlan.map((plan) => plan.short);

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** Every day in the Mon–Sun weeks covering `year`/`month`, padded with nulls. */
export function monthGrid(year, month) {
  const first = new Date(year, month, 1);
  const lead = planIndexForDate(first);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7) cells.push(null);
  return cells;
}

const navButtonStyle = () => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  flexShrink: 0,
  background: "transparent",
  border: `1px solid ${T.border}`,
  borderRadius: 8,
  color: T.purple,
  fontSize: 16,
  cursor: "pointer",
});

function MonthView({ onNavigate }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [cursor, setCursor] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }));
  const [selected, setSelected] = useState(today);

  const shiftMonth = (delta) => {
    const next = new Date(cursor.year, cursor.month + delta, 1);
    setCursor({ year: next.getFullYear(), month: next.getMonth() });
    // Keep the card below in the month being looked at: today when that is
    // this month, otherwise the 1st.
    const isThisMonth =
      next.getFullYear() === today.getFullYear() && next.getMonth() === today.getMonth();
    setSelected(isThisMonth ? today : next);
  };

  const cells = monthGrid(cursor.year, cursor.month);
  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const selectedPlan = planForDate(selected);
  const selectedLabel = selected.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 12,
          padding: "8px 10px",
          background: T.surface2,
          border: `1px solid ${T.border}`,
          borderRadius: 10,
        }}
      >
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          aria-label="Show previous month"
          style={navButtonStyle()}
        >
          ←
        </button>
        <span style={{ fontSize: 12, fontWeight: 700, color: T.text, letterSpacing: 0.5 }}>
          {monthLabel}
        </span>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label="Show next month"
          style={navButtonStyle()}
        >
          →
        </button>
      </div>
      <div
        role="grid"
        aria-label={`Workout plan for ${monthLabel}`}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: 4,
          marginBottom: 16,
        }}
      >
        {WEEKDAY_HEADERS.map((label) => (
          <div
            key={label}
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1,
              color: T.muted,
              textAlign: "center",
              paddingBottom: 4,
            }}
          >
            {label}
          </div>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={`pad-${i}`} aria-hidden />;
          const plan = planForDate(date);
          const isToday = sameDay(date, today);
          const isSelected = sameDay(date, selected);
          const isPast = date < today;
          return (
            <button
              key={date.getDate()}
              type="button"
              onClick={() => setSelected(date)}
              aria-pressed={isSelected}
              aria-label={`${date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}: ${plan.theme}, ${plan.focus}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                minWidth: 0,
                padding: "6px 0 5px",
                background: isSelected ? T.surface2 : T.surface,
                borderStyle: "solid",
                borderWidth: "3px 1px 1px",
                borderColor: `${plan.color} ${isSelected || isToday ? plan.color : T.border}`,
                borderRadius: 8,
                color: T.text,
                font: "inherit",
                cursor: "pointer",
                opacity: isPast && !isSelected ? 0.5 : 1,
                boxShadow: isToday ? `0 0 0 1px ${plan.color}` : "none",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: isToday ? 800 : 600,
                  color: isToday ? plan.color : T.text,
                }}
              >
                {date.getDate()}
              </span>
              <span style={{ fontSize: 16, lineHeight: 1 }} aria-hidden>
                {plan.emoji}
              </span>
            </button>
          );
        })}
      </div>
      <DayCard
        plan={selectedPlan}
        isToday={sameDay(selected, today)}
        onNavigate={onNavigate}
        dateLabel={selectedLabel}
      />
    </div>
  );
}

function ViewToggle({ view, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Plan view"
      style={{
        display: "flex",
        gap: 4,
        padding: 4,
        marginBottom: 12,
        background: T.surface2,
        border: `1px solid ${T.border}`,
        borderRadius: 10,
      }}
    >
      {[
        ["week", "Week"],
        ["month", "Month"],
      ].map(([id, label]) => {
        const active = view === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            style={{
              flex: 1,
              padding: "6px 0",
              background: active ? T.purple : "transparent",
              border: "none",
              borderRadius: 7,
              color: active ? T.bg : T.muted,
              font: "inherit",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.5,
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function WeeklyPlanScreen({ onBack, onNavigate }) {
  const [view, setView] = useLocalStorage(STORAGE_KEYS.planView, "month");
  const [weekOffset, setWeekOffset] = useState(0);
  const isCurrentWeek = weekOffset === 0;
  const today = planIndexForDate();
  // The schedule is a fixed weekly rhythm, so past/future weeks reuse the
  // same items. Only the current week rotates to put today's card first.
  const ordered = isCurrentWeek
    ? [...weeklyPlan.slice(today), ...weeklyPlan.slice(0, today)]
    : weeklyPlan;

  const viewedMonday = startOfWeek(new Date());
  viewedMonday.setDate(viewedMonday.getDate() + weekOffset * 7);
  const weekLabel = weekOffset === -1 ? "Last Week" : `${-weekOffset} Weeks Ago`;

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
        title="Weekly Plan"
        subtitle={view === "month" ? "SET SCHEDULE · FULL MONTH" : "SET SCHEDULE · MON–SUN"}
        emoji="📅"
        color={T.purple}
        onBack={onBack}
      />
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: T.muted, marginBottom: 16 }}>
          The same rhythm every week: three dumbbell days, two easy-movement days, one recovery day
          and one full rest day. Tap a day to see its plan, then any item to jump straight in.
        </p>
        <ViewToggle view={view} onChange={setView} />
        {view === "month" ? (
          <MonthView onNavigate={onNavigate} />
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                marginBottom: 16,
                padding: "8px 10px",
                background: T.surface2,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
              }}
            >
              <button
                type="button"
                onClick={() => setWeekOffset((w) => w - 1)}
                aria-label="Show last week's plan"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  flexShrink: 0,
                  background: "transparent",
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  color: T.purple,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                ←
              </button>
              <span style={{ fontSize: 12, fontWeight: 700, color: T.text, letterSpacing: 0.5 }}>
                {isCurrentWeek ? "This Week" : `${weekLabel} · ${formatWeekRange(viewedMonday)}`}
              </span>
              {isCurrentWeek ? (
                <span style={{ width: 28, height: 28, flexShrink: 0 }} aria-hidden />
              ) : (
                <button
                  type="button"
                  onClick={() => setWeekOffset(0)}
                  aria-label="Back to this week's plan"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 28,
                    height: 28,
                    flexShrink: 0,
                    background: "transparent",
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    color: T.purple,
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                >
                  →
                </button>
              )}
            </div>
            {ordered.map((plan, i) => (
              <DayCard
                key={plan.day}
                plan={plan}
                isToday={isCurrentWeek && i === 0}
                onNavigate={onNavigate}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
