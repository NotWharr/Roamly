"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Info, Users } from "lucide-react";

import BackLink from "@/components/layout/BackLink";
import SocialLinks from "@/components/design/SocialLinks";
import BookingCalendar from "@/components/ui/booking/BookingCalendar";
import ConfirmPanel from "@/components/ui/booking/ConfirmPanel";
import PillStepper, { RollingNumber } from "@/components/ui/booking/PillStepper";
import TourCard from "@/components/ui/booking/TourCard";
import JigglyButton from "@/components/ui/JigglyButton";
import { readableDate, toIsoDate } from "@/lib/calendar";
import { MAX_GUESTS, TOURS, findTour } from "@/lib/tours";
import { rlFonts } from "@/lib/roamlyFonts";

import "@/styles/roamly.css";

const INFO_ICON = 18;
const GUESTS_ICON = 16;

/** Reads the date and party size the booking sheet put in the URL. */
function useSelection() {
  const params = useSearchParams();

  return {
    date: params.get("date") ?? "",
    guests: Number(params.get("guests")) || 1,
    preselectId: params.get("tour") ? Number(params.get("tour")) : null,
  };
}

function BookingFlow() {
  const { date: urlDate, guests: urlGuests, preselectId } = useSelection();

  // Only preselected when the sheet named a trip. Arriving with nothing chosen
  // is the normal case, and it is the only honest one: a card that looks
  // selected but has not been chosen is a lie the click cannot correct, because
  // a radio that is already checked fires no change event.
  const [tourId, setTourId] = useState<number | null>(preselectId);
  const [date, setDate] = useState(urlDate);
  const [guests, setGuests] = useState(urlGuests);

  const tour = tourId === null ? null : findTour(tourId);
  const today = toIsoDate(new Date());

  // Open follows the choice, so there is no separate flag to fall out of sync.
  // Once a trip is chosen it stays chosen, so the panel never collapses while
  // the date or party size inside it is being edited.
  const open = tour !== null;
  const total = tour ? tour.price * guests : 0;

  const panelLabel = tour
    ? `${tour.name} selected. ${readableDate(date) || "No date yet"}, ${
        guests === 1 ? "1 traveller" : `${guests} travellers`
      }.`
    : "";

  return (
    <main
      className={`rl-root rl-on-ink rl-z-content relative flex min-h-dvh flex-col px-[length:var(--rl-gutter)] ${rlFonts}`}
    >
      <BackLink href="/">Back to exploring</BackLink>

      {/* min-w-0 for the same reason as the fieldset: this is a flex child, and
            without it the calendar's own width sets the page's minimum. */}
      <div className="mx-auto flex w-full min-w-0 max-w-5xl flex-1 flex-col pb-16 pt-32 sm:pt-36">
        <header className="max-w-[46ch]">
          <h1 className="rl-display text-[clamp(2.25rem,8vw,4rem)]">
            Book your trip
          </h1>

          <p className="mt-4 text-base leading-relaxed text-[var(--rl-mute)]">
            Pick an excursion, choose your date and how many are coming, then
            carry on to payment. Nothing is charged until you do.
          </p>
        </header>

        {/* min-w-0 is load bearing. A grid or flex child defaults to min-width:auto,
            so the strip's scroll width becomes the fieldset's minimum and the
            whole page scrolls sideways instead of only the strip. */}
          <fieldset className="mt-12 min-w-0 sm:mt-14">
          <legend className="rl-label text-[var(--rl-mute)]">
            Choose your excursion
          </legend>

          {/* One horizontal strip rather than a grid: the cards are tall and
              the strip scrolls on narrow screens, so nothing is cramped. */}
          <div className="rl-strip mt-5 flex snap-x snap-proximity gap-4 overflow-x-auto pb-4 sm:gap-5">
            {TOURS.map((option, i) => (
              <div
                key={option.id}
                className="w-[78vw] max-w-[320px] shrink-0 snap-start sm:w-[46vw] sm:max-w-none lg:w-[31%] lg:flex-1"
              >
                <TourCard
                  tour={option}
                  selected={option.id === tourId}
                  priority={i === 0}
                  onSelect={setTourId}
                />
              </div>
            ))}
          </div>
        </fieldset>

        {/* The panel drops under the strip once there is a choice to confirm. */}
        {/* Only mounted once a trip exists, so a closed panel holds no calendar
            at all rather than an inert one. */}
        <ConfirmPanel open={open} label={panelLabel} id="booking-confirm">
          {tour ? (
            <>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
            <div>
              <h2 className="rl-display text-[clamp(1.375rem,4vw,1.75rem)] tracking-[-0.02em]">
                {tour.name}
              </h2>

              <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-[var(--rl-mute)]">
                {tour.blurb}
              </p>

              <div className="mt-6">
                <span
                  id="booking-page-guests"
                  className="rl-label flex items-center gap-1.5 text-[var(--rl-mute)]"
                >
                  <Users size={GUESTS_ICON} strokeWidth={1.5} aria-hidden="true" />
                  How many coming
                </span>

                <div className="mt-3">
                  <PillStepper
                    labelledBy="booking-page-guests"
                    unit="traveller"
                    value={guests}
                    max={MAX_GUESTS}
                    onChange={setGuests}
                    before={
                      <p className="max-w-[34ch] text-xs leading-relaxed text-[var(--rl-mute)]">
                        Up to {MAX_GUESTS} on any one excursion.
                      </p>
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <span className="rl-label block text-[var(--rl-mute)]">
                Your date
              </span>

              <div className="bm-panel mt-3">
                <BookingCalendar
                  value={date}
                  onChange={setDate}
                  minDate={today}
                />
              </div>

              <p
                id="booking-page-date-hint"
                className="mt-2.5 text-xs leading-relaxed text-[var(--rl-mute)]"
              >
                {date
                  ? `${readableDate(date)}. We send the meeting point the day before.`
                  : "Pick a day to continue."}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-[var(--rl-line)] pt-5">
            <span className="rl-label text-[var(--rl-mute)]">
              {guests} &times; ${tour.price}
            </span>

            <span className="rl-display text-3xl tabular-nums">
              $
              <RollingNumber value={total} direction="up" />
            </span>
          </div>

          {date ? (
            <JigglyButton
              href={`/checkout?option=${tour.id}&startDate=${Number(
                date.split("-")[2],
              )}&adults=${guests}&children=0`}
              size="block"
              withArrow
              className="mt-6 w-full"
              aria-describedby="booking-page-date-hint"
            >
              Take this to payment
            </JigglyButton>
          ) : (
            <>
              <JigglyButton
                size="block"
                disabled
                className="mt-6 w-full"
                aria-describedby="booking-page-date-hint"
              >
                Take this to payment
              </JigglyButton>
              <p className="mt-3 text-sm text-[var(--rl-mute)]">
                Choose a date above and the payment step opens here.
              </p>
            </>
          )}
            </>
          ) : null}
        </ConfirmPanel>

        <p className="mt-10 flex items-start gap-2 text-sm leading-relaxed text-[var(--rl-mute)]">
          <Info
            style={{
              width: INFO_ICON,
              height: INFO_ICON,
              flexShrink: 0,
              marginTop: 2,
            }}
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span>
            Choosing a date holds it for 24 hours and charges nothing yet. Our{" "}
            <Link href="/terms" className="rl-check-link">
              terms and conditions
            </Link>{" "}
            set out how a booking is confirmed and cancelled.
          </span>
        </p>

        <div className="mt-auto pt-16">
          <SocialLinks />
        </div>
      </div>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <main
          className={`rl-root rl-on-ink flex min-h-dvh items-center justify-center px-[length:var(--rl-gutter)] ${rlFonts}`}
        >
          <p className="text-sm text-[var(--rl-mute)]">Loading your booking</p>
        </main>
      }
    >
      <BookingFlow />
    </Suspense>
  );
}
