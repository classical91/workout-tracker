// Which day of the fixed weekly schedule a given calendar day is.
//
// The plan itself lives in src/data/weeklyPlan.js and is ordered Mon–Sun; every
// consumer that has to answer "what is on today" goes through here so the
// Sun-first remap exists once. The Weekly Plan screen uses it to put today's
// card on top, and the /api/weekly-plan route uses it to answer the same
// question for another app.

import { weeklyPlan } from "../data/weeklyPlan.js";

/** weeklyPlan is ordered Mon–Sun; Date.getDay() is Sun-first, so remap. */
export const planIndexForDate = (date = new Date()) => (date.getDay() + 6) % 7;

/**
 * A "YYYY-MM-DD" calendar day as a local Date, or null when it is not one.
 *
 * Built field by field rather than handed to `new Date(string)`, which reads a
 * bare date as UTC midnight — that is a different day for most of the world,
 * and the whole point of accepting a date here is to answer for the caller's
 * day rather than this container's.
 */
export function parseCalendarDay(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || "").trim());
  if (!match) return null;

  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  // Rejects the dates that look fine and are not — 2026-02-31 rolls over into
  // March rather than failing on its own.
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

/** The plan for one day. `date` is a Date; today when nothing is given. */
export const planForDate = (date = new Date()) => weeklyPlan[planIndexForDate(date)];
