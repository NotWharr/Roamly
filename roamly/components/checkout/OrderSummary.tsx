"use client";

import Link from "next/link";
import { CalendarDays, Clock, Users } from "lucide-react";

import type { Money } from "@/lib/checkout";
import { DEPARTURE_TIME } from "@/lib/checkout";

const LABEL_ICON = 16;

interface OrderSummaryProps {
  tourTitle: string;
  duration: string;
  dateLabel: string;
  guests: number;
  money: Money;
}

/**
 * The order summary.
 *
 * Sticky on desktop so it stays in view while the form scrolls, which is the
 * whole point of showing the total next to the card fields.
 */
export default function OrderSummary({
  tourTitle,
  duration,
  dateLabel,
  guests,
  money,
}: OrderSummaryProps) {
  return (
    <aside className="lg:sticky lg:top-8">
      <div className="rounded-[4px] border border-[var(--rl-line)] bg-[var(--rl-ink-2)] p-6">
        <h2 className="rl-display text-xl">{tourTitle}</h2>
        <p className="mt-1 text-sm text-[var(--rl-mute)]">Guided excursion</p>

        {/* Generous spacing, not a hairline per row. Four short facts stacked
            with rules between them reads as a receipt from a till. */}
        <dl className="mt-6 flex flex-col gap-4">
          <div className="flex items-start gap-2.5">
            <CalendarDays
              style={{
                width: LABEL_ICON,
                height: LABEL_ICON,
                marginTop: 3,
                flexShrink: 0,
              }}
              strokeWidth={1.5}
              aria-hidden="true"
              className="text-[var(--rl-mute)]"
            />
            <div>
              <dt className="text-xs text-[var(--rl-mute)]">Date</dt>
              <dd className="text-sm">{dateLabel}</dd>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock
              style={{
                width: LABEL_ICON,
                height: LABEL_ICON,
                marginTop: 3,
                flexShrink: 0,
              }}
              strokeWidth={1.5}
              aria-hidden="true"
              className="text-[var(--rl-mute)]"
            />
            <div>
              <dt className="text-xs text-[var(--rl-mute)]">Departure</dt>
              <dd className="text-sm">
                {DEPARTURE_TIME} · {duration}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Users
              style={{
                width: LABEL_ICON,
                height: LABEL_ICON,
                marginTop: 3,
                flexShrink: 0,
              }}
              strokeWidth={1.5}
              aria-hidden="true"
              className="text-[var(--rl-mute)]"
            />
            <div>
              <dt className="text-xs text-[var(--rl-mute)]">Travellers</dt>
              <dd className="text-sm">
                {guests} {guests === 1 ? "person" : "people"}
              </dd>
            </div>
          </div>
        </dl>

        <div className="mt-7 border-t border-[var(--rl-line)] pt-5">
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <span className="text-[var(--rl-mute)]">Subtotal</span>
            <span className="tabular-nums">${money.base.toFixed(2)}</span>
          </div>

          <div className="mt-2 flex items-baseline justify-between gap-4 text-sm">
            <span className="text-[var(--rl-mute)]">Taxes and fees</span>
            <span className="tabular-nums">${money.taxes.toFixed(2)}</span>
          </div>

          <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-[var(--rl-line)] pt-4">
            <span className="rl-label text-[var(--rl-mute)]">Total due</span>
            <span className="rl-display text-2xl tabular-nums">
              ${money.total.toFixed(2)}
            </span>
          </div>
        </div>

        <Link
          href="/booking"
          className="mt-6 inline-flex min-h-[44px] items-center gap-1.5 text-sm text-[var(--rl-mute)] transition-colors duration-200 hover:text-[var(--rl-text)]"
        >
          Change excursion or date
        </Link>
      </div>
    </aside>
  );
}
