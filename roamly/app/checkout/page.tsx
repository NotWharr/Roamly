"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import BackLink from "@/components/layout/BackLink";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import Confirmation from "@/components/checkout/Confirmation";
import { readableDate } from "@/lib/calendar";
import { RULES, quote } from "@/lib/checkout";
import { findTour } from "@/lib/tours";
import { rlFonts } from "@/lib/roamlyFonts";

import "@/styles/roamly.css";

/**
 * Order of the checks, so a submit can send focus to the first thing that is
 * wrong rather than making the user hunt. This order also matches the visual
 * order of the form.
 */
const FIELD_ORDER = [
  ["name", RULES.name],
  ["phone", RULES.phone],
  ["email", RULES.email],
  ["card", RULES.card],
  ["expiry", RULES.expiry],
  ["cvc", RULES.cvc],
] as const;

const EMPTY_VALUES: Record<string, string> = {
  name: "",
  phone: "",
  email: "",
  notes: "",
  card: "",
  expiry: "",
  cvc: "",
};

/** A reference for this attempt. Real-looking, and not reused across loads. */
function makeReference(): string {
  const digits = Math.floor(Math.random() * 90000) + 10000;
  return `RL-${digits}`;
}

function Checkout() {
  const params = useSearchParams();

  const tour = findTour(Number(params.get("option")));
  const guests = Math.max(1, Number(params.get("adults")) || 1);
  const children = Math.max(0, Number(params.get("children")) || 0);
  const iso = params.get("startDate") ?? "";

  // The booking page passes a full date as a query param; a bare day number is
  // accepted too so an older link still resolves.
  const dateLabel = /^\d{4}-\d{2}-\d{2}$/.test(iso)
    ? readableDate(iso)
    : iso
      ? readableDate(`${new Date().getFullYear()}-10-${iso.padStart(2, "0")}`)
      : "Not chosen yet";

  const money = useMemo(
    () => quote(tour.price, guests, children),
    [tour.price, guests, children],
  );

  const [values, setValues] = useState(EMPTY_VALUES);
  const [submitted, setSubmitted] = useState(false);
  const [paying, setPaying] = useState(false);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const referenceRef = useRef(makeReference());

  const errors = useMemo(() => {
    const out: Record<string, string> = {};
    for (const [key, rule] of FIELD_ORDER) out[key] = rule(values[key] ?? "");
    return out;
  }, [values]);

  // Errors only appear once a submit has been attempted, otherwise the form
  // greets you in red before you have typed anything.
  const showError = (key: string) =>
    submitted ? (errors[key] || "") : "";

  const setValue = (key: string, next: string) =>
    setValues((prev) => ({ ...prev, [key]: next }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    // Send focus to the first field that is wrong, so the user is told where to
    // look rather than only being told that something is.
    for (const [key, rule] of FIELD_ORDER) {
      if (rule(values[key] ?? "")) {
        document.getElementById(`co-${key}`)?.focus();
        return;
      }
    }

    setPaying(true);
    window.setTimeout(() => {
      setPaying(false);
      setConfirmed(referenceRef.current);
    }, 900);
  };

  return (
    <main
      className={`rl-root rl-on-ink rl-z-content relative flex min-h-dvh flex-col px-[length:var(--rl-gutter)] ${rlFonts}`}
    >
      <BackLink href="/booking">Back to booking</BackLink>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col pb-16 pt-32 sm:pt-36">
        <header className="max-w-[44ch]">
          <h1 className="rl-display text-[clamp(2.25rem,8vw,3.5rem)]">
            Payment
          </h1>

          <p className="mt-4 text-base leading-relaxed text-[var(--rl-mute)]">
            Who is coming, and how you would like to pay. We hold your place
            for 24 hours from here.
          </p>
        </header>

        <div className="mt-10 grid gap-8 sm:mt-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
          <CheckoutForm
            tourTitle={tour.name}
            duration={tour.duration}
            guests={guests}
            money={money}
            values={values}
            errors={errors}
            showError={showError}
            setValue={setValue}
            paying={paying}
            onSubmit={handleSubmit}
          />

          <OrderSummary
            tourTitle={tour.name}
            duration={tour.duration}
            dateLabel={dateLabel}
            guests={guests}
            money={money}
          />
        </div>

        {/*
          One place for the eye to go when the total is wrong. The booking page
          shows a different price list, so a mismatch is a live possibility and
          worth naming rather than leaving the reader to notice.
        */}
        <p className="mt-10 text-sm text-[var(--rl-mute)]">
          Totals are calculated from the shared tour list. If something looks
          wrong,{" "}
          <Link href="/terms" className="rl-check-link">
            check the terms
          </Link>{" "}
          or email us before you pay.
        </p>
      </div>

      <Confirmation
        isOpen={confirmed !== null}
        email={values.email}
        tourTitle={tour.name}
        dateLabel={dateLabel}
        total={money.total.toFixed(2)}
        reference={confirmed ?? ""}
      />
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main
          className={`rl-root rl-on-ink flex min-h-dvh items-center justify-center px-[length:var(--rl-gutter)] ${rlFonts}`}
        >
          <p className="text-sm text-[var(--rl-mute)]">Loading checkout</p>
        </main>
      }
    >
      <Checkout />
    </Suspense>
  );
}
