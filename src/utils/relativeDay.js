import { T } from "../theme.js";

// Classifies a timestamp relative to now so the log can highlight recent
// activity: entries from today are emphasised in green, yesterday in red, and
// anything older is left in the muted default. `now` is injectable for tests.
export function classifyDay(ts, now = Date.now()) {
  const entryDay = new Date(ts).toDateString();
  const todayDay = new Date(now).toDateString();
  const yesterdayDay = new Date(now - 24 * 60 * 60 * 1000).toDateString();

  if (entryDay === todayDay) {
    return { kind: "today", label: "Today", color: T.green, emphasized: true };
  }
  if (entryDay === yesterdayDay) {
    return { kind: "yesterday", label: "Yesterday", color: T.red, emphasized: true };
  }
  return { kind: "older", label: null, color: T.muted, emphasized: false };
}
