import { useEffect, useRef } from "react";
import { localDay, msUntilNextLocalDay } from "../utils/localDay.js";

/**
 * Calls `onNewDay(today, previousDay)` whenever the local calendar day differs
 * from the day the caller last recorded.
 *
 * The check runs:
 *  - on mount (the app was closed over midnight, or the screen is being opened
 *    for the first time today);
 *  - at the next local midnight, so a screen left open overnight rolls over on
 *    its own without a reload;
 *  - whenever the tab becomes visible or the window regains focus, because a
 *    phone or laptop asleep at midnight never fires the timer on time.
 *
 * `storedDay` is the day the caller believes its state belongs to (typically
 * persisted alongside it). It is empty on first-ever use, and passed through as
 * `previousDay` so the caller can adopt today without wiping anything.
 */
export function useDailyReset(storedDay, onNewDay) {
  // Latest values for logic that runs from timers and event listeners, which
  // are registered once and would otherwise capture the first render's values.
  const dayRef = useRef(storedDay);
  dayRef.current = storedDay;
  const onNewDayRef = useRef(onNewDay);
  onNewDayRef.current = onNewDay;

  useEffect(() => {
    let timeoutId;

    const check = () => {
      const today = localDay();
      if (dayRef.current !== today) {
        const previousDay = dayRef.current;
        // Advance immediately: `storedDay` only catches up on the next render,
        // and a focus event could otherwise fire the reset a second time.
        dayRef.current = today;
        onNewDayRef.current(today, previousDay);
      }
      schedule();
    };

    const schedule = () => {
      clearTimeout(timeoutId);
      // A second past midnight, so the clock has definitely ticked over.
      timeoutId = setTimeout(check, msUntilNextLocalDay() + 1000);
    };

    const onVisibilityChange = () => {
      if (!document.hidden) check();
    };

    check();
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", check);
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", check);
    };
    // Registered once for the lifetime of the screen; current values are read
    // through refs.
  }, []);
}
