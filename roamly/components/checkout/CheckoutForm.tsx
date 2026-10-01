"use client";

import type { ReactNode } from "react";
import { Info, Lock } from "lucide-react";

import JigglyButton from "@/components/ui/JigglyButton";
import { type Money, formatCard, formatExpiry } from "@/lib/checkout";

const INFO_ICON = 18;
const LOCK_ICON = 13;

/**
 * The labelled field primitive for checkout.
 *
 * Takes the control through a function rather than children, so the id, the
 * error wiring and the invalid state are set here once instead of at each of
 * the eight call sites.
 */
function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: (props: {
    id: string;
    className: string;
    "aria-invalid"?: true;
    "aria-describedby"?: string;
  }) => ReactNode;
}) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <label htmlFor={id} className="rl-field-label">
        {label}
      </label>

      {children({
        id,
        className: "rl-input",
        ...(error ? { "aria-invalid": true as const } : {}),
        ...(describedBy ? { "aria-describedby": describedBy } : {}),
      })}

      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-[var(--rl-mute)]">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={`${id}-error`} className="rl-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface CheckoutFormProps {
  tourTitle: string;
  duration: string;
  guests: number;
  money: Money;
  values: Record<string, string>;
  errors: Record<string, string>;
  showError: (key: string) => string;
  setValue: (key: string, next: string) => void;
  paying: boolean;
  onSubmit: (event: React.FormEvent) => void;
}

export default function CheckoutForm({
  tourTitle,
  duration,
  guests,
  money,
  values,
  errors,
  showError,
  setValue,
  paying,
  onSubmit,
}: CheckoutFormProps) {
  const e = (key: string) => showError(key) || errors[key] || "";

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <section className="rounded-[4px] border border-[var(--rl-line)] bg-[var(--rl-ink-2)] p-6">
        <h2 className="rl-display text-xl">Who is travelling</h2>

        <p className="mt-1.5 text-sm text-[var(--rl-mute)]">
          {tourTitle}, {duration}, {guests}{" "}
          {guests === 1 ? "traveller" : "travellers"}. We send the meeting point
          to this contact.
        </p>

        <div className="mt-6 flex flex-col gap-5">
          <Field id="co-name" label="Full name" error={e("name")}>
            {(props) => (
              <input
                {...props}
                type="text"
                autoComplete="name"
                placeholder="As it appears on your ID"
                value={values.name}
                onChange={(ev) => setValue("name", ev.target.value)}
              />
            )}
          </Field>

          <Field
            id="co-phone"
            label="Mobile phone"
            hint="For excursion updates and emergencies on the day."
            error={e("phone")}
          >
            {(props) => (
              <input
                {...props}
                type="tel"
                autoComplete="tel"
                placeholder="+1 473 555 0100"
                value={values.phone}
                onChange={(ev) => setValue("phone", ev.target.value)}
              />
            )}
          </Field>

          <Field
            id="co-email"
            label="Email"
            hint="Your confirmation and meeting point go here."
            error={e("email")}
          >
            {(props) => (
              <input
                {...props}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={(ev) => setValue("email", ev.target.value)}
              />
            )}
          </Field>

          <Field
            id="co-notes"
            label="Anything we should know"
            hint="Pick-up point, dietary needs, mobility. Optional."
          >
            {(props) => (
              <textarea
                {...props}
                rows={3}
                placeholder="Hotel name, or anywhere in St George's"
                value={values.notes}
                onChange={(ev) => setValue("notes", ev.target.value)}
                className="rl-input rl-textarea"
              />
            )}
          </Field>
        </div>
      </section>

      <section className="rounded-[4px] border border-[var(--rl-line)] bg-[var(--rl-ink-2)] p-6">
        <h2 className="rl-display text-xl">Payment</h2>

        <p className="mt-1.5 flex items-start gap-2 text-sm text-[var(--rl-mute)]">
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
            No payment provider is connected yet, so this step validates and
            confirms without charging anything.
          </span>
        </p>

        <div className="mt-6 flex flex-col gap-5">
          <Field id="co-card" label="Card number" error={e("card")}>
            {(props) => (
              <input
                {...props}
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="4242 4242 4242 4242"
                value={values.card}
                onChange={(ev) => setValue("card", formatCard(ev.target.value))}
              />
            )}
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="co-expiry" label="Expiry" error={e("expiry")}>
              {(props) => (
                <input
                  {...props}
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM / YY"
                  value={values.expiry}
                  onChange={(ev) => setValue("expiry", formatExpiry(ev.target.value))}
                />
              )}
            </Field>

            <Field id="co-cvc" label="Security code" error={e("cvc")}>
              {(props) => (
                <input
                  {...props}
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  value={values.cvc}
                  onChange={(ev) => setValue("cvc", ev.target.value.replace(/\D/g, "").slice(0, 4))}
                />
              )}
            </Field>
          </div>
        </div>
      </section>

      <JigglyButton type="submit" size="block" disabled={paying} className="w-full sm:w-fit sm:px-10">
        {paying ? "Checking details" : `Pay $${money.total.toFixed(2)}`}
      </JigglyButton>

      <p className="-mt-2 flex items-center justify-center gap-1.5 text-xs text-[var(--rl-mute)]">
        <Lock
          style={{ width: LOCK_ICON, height: LOCK_ICON }}
          strokeWidth={1.5}
          aria-hidden="true"
        />
        Free cancellation up to 24 hours before.
      </p>
    </form>
  );
}
