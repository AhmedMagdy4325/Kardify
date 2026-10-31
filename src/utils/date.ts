// Due dates are calendar days, stored as "YYYY-MM-DD" strings. This file
// avoids Date math where it can, because Date represents a moment in time and
// that mismatch is where timezone bugs come from. As long as the format is
// year-month-day with leading zeros, comparing two of these strings as text
// ("2026-10-23" < "2026-10-24") gives the same answer as comparing the dates.

// Two digits with a leading zero: 5 -> "05". Without it "2026-10-4" would
// break both the format and the text comparison.
const pad = (n: number) => String(n).padStart(2, "0");

// Writes a Date as YYYY-MM-DD in the user's LOCAL timezone.
// getMonth() counts from 0 (January is 0), hence the + 1.
// getDate() is the day of the month; getDay() would be the weekday.
function toLocalString(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Today's date. new Date().toISOString() is deliberately not used: it converts
// to UTC first, so late at night (or early in the morning) it can return
// yesterday's date and make cards due today look overdue.
export function todayString(): string {
  return toLocalString(new Date());
}

export function tomorrowString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1); // handles month and year rollover
  return toLocalString(d);
}

export type DueState = "overdue" | "soon" | "normal";

// The order of the checks matters: the first match returns, so the second
// check only sees dates that are today or later.
export function getDueState(dueDate: string): DueState {
  if (dueDate < todayString()) return "overdue"; // before today
  if (dueDate <= tomorrowString()) return "soon"; // today or tomorrow
  return "normal";
}
// Known limit: the state is computed when a card renders, so a tab left open
// past midnight shows the old state until something re-renders.
