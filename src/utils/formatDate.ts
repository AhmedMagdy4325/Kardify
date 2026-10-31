// Turns a stored "YYYY-MM-DD" into a short label in the given language
// (for example "Oct 24" or "٢٤ أكتوبر").
export function formatDueDate(dateString: string, locale: string): string {
  // Adding a time makes JavaScript read the date as LOCAL midnight. A bare
  // "2026-10-24" is read as UTC midnight, which in a timezone behind UTC
  // displays as the previous day.
  const date = new Date(`${dateString}T00:00:00`);
  // Intl handles month names, digits and word order for each language, so no
  // per-language formatting code is needed.
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(date);
}
