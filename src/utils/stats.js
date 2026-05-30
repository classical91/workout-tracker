// Pure helpers that derive progress stats from the activity log.
// A log entry looks like: { name, emoji, color, duration, ts }.

const DAY_MS = 24 * 60 * 60 * 1000;

// Local midnight for a timestamp. Using setHours + setDate (rather than
// subtracting fixed millisecond amounts) keeps day math correct across DST
// transitions and month boundaries.
function dayStart(ts) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dayKey(ts) {
  return dayStart(ts).toDateString();
}

function loggedDayKeys(log) {
  return new Set(log.map((e) => dayKey(e.ts)));
}

// Consecutive days, ending today (or yesterday if nothing is logged yet today),
// on which at least one activity was logged. Missing "today" doesn't break a
// streak you completed yesterday — it only ends once a full day is skipped.
export function currentStreak(log, now = Date.now()) {
  if (!log.length) return 0;
  const days = loggedDayKeys(log);
  const cursor = dayStart(now);

  if (!days.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(cursor.toDateString())) return 0;
  }

  let streak = 0;
  while (days.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// Longest run of consecutive logged days in the entire history.
export function longestStreak(log) {
  if (!log.length) return 0;
  const days = [...loggedDayKeys(log)].map((s) => new Date(s).getTime()).sort((a, b) => a - b);

  let best = 1;
  let run = 1;
  for (let i = 1; i < days.length; i += 1) {
    run = days[i] - days[i - 1] === DAY_MS ? run + 1 : 1;
    if (run > best) best = run;
  }
  return best;
}

// Start of the current week (Monday) at local midnight.
function startOfWeek(now) {
  const d = dayStart(now);
  const mondayOffset = (d.getDay() + 6) % 7; // Sun=6 ... Mon=0
  d.setDate(d.getDate() - mondayOffset);
  return d;
}

export function sessionsThisWeek(log, now = Date.now()) {
  const start = startOfWeek(now).getTime();
  return log.filter((e) => e.ts >= start).length;
}

// Sum the leading number out of each duration string ("~30 min" -> 30,
// "20 min" -> 20). Entries without a parseable number contribute nothing.
export function totalMinutes(log) {
  return log.reduce((sum, e) => {
    const match = String(e.duration || "").match(/\d+/);
    return sum + (match ? parseInt(match[0], 10) : 0);
  }, 0);
}

// Per-activity session counts, most frequent first.
export function activityBreakdown(log) {
  const byName = new Map();
  for (const e of log) {
    const cur = byName.get(e.name) || { name: e.name, emoji: e.emoji, color: e.color, count: 0 };
    cur.count += 1;
    byName.set(e.name, cur);
  }
  return [...byName.values()].sort((a, b) => b.count - a.count);
}

// Everything the Progress screen needs, in one call.
export function computeStats(log, now = Date.now()) {
  return {
    totalSessions: log.length,
    currentStreak: currentStreak(log, now),
    longestStreak: longestStreak(log),
    sessionsThisWeek: sessionsThisWeek(log, now),
    totalMinutes: totalMinutes(log),
    breakdown: activityBreakdown(log),
  };
}
