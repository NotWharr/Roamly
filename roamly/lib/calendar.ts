/**
 * A small, dependency-free month calendar.
 *
 * Deliberately not a library: the booking sheet needs a grid, a month stepper
 * and a disabled range, and pulling in a date picker for that would add weight
 * to a page whose Hero already ships a WebGL simulation.
 *
 * All date maths is done in local time on plain `Date` objects. Building dates
 * with `new Date("2026-09-30")` parses as UTC midnight, which lands on the
 * previous day for anyone west of Greenwich, so the parts are always constructed
 * from explicit numbers.
 */

export interface CalendarMonth {
  /** Sunday-first weekday headings. */
  weekdayLabels: string[];
  /** Day numbers for the grid, with 0 meaning an empty leading or trailing cell. */
  days: number[];
  /** True when the six-week grid belongs to the previous or next month. */
  leading: boolean;
  trailing: boolean;
  year: number;
  /** 1-12. */
  month: number;
}

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** ISO `YYYY-MM-DD` in local time. */
export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parses `YYYY-MM-DD` as local midnight. */
export function fromIsoDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

/** A six-week grid, so the calendar does not change height between months. */
export function buildMonth(monthDate: Date): CalendarMonth {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: number[] = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push(0);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(0);

  return {
    weekdayLabels: WEEKDAY_LABELS,
    days: cells,
    leading: firstWeekday > 0,
    trailing: cells.length % 7 !== 0,
    year,
    month: month + 1,
  };
}

export function monthLabel(monthDate: Date): string {
  return monthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/** "Saturday, October 17, 2026". Falls back to the raw value if unparseable. */
export function readableDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** "Saturday, October 17". The shorter form used inside the booking sheet. */
export function readableDay(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
