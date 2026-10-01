"use client";

import { useState } from "react";
import { ArrowRight, Check, Mail, User } from "lucide-react";

import FormField from "./FormField";
import JigglyButton from "@/components/ui/JigglyButton";

import { rlFonts } from "@/lib/roamlyFonts";

import "@/styles/roamly.css";

const ICON_SIZE = 20;
const ARROW_SIZE = 18;
const EMAIL = "hello@roamlytours.com";

type Errors = Partial<Record<"name" | "email" | "message" | "terms", string>>;

type Values = {
  name: string;
  email: string;
  message: string;
  terms: boolean;
};

const EMPTY: Values = { name: "", email: "", message: "", terms: false };

/** Validates the whole form at once. Returns an empty object when it passes. */
function validate(values: Values): Errors {
  const errors: Errors = {};

  if (!values.name.trim()) {
    errors.name = "Enter your name.";
  }

  if (!values.email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "That email address does not look right.";
  }

  if (!values.message.trim()) {
    errors.message = "Tell us how we can help.";
  }

  if (!values.terms) {
    errors.terms = "Please accept the terms to continue.";
  }

  return errors;
}

/**
 * The contact form.
 *
 * Translated from the reference design onto the site's dark theme rather than
 * pasted in as a light card, so it does not invert the page.
 *
 * A page rather than a dialog, so the form is a real destination: linkable,
 * shareable, and reachable without JavaScript. No focus trap or scroll lock is
 * needed because nothing is overlaid.
 */
export default function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  function update(patch: Partial<Values>) {
    setValues((previous) => ({ ...previous, ...patch }));
  }

  /**
   * Clears a field's error as soon as the visitor edits it, so the message
   * never argues with them while they are fixing it.
   */
  function updateAndClear(key: keyof Values, patch: Partial<Values>) {
    update(patch);
    setErrors((previous) => {
      if (!previous[key]) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // Send focus to the first thing that needs attention.
      const firstBad = Object.keys(found)[0];
      const form = event.currentTarget;
      const target = form.querySelector<HTMLElement>(
        firstBad === "terms" ? "#contact-terms" : `#contact-${firstBad}`,
      );
      target?.focus();
      return;
    }

    setIsSending(true);

    // Stands in for the form endpoint.
    window.setTimeout(() => {
      setIsSending(false);
      setSent(true);
    }, 900);
  }

  if (sent) {
    return (
      <div className={`rl-root ${rlFonts}`}>
        <div className="rl-sheet-in mx-auto max-w-xl rounded-[4px] border border-[var(--rl-line)] bg-[var(--rl-ink)] p-10 text-center">
          <div
            className="mx-auto grid h-14 w-14 place-items-center rounded-full"
            style={{
              background: "color-mix(in srgb, var(--rl-accent) 16%, transparent)",
              color: "var(--rl-accent-text)",
            }}
            aria-hidden="true"
          >
            <Check style={{ width: 26, height: 26 }} strokeWidth={2} />
          </div>

          <h2 className="rl-display mt-6 text-[clamp(1.5rem,5vw,2rem)]">
            Message sent
          </h2>

          <p className="mx-auto mt-3 max-w-[38ch] text-sm leading-relaxed text-[var(--rl-mute)]">
            Thanks for reaching out. Our team replies to most messages within
            one working day.
          </p>

          <JigglyButton
            type="button"
            size="block"
            onClick={() => {
              setValues(EMPTY);
              setErrors({});
              setSent(false);
            }}
          >
            Send another
          </JigglyButton>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`rl-root ${rlFonts}`} noValidate>
      <div className="grid gap-6">
        <FormField id="contact-name" label="Full Name" error={errors.name}
          icon={<User style={{ width: ICON_SIZE, height: ICON_SIZE }} strokeWidth={1.5} />}
        >
          {(props) => (
            <input
              {...props}
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Enter your full name"
              value={values.name}
              onChange={(e) => updateAndClear("name", { name: e.target.value })}
              className="rl-input"
            />
          )}
        </FormField>

        <FormField id="contact-email" label="Email Address" error={errors.email}
          icon={<Mail style={{ width: ICON_SIZE, height: ICON_SIZE }} strokeWidth={1.5} />}
        >
          {(props) => (
            <input
              {...props}
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder="Enter your email address"
              value={values.email}
              onChange={(e) => updateAndClear("email", { email: e.target.value })}
              className="rl-input"
            />
          )}
        </FormField>

        <FormField id="contact-message" label="Message" error={errors.message}>
          {(props) => (
            <textarea
              {...props}
              name="message"
              rows={5}
              placeholder="Enter your message"
              value={values.message}
              onChange={(e) => updateAndClear("message", { message: e.target.value })}
              className="rl-input rl-textarea"
            />
          )}
        </FormField>

        {/* Terms */}
        <div>
          <label className="rl-check" htmlFor="contact-terms">
            <input
              id="contact-terms"
              type="checkbox"
              name="terms"
              checked={values.terms}
              onChange={(e) => updateAndClear("terms", { terms: e.target.checked })}
              aria-invalid={errors.terms ? true : undefined}
              aria-describedby={errors.terms ? "contact-terms-error" : undefined}
              className="rl-check-input"
            />
            <span className="rl-check-box" aria-hidden="true">
              <Check style={{ width: 12, height: 12 }} strokeWidth={3} />
            </span>
            <span className="flex flex-wrap items-center gap-x-1.5">
              <span>I agree to the</span>
              <a href="/terms" className="rl-check-link">
                terms and conditions
              </a>
              <span aria-hidden="true">.</span>
            </span>
          </label>

          <p id="contact-terms-error" className="rl-error" role={errors.terms ? "alert" : undefined}>
            {errors.terms ?? ""}
          </p>
        </div>

        <JigglyButton type="submit" size="block" disabled={isSending} className="mt-1 w-full">
          {isSending ? "Sending..." : "Send the message"}
          <ArrowRight style={{ width: ARROW_SIZE, height: ARROW_SIZE }} strokeWidth={1.5} aria-hidden="true" />
        </JigglyButton>
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-[var(--rl-mute)]">
        Prefer email? Write to{" "}
        <a href={`mailto:${EMAIL}`} className="rl-check-link">
          {EMAIL}
        </a>
        . We are in St George&rsquo;s, which is Grenada time, UTC minus four.
      </p>
    </form>
  );
}
