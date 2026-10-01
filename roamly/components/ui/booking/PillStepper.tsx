"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";

const ICON = 20;

/** Milliseconds before a held button starts repeating. */
const HOLD_DELAY = 380;
/** First repeat interval, then shortened on every tick. */
const REPEAT_START = 150;
/** Fastest the repeat gets, however long the button is held. */
const REPEAT_FLOOR = 55;
/** Each tick takes this much off the interval, so it accelerates. */
const REPEAT_DECAY = 0.82;

export type Direction = "up" | "down";

/**
 * A number that travels to its new value instead of snapping to it.
 *
 * Direction says which way it came from, so counting up reads as counting up.
 * Keyed on the value, so changing it remounts the inner span and the
 * animation replays even when the same number is reached twice in a row.
 *
 * Marked decorative: whatever is calling this supplies the value to assistive
 * technology separately, so the roll never announces twice.
 */
export function RollingNumber({
  value,
  direction,
  className = "",
}: {
  value: string | number;
  direction: Direction;
  className?: string;
}) {
  return (
    <span className={`bm-roll-box ${className}`} aria-hidden="true">
      <span key={`${value}-${direction}`} className="bm-roll" data-dir={direction}>
        {value}
      </span>
    </span>
  );
}

interface PillStepperProps {
  /** `id` of the visible heading that names this control. */
  labelledBy: string;
  /** Accessible name of what is being counted, singular. e.g. "traveller". */
  unit: string;
  value: number;
  min?: number;
  max: number;
  onChange: (next: number) => void;
  /** Rendered to the left of the pill, typically a running total. */
  before?: React.ReactNode;
}

/**
 * A quantity picker in a pill.
 *
 * Three things it does that a pair of round buttons does not:
 *
 * Roll   The digits travel to the new number rather than swapping, up when
 *        counting up and down when counting down, so the direction of the
 *        change is readable without reading the digits.
 *
 * Hold   A held button keeps stepping and speeds up as it is held, which is
 *        how you get from one to six without six taps. The interval shrinks on
 *        every tick down to a floor, so it settles instead of running away.
 *
 * The acceleration is a self-rescheduling timeout rather than an interval,
 * because `setInterval` cannot change its own period mid flight.
 */
export default function PillStepper({
  labelledBy,
  unit,
  value,
  min = 1,
  max,
  onChange,
  before,
}: PillStepperProps) {
  // The hold timer keeps firing long after the render that started it, so it
  // reads the count from here rather than closing over a stale copy.
  const valueRef = useRef(value);
  const holdTimer = useRef<number | null>(null);
  const repeatTimer = useRef<number | null>(null);
  const [direction, setDirection] = useState<Direction>("up");

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const clearTimers = useCallback(() => {
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    if (repeatTimer.current !== null) {
      window.clearTimeout(repeatTimer.current);
      repeatTimer.current = null;
    }
  }, []);

  // A hold still running when the sheet closes would keep calling setState on
  // a tree that is no longer on screen.
  useEffect(() => clearTimers, [clearTimers]);

  const step = useCallback(
    (delta: number) => {
      const next = Math.min(max, Math.max(min, valueRef.current + delta));
      if (next === valueRef.current) return;
      valueRef.current = next;
      setDirection(delta > 0 ? "up" : "down");
      onChange(next);
    },
    [max, min, onChange],
  );

  // The press itself is the first step, so a tap answers on touch down rather
  // than waiting for the release. Holding then repeats, faster as it goes.
  const beginHold = useCallback(
    (delta: number) => {
      clearTimers();
      step(delta);

      let delay = REPEAT_START;
      const tick = () => {
        step(delta);
        delay = Math.max(REPEAT_FLOOR, delay * REPEAT_DECAY);
        repeatTimer.current = window.setTimeout(tick, delay);
      };

      holdTimer.current = window.setTimeout(() => {
        holdTimer.current = null;
        tick();
      }, HOLD_DELAY);
    },
    [clearTimers, step],
  );

  // A press is handled on the way down, so the click that follows it has
  // already been accounted for. `detail` is what tells that click apart from a
  // keyboard or assistive technology activation, which reports zero and has no
  // pointer event behind it. Reading the event rather than keeping a flag
  // means a press released off the button, where no click is ever delivered,
  // cannot leave the control wedged.
  const handleClick =
    (delta: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.detail === 0) step(delta);
    };

  const holdProps = (delta: number) => ({
    onPointerDown: () => beginHold(delta),
    onPointerUp: clearTimers,
    onPointerLeave: clearTimers,
    onPointerCancel: clearTimers,
    onBlur: clearTimers,
    // A long press on touch would raise the context menu and cancel the hold.
    onContextMenu: (event: React.MouseEvent) => event.preventDefault(),
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
      {before}

      <div
        role="group"
        aria-labelledby={labelledBy}
        className="flex shrink-0 items-center gap-3"
      >
        <span className="sr-only" aria-live="polite">
          {value} {value === 1 ? unit : `${unit}s`}
        </span>

        <RollingNumber
          value={value}
          direction={direction}
          className="text-[1.75rem] leading-none text-[var(--rl-text)]"
        />

        <div className="bm-pill">
          <button
            type="button"
            className="bm-pill-half"
            {...holdProps(-1)}
            onClick={handleClick(-1)}
            disabled={value <= min}
            aria-label={`One fewer ${unit}`}
          >
            <Minus
              style={{ width: ICON, height: ICON }}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            className="bm-pill-half"
            {...holdProps(1)}
            onClick={handleClick(1)}
            disabled={value >= max}
            aria-label={`One more ${unit}`}
          >
            <Plus
              style={{ width: ICON, height: ICON }}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
