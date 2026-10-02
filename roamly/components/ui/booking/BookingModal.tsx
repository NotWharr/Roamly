"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Lock, Users, X } from "lucide-react";

import BookingCalendar from "@/components/ui/booking/BookingCalendar";
import PillStepper from "@/components/ui/booking/PillStepper";
import JigglyButton from "@/components/ui/JigglyButton";
import { toIsoDate } from "@/lib/calendar";
import { MAX_GUESTS } from "@/lib/tours";
import { rlFonts } from "@/lib/roamlyFonts";

import "@/styles/roamly.css";

const CLOSE_ICON = 22;
const LABEL_ICON = 16;
const LOCK_ICON = 13;

const FOCUSABLE = 'button, input, [href], [tabindex]:not([tabindex="-1"])';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * The excursion the visitor arrived from. Carried through to the booking
   * page so an arrival from a tour card lands on that tour already chosen.
   */
  preSelectedOptionId?: number | null;
}

/**
 * The booking sheet.
 *
 * Two decisions: when and how many. The excursion itself is chosen on the
 * booking page, so this sheet does not price anything and shows no total. That
 * is why it can sit open as a bottom sheet without committing anyone to a
 * cost, and why the price lives in one place rather than two.
 *
 * The reference was a warm light card, so it is translated onto the site's dark
 * ramp rather than pasted in. What survives is its shape: the heading, the two
 * labelled controls, and the pinned call to action.
 */
export default function BookingModal({
  isOpen,
  onClose,
  preSelectedOptionId,
}: BookingModalProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState("");
  const today = toIsoDate(new Date());

  // Keep the newest onClose without re-running the focus and key handling.
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Escape closes, Tab stays inside the sheet, focus returns to the trigger.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const nodes = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Nothing is reserved until a date is on the sheet, so the call to action
  // stays closed until then rather than failing on submit.
  const canBook = Boolean(date);

  const handleBook = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canBook) return;
    onClose();

    const params = new URLSearchParams({
      guests: String(guests),
      date,
    });
    if (preSelectedOptionId) params.set("tour", String(preSelectedOptionId));

    router.push(`/booking?${params.toString()}`);
  };

  return (
    <div
      className={`rl-root rl-darklock rl-z-modal fixed inset-0 flex items-end justify-center sm:items-center sm:p-6 ${rlFonts}`}
    >
      <div
        className="rl-backdrop-in absolute inset-0 bg-[rgba(4,14,18,0.82)]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        tabIndex={-1}
        className="bm-sheet rl-on-ink-2 rl-sheet-in relative flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-[28px] sm:max-w-xl sm:rounded-[4px]"
      >
        <form
          onSubmit={handleBook}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-5 sm:px-8 sm:pt-7">
            <div className="bm-head">
              <h2
                id="booking-title"
                className="rl-display text-balance text-[clamp(1.75rem,6vw,2.375rem)]"
              >
                Pick a day and{" "}
                <span className="font-extrabold text-[var(--rl-accent)]">
                  we will hold it
                </span>
              </h2>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close booking"
                className="-mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-[var(--rl-mute)] transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--rl-text)_10%,transparent)] hover:text-[var(--rl-text)]"
              >
                <X
                  style={{ width: CLOSE_ICON, height: CLOSE_ICON }}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-6 sm:mt-8 sm:gap-8">
              <div>
                <h3 className="rl-label flex items-center gap-1.5 text-[var(--rl-mute)]">
                  <CalendarDays
                    style={{ width: LABEL_ICON, height: LABEL_ICON }}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  Choose your date
                </h3>

                <div className="bm-panel mt-3">
                  <BookingCalendar
                    value={date}
                    onChange={setDate}
                    minDate={today}
                  />
                </div>

                <p
                  id="booking-date-hint"
                  className="mt-2.5 text-[13px] leading-relaxed text-[var(--rl-mute)]"
                >
                  {canBook ? (
                    <>
                      {formatChosenDate(date)} starts at 8:00 AM. We will send
                      the meeting point the day before.
                    </>
                  ) : (
                    "Pick a day on the calendar to continue."
                  )}
                </p>
              </div>

              <div>
                <h3 className="rl-label flex items-center gap-1.5 text-[var(--rl-mute)]">
                  <Users
                    style={{ width: LABEL_ICON, height: LABEL_ICON }}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span id="booking-guests">How many coming</span>
                </h3>

                <div className="mt-3">
                  <PillStepper
                    labelledBy="booking-guests"
                    unit="traveller"
                    value={guests}
                    max={MAX_GUESTS}
                    onChange={setGuests}
                    before={
                      <p className="max-w-[34ch] text-[13px] leading-relaxed text-[var(--rl-mute)]">
                        Up to {MAX_GUESTS} on any one excursion. For a bigger
                        group, email us and we will put two guides on it.
                      </p>
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pinned footer: the single call to action, in the thumb zone on
              mobile and clear of the scroll area on desktop. */}
          <div className="shrink-0 border-t border-[var(--rl-line)] bg-[var(--rl-ink-2)] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-8">
            <JigglyButton
              type="submit"
              size="block"
              className="w-full"
              disabled={!canBook}
              aria-describedby="booking-date-hint"
            >
              Book now
            </JigglyButton>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[var(--rl-mute)]">
              <Lock
                style={{ width: LOCK_ICON, height: LOCK_ICON }}
                strokeWidth={1.5}
                aria-hidden="true"
              />
              Nothing is charged on this step.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatChosenDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
