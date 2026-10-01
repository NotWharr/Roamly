"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  addMonths,
  buildMonth,
  fromIsoDate,
  monthLabel,
  toIsoDate,
} from "@/lib/calendar";

const ARROW_ICON = 18;

interface CalendarProps {
  /** `YYYY-MM-DD`, or empty when nothing is chosen yet. */
  value: string;
  onChange: (iso: string) => void;
  /** Dates before today cannot be picked. */
  minDate: string;
  /** How many months ahead the visitor may scroll. */
  maxMonthsAhead?: number;
}

/** Steps, in days, for the arrow keys. Horizontal and vertical are separate
 *  because a calendar moves a week vertically and a day horizontally. */
const STEP: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
};

/**
 * The month grid.
 *
 * Implements the W3C grid pattern, which is the part that matters for anyone
 * driving this with a keyboard or a screen reader:
 *
 *   - The grid is a single tab stop. `focusedIso` holds the one cell that is
 *     tabbable, and Tab moves in or out of the calendar in one press. Without
 *     this, every month put roughly 35 stops between the traveller stepper and
 *     the confirm button.
 *   - Arrow keys move focus and nothing else. Selection is Enter or Space. An
 *     earlier version of this file called `onChange` while arrowing, which
 *     meant scrolling through the calendar silently rebooked the trip to every
 *     day the cursor passed over.
 *   - `focusedIso` is deliberately separate from `value`. The chosen day and
 *     the day under the cursor are different things.
 *   - Home, End, PageUp and PageDown do what a calendar is expected to do.
 *   - Past days are skipped by arrow movement rather than trapping focus.
 *
 * Each week is a `role="row"` and each day a `role="gridcell"` wrapping a real
 * button, so the weekday headings are announced in context rather than the days
 * arriving as an unlabelled run of numbers.
 */
export default function Calendar({
  value,
  onChange,
  minDate,
  maxMonthsAhead = 12,
}: CalendarProps) {
  const today = useMemo(() => fromIsoDate(minDate), [minDate]);

  const [view, setView] = useState(() =>
    // Open on the chosen month when there is one, otherwise this month.
    value ? fromIsoDate(value) : today,
  );

  /** The one tabbable cell. Defaults to the selection, else today. */
  const [focusedIso, setFocusedIso] = useState(
    () => value || toIsoDate(today),
  );

  const gridRef = useRef<HTMLDivElement>(null);
  /** Skipped on the first paint so the grid does not steal focus on mount. */
  const shouldFocus = useRef(false);

  const grid = useMemo(() => buildMonth(view), [view]);

  const lastMonth = useMemo(
    () => addMonths(today, maxMonthsAhead),
    [today, maxMonthsAhead],
  );

  const canGoBack =
    view.getFullYear() > today.getFullYear() ||
    (view.getFullYear() === today.getFullYear() &&
      view.getMonth() > today.getMonth());

  const canGoForward =
    view.getFullYear() < lastMonth.getFullYear() ||
    (view.getFullYear() === lastMonth.getFullYear() &&
      view.getMonth() < lastMonth.getMonth());

  // The visible month follows the focused day, so arrowing past the edge of the
  // grid rolls the month instead of refusing to move.
  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;

    const target = gridRef.current?.querySelector<HTMLButtonElement>(
      `[data-iso="${focusedIso}"]`,
    );
    target?.focus();
  }, [focusedIso, view]);

  /** Moves the focused day by `days`, rolling the month and skipping past days. */
  function moveFocus(from: Date, days: number) {
    const next = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    next.setDate(next.getDate() + days);

    // A month stepper has bounds, so the walk stops rather than allowing focus
    // onto a month the visitor cannot open.
    if (next < today) return;
    if (next > lastMonth) return;

    const iso = toIsoDate(next);
    setFocusedIso(iso);
    shouldFocus.current = true;

    if (
      next.getMonth() !== view.getMonth() ||
      next.getFullYear() !== view.getFullYear()
    ) {
      setView(new Date(next.getFullYear(), next.getMonth(), 1));
    }
  }

  function handleKeyDown(event: React.KeyboardEvent, date: Date) {
    const { key } = event;

    if (key in STEP) {
      event.preventDefault();
      moveFocus(date, STEP[key]);
      return;
    }

    if (key === "Home" || key === "End") {
      event.preventDefault();
      // Sunday-first weeks, so Home is the first day of this row.
      moveFocus(date, key === "Home" ? -date.getDay() : 6 - date.getDay());
      return;
    }

    if (key === "PageUp" || key === "PageDown") {
      event.preventDefault();

      const delta = key === "PageUp" ? -1 : 1;
      const target = addMonths(view, delta);
      const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0);

      // Keep the same day-of-month where possible, clamped to the target
      // month's length so PageUp from the 31st does not land on March 3rd.
      const wanted = Math.min(date.getDate(), lastDay.getDate());
      const next = new Date(
        target.getFullYear(),
        target.getMonth(),
        wanted,
      );

      if (next < today || next > lastMonth) return;

      setFocusedIso(toIsoDate(next));
      shouldFocus.current = true;
      setView(new Date(next.getFullYear(), next.getMonth(), 1));
    }
  }

  // Weeks of seven, so each one can be a row.
  const weeks = useMemo(() => {
    const rows: number[][] = [];
    for (let i = 0; i < grid.days.length; i += 7) {
      rows.push(grid.days.slice(i, i + 7));
    }
    return rows;
  }, [grid.days]);

  return (
    <div className="bm-calendar">
      <div className="bm-calendar-head">
        <button
          type="button"
          onClick={() => setView(addMonths(view, -1))}
          disabled={!canGoBack}
          aria-label="Previous month"
          className="bm-calendar-step"
        >
          <ChevronLeft
            style={{ width: ARROW_ICON, height: ARROW_ICON }}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>

        <p className="bm-calendar-month" aria-live="polite">
          {monthLabel(view)}
        </p>

        <button
          type="button"
          onClick={() => setView(addMonths(view, 1))}
          disabled={!canGoForward}
          aria-label="Next month"
          className="bm-calendar-step"
        >
          <ChevronRight
            style={{ width: ARROW_ICON, height: ARROW_ICON }}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* The headings are separate from the grid so the rows stay pure week
          rows. aria-hidden here because each cell carries its own full date,
          and a screen reader would otherwise hear the day name twice. */}
      <div className="bm-calendar-grid" aria-hidden="true">
        {grid.weekdayLabels.map((label) => (
          <span key={label} className="bm-calendar-weekday">
            {label}
          </span>
        ))}
      </div>

      <div
        ref={gridRef}
        role="grid"
        aria-label={monthLabel(view)}
        className="bm-calendar-grid"
      >
        {weeks.map((week, weekIndex) => (
          <div role="row" key={`week-${weekIndex}`} className="bm-calendar-week">
            {week.map((day, dayIndex) => {
              if (day === 0) {
                return (
                  <div
                    role="gridcell"
                    key={`pad-${weekIndex}-${dayIndex}`}
                    aria-hidden="true"
                    className="bm-calendar-cell"
                  />
                );
              }

              const date = new Date(grid.year, grid.month - 1, day);
              const iso = toIsoDate(date);
              const isPast = iso < minDate;
              const isSelected = iso === value;
              const isToday = iso === minDate;

              return (
                <div
                  role="gridcell"
                  key={iso}
                  aria-selected={isSelected}
                  className="bm-calendar-cell"
                >
                  <button
                    type="button"
                    disabled={isPast}
                    // Full date, so the name is unambiguous out of context.
                    aria-label={date.toLocaleDateString("en-US", {
                      dateStyle: "full",
                    })}
                    aria-pressed={isSelected}
                    // Roving tabindex: exactly one cell is ever tabbable.
                    tabIndex={iso === focusedIso && !isPast ? 0 : -1}
                    data-selected={isSelected || undefined}
                    data-today={isToday || undefined}
                    data-iso={iso}
                    onClick={() => {
                      setFocusedIso(iso);
                      onChange(iso);
                    }}
                    onFocus={() => setFocusedIso(iso)}
                    onKeyDown={(event) => handleKeyDown(event, date)}
                    className="bm-calendar-day"
                  >
                    {day}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}