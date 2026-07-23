import { useCallback, useEffect, useRef, useState } from "react";
import { T, font } from "../theme.js";
import {
  StretchIllus,
  stretchCheckKey,
  stretchSections,
  summarizeStretchSession,
} from "../data/stretches.js";
import { ACTIVITY_CATEGORIES, ACTIVITY_TYPES } from "../constants/activityTypes.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { STORAGE_KEYS } from "../constants/storageKeys.js";
import { ActivityCompletionForm } from "../components/ActivityCompletionForm.jsx";
import { CompletionBanner } from "../components/CompletionBanner.jsx";
import { IllusCard } from "../components/IllusCard.jsx";
import { ProgressBar } from "../components/ProgressBar.jsx";
import { ScreenHeader } from "../components/ScreenHeader.jsx";

const allItems = stretchSections.flatMap((section) => section.items);

// The user's current local calendar day, used to reset checkmarks at midnight.
const localDay = () => new Date().toDateString();

// "All" plus one filter per body-region section, so the list can be narrowed
// without changing which stretches are counted, checked, or logged.
const REGION_FILTERS = [{ label: "All", color: T.green }, ...stretchSections];

function buildStretchActivity(summary) {
  return {
    type: ACTIVITY_TYPES.STRETCH,
    category: ACTIVITY_CATEGORIES.MOBILITY,
    name: summary.name,
    emoji: "🧘",
    color: T.green,
    duration: summary.fullBody ? "10 min" : "",
    completed: summary.fullBody,
    details: {
      bodyAreas: summary.doneItems.map((item) => item.name),
      completedSections: summary.completedSections,
      holds: summary.doneItems.map((item) => ({
        name: item.name,
        planned: item.hold,
        region: item.region,
        color: item.color,
      })),
    },
  };
}

export function StretchScreen({ onBack, checked, setChecked, onAddActivity, onUpdateActivity }) {
  const done = allItems.filter((item) => checked[stretchCheckKey(item)]).length;
  const previousDone = useRef(done);
  const [completedActivity, setCompletedActivity] = useState(null);
  // Which body-region section to show ("All" or one of stretchSections' labels).
  // Purely a display filter — checking, counting, and logging always consider
  // every stretch regardless of what's currently visible.
  const [regionFilter, setRegionFilter] = useState("All");
  const visibleSections =
    regionFilter === "All"
      ? stretchSections
      : stretchSections.filter((section) => section.label === regionFilter);

  // Which local day the current checkmarks belong to, and which stretches have
  // already been logged that day. Checkmarks persist until the day rolls over;
  // `logged` prevents re-logging a stretch that's still checked.
  const [session, setSession] = useLocalStorage(STORAGE_KEYS.stretchSession, {
    day: "",
    logged: {},
  });
  const isLogged = useCallback((item) => Boolean(session.logged?.[stretchCheckKey(item)]), [session]);
  const unloggedCount = allItems.filter(
    (item) => checked[stretchCheckKey(item)] && !isLogged(item)
  ).length;

  // Latest values captured for logic that runs outside render (the leave-time
  // auto-log and the once-per-day reset), so it never uses stale props.
  const checkedRef = useRef(checked);
  checkedRef.current = checked;
  const addActivityRef = useRef(onAddActivity);
  addActivityRef.current = onAddActivity;
  const setCheckedRef = useRef(setChecked);
  setCheckedRef.current = setChecked;
  const setSessionRef = useRef(setSession);
  setSessionRef.current = setSession;
  // Source of truth for "already logged today", mirrored into state for render.
  const loggedRef = useRef(session.logged || {});

  // Roll the checkmarks over at local midnight: on the first render of a new
  // day, clear the stretch checkmarks and forget what was logged. On first-ever
  // use (no stored day) we adopt today without clearing, so existing checks and
  // other screens' checkmarks are left alone.
  useEffect(() => {
    const today = localDay();
    if (session.day && session.day !== today) {
      loggedRef.current = {};
      setChecked((previous) => {
        const next = { ...previous };
        for (const item of allItems) delete next[stretchCheckKey(item)];
        return next;
      });
      setSession({ day: today, logged: {} });
    } else {
      loggedRef.current = session.logged || {};
      if (session.day !== today) setSession({ day: today, logged: session.logged || {} });
    }
    // Runs once on mount; refs/state read inside are intentionally not deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Log every currently-checked stretch that hasn't been logged yet today as a
  // single session, mark those as logged, and leave the checkmarks in place.
  // Returns the created activity, or null when nothing new needed logging.
  const logPending = useCallback(() => {
    const current = checkedRef.current || {};
    const pendingItems = allItems.filter(
      (item) => current[stretchCheckKey(item)] && !loggedRef.current[stretchCheckKey(item)]
    );
    if (pendingItems.length === 0) return null;
    const pendingChecked = Object.fromEntries(
      pendingItems.map((item) => [stretchCheckKey(item), true])
    );
    const summary = summarizeStretchSession(pendingChecked);
    const activity = addActivityRef.current(buildStretchActivity(summary));
    const logged = { ...loggedRef.current };
    for (const item of pendingItems) logged[stretchCheckKey(item)] = true;
    loggedRef.current = logged;
    setSessionRef.current({ day: localDay(), logged });
    return activity;
  }, []);

  const logSession = useCallback(() => {
    const activity = logPending();
    if (activity) setCompletedActivity(activity);
  }, [logPending]);

  // Closing the details form keeps the checkmarks — they stay until the new day.
  const dismissForm = useCallback(() => setCompletedActivity(null), []);

  // Auto-log the moment the full routine is finished, unless a form is already
  // open (which would double-fire on checks made while it's up).
  useEffect(() => {
    if (!completedActivity && done === allItems.length && previousDone.current < allItems.length) {
      const activity = logPending();
      if (activity) setCompletedActivity(activity);
    }
    previousDone.current = done;
  }, [done, completedActivity, logPending]);

  // When leaving the screen, record any checked-but-unlogged stretches so a
  // partial routine is never lost by forgetting to tap "Log this session". The
  // checkmarks are kept (they reset at midnight, not on leave).
  useEffect(() => {
    return () => {
      logPending();
    };
  }, [logPending]);

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
        title="Stretch"
        subtitle="FLEXIBILITY · 10 MIN"
        emoji="🧘"
        color={T.green}
        onBack={onBack}
      />
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 20px" }}>
        <ProgressBar done={done} total={allItems.length} color={T.green} />
        <div
          aria-label="Filter by body region"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 7,
            paddingBottom: 14,
          }}
        >
          {REGION_FILTERS.map((section) => {
            const active = regionFilter === section.label;
            return (
              <button
                type="button"
                key={section.label}
                aria-current={active ? "true" : undefined}
                onClick={() => setRegionFilter(section.label)}
                style={{
                  flex: "0 0 auto",
                  border: `1px solid ${active ? section.color : T.border}`,
                  background: active ? `${section.color}18` : T.surface,
                  color: active ? section.color : T.muted,
                  borderRadius: 99,
                  padding: "7px 11px",
                  fontFamily: font,
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "background 150ms ease, border-color 150ms ease",
                }}
              >
                {section.label}
              </button>
            );
          })}
        </div>
        {visibleSections.map((section) => (
          <div key={section.label}>
            <p
              style={{
                fontSize: 10,
                letterSpacing: 2,
                color: section.color,
                fontWeight: 700,
                marginBottom: 10,
                marginTop: 8,
              }}
            >
              {section.label.toUpperCase()}
            </p>
            {section.items.map((item) => (
              <IllusCard
                key={item.key}
                label={item.name}
                muscles={item.muscles}
                detail={item.detail}
                reps={item.hold}
                color={section.color}
                done={Boolean(checked[stretchCheckKey(item)])}
                onToggle={() =>
                  setChecked((previous) => ({
                    ...previous,
                    [stretchCheckKey(item)]: !previous[stretchCheckKey(item)],
                  }))
                }
                illusKey={item.name}
                IllusMap={StretchIllus}
                link={`https://www.google.com/search?udm=2&q=${encodeURIComponent(`${item.name} stretch`)}`}
              />
            ))}
          </div>
        ))}
        {done === allItems.length && (
          <CompletionBanner color={T.green} emoji="🌿" text="FULLY STRETCHED!" />
        )}
        {unloggedCount > 0 && !completedActivity && (
          <button
            type="button"
            onClick={logSession}
            style={{
              width: "100%",
              marginTop: 4,
              background: T.green,
              border: "none",
              borderRadius: 12,
              padding: 14,
              color: "#000",
              fontFamily: font,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Log this session ({unloggedCount} of {allItems.length})
          </button>
        )}
        {completedActivity && (
          <ActivityCompletionForm
            activity={completedActivity}
            onSave={(updates) => {
              onUpdateActivity(completedActivity.id, updates);
              dismissForm();
            }}
            onSkip={dismissForm}
          />
        )}
      </div>
    </div>
  );
}
