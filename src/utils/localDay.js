// Helpers for "which local calendar day is it", used to roll checkmarks over at
// midnight. Everything is based on the device's local time, so a day changes at
// the user's own midnight rather than at UTC midnight.

export const localDay = (date = new Date()) => date.toDateString();

// Milliseconds from `now` until the next local midnight. Always > 0, so a
// timeout scheduled with it can never fire in a tight loop.
export function msUntilNextLocalDay(now = new Date()) {
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);
  return Math.max(1, nextMidnight.getTime() - now.getTime());
}
