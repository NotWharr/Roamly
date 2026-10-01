"use client";

import SocialLinks from "@/components/design/SocialLinks";
import BackLink from "@/components/layout/BackLink";

import { rlFonts } from "@/lib/roamlyFonts";

import "@/styles/roamly.css";

const EMAIL = "hello@roamlytours.com";

/**
 * The terms of booking.
 *
 * Kept as data rather than JSX so the clauses are readable on their own and
 * the prose never has to be tangled up with markup. Each clause renders as one
 * `section` with a heading, which is what gives the page a correct heading
 * outline for screen readers.
 */
interface Clause {
  id: string;
  title: string;
  /** One or more paragraphs. */
  body: string[];
  /** Optional bullet list rendered under the last paragraph. */
  list?: string[];
}

const INTRO =
  "These terms cover bookings made through Roamly for guided excursions in Grenada. By confirming a booking you agree to them. They are written to be read, so if anything here is unclear, ask us before you book.";

const UPDATED = "Last updated 30 September 2026";

const CLAUSES: Clause[] = [
  {
    id: "booking",
    title: "Making a booking",
    body: [
      "A booking is confirmed once we have received your payment and sent you a confirmation. We will always confirm in writing, so if you have not heard from us within one working day, treat the booking as unconfirmed and get in touch.",
      "Please check the details in your confirmation straight away, including the date, the number of guests, and any dietary or mobility requirements you have given us. Corrections are free up to 24 hours before departure.",
    ],
  },
  {
    id: "payment",
    title: "Payment",
    body: [
      "Prices are per person and are shown in US dollars. The full amount is due at the time of booking.",
      "A booking is only held once payment has cleared. We accept the major credit and debit cards. If a payment fails or is reversed after we have confirmed, the booking is cancelled and the space is released.",
    ],
  },
  {
    id: "cancellation",
    title: "Cancellations and refunds",
    body: [
      "You can cancel for a full refund any time up to 24 hours before your scheduled tour time. After that point we are no longer able to refund, because guide time, transport, and permits are already committed on your behalf.",
      "Cancellations inside 24 hours, and reschedules caused by weather or by conditions that make an activity unsafe, are handled case by case. Where the fault is ours, you are refunded in full.",
    ],
    list: [
      "More than 24 hours before: full refund",
      "Inside 24 hours: no refund, as costs are already committed",
      "Cancelled by us, for any reason: full refund",
    ],
  },
  {
    id: "changes",
    title: "Changes to your booking",
    body: [
      "You can move your date or change the number of guests up to 24 hours before departure, subject to availability. We will do our best to help, but peak dates fill early, so please give us as much notice as you can.",
    ],
  },
  {
    id: "you",
    title: "What we expect from you",
    body: [
      "Our tours are guided, and the guide is there to keep the group safe. Please follow their instructions at all times, including on water, on trails, and in the rainforest.",
      "Tell us before you book if you have a medical condition, a mobility need, a severe allergy, or are pregnant. Some activities are not suitable for everyone, and we would far rather adjust your booking than carry you out.",
      "You must be at least 18 to book on behalf of anyone else, and any guest under 12 must be accompanied by an adult named on the booking.",
    ],
  },
  {
    id: "weather",
    title: "Weather and route changes",
    body: [
      "Tropical weather changes quickly, and safety comes first. Guides may shorten, reroute, or replace an activity when conditions make the original plan unsafe or unpleasant. Where a material part of your tour is replaced, we will tell you as soon as we can and offer a refund for that part.",
    ],
  },
  {
    id: "your-effects",
    title: "Cancellations by you on the day",
    body: [
      "If you do not arrive for your tour, we cannot refund it. A group runs to a fixed schedule, and your place has already been held for you.",
    ],
  },
  {
    id: "equipment",
    title: "What to bring",
    body: [
      "Bring comfortable footwear, sun protection, a change of clothes, and a refillable water bottle. Where an activity needs specialist equipment, such as a life jacket or a harness, we provide it and include it in the price.",
      "We cannot lend you specialist clothing or footwear. Anything you wear or carry is your responsibility, and you should not bring anything you would be upset to lose.",
    ],
  },
  {
    id: "photos",
    title: "Photos and video",
    body: [
      "Our guides often take photographs on tours, and we may use them on this site or on social media. If you would prefer we did not photograph you, or that we remove a specific image, tell your guide on the day or email us afterwards, and we will action it.",
    ],
  },
  {
    id: "liability",
    title: "Liability",
    body: [
      "We are responsible for running your tour with reasonable care. We are not liable for loss or damage to personal property, or for events outside our reasonable control, provided we took reasonable steps to prevent them.",
      "Nothing in these terms limits our liability for death or personal injury caused by our negligence, or for anything else that cannot lawfully be limited.",
    ],
  },
  {
    id: "complaints",
    title: "Complaints",
    body: [
      "If something did not meet the standard we promised, tell us within 14 days of your tour. We would much rather hear about a problem while it is still fresh, and we will look at it properly.",
    ],
  },
  {
    id: "changes-to-these-terms",
    title: "Changes to these terms",
    body: [
      "We may update these terms as our tours change. When we do, we update the date at the top of this page. Terms in place at the time you made your booking continue to apply to that booking.",
    ],
  },
];

/**
 * The terms and conditions page.
 *
 * A real route so the contact form's link resolves, and so the terms are
 * linkable and shareable in their own right. Presented on the same ink ramp
 * as every other page, with a single measure that keeps the lines readable.
 */
export default function TermsPage() {
  return (
    <main
      className={`rl-root rl-on-ink rl-z-content relative flex min-h-dvh flex-col px-[length:var(--rl-gutter)] ${rlFonts}`}
    >
      <BackLink href="/contact">Back to contact</BackLink>

      <article className="mx-auto w-full max-w-3xl flex-1 pb-16 pt-32 sm:pt-36">
        <header>
          <span className="rl-badge">Legal</span>

          <h1 className="rl-display mt-5 text-[clamp(2.25rem,8vw,3.5rem)]">
            Terms and Conditions
          </h1>

          <p className="mt-4 text-sm text-[var(--rl-mute)]">{UPDATED}</p>

          <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-[var(--rl-mute)]">
            {INTRO}
          </p>
        </header>

        <nav aria-label="On this page" className="mt-12">
          <h2 className="rl-label text-[var(--rl-mute)]">On this page</h2>

          <ol className="mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-2">
            {CLAUSES.map((clause) => (
              <li key={clause.id}>
                <a
                  href={`#${clause.id}`}
                  className="flex min-h-[44px] items-center rounded-lg py-2 text-sm text-[var(--rl-mute)] transition-colors duration-200 hover:text-[var(--rl-accent-text)]"
                >
                  {clause.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-14 flex flex-col gap-10">
          {CLAUSES.map((clause) => (
            <section
              key={clause.id}
              id={clause.id}
              aria-labelledby={`${clause.id}-heading`}
              className="scroll-mt-32"
            >
              <h2
                id={`${clause.id}-heading`}
                className="rl-display text-[clamp(1.375rem,4.5vw,1.75rem)] leading-[1.15] tracking-[-0.02em]"
              >
                {clause.title}
              </h2>

              <div className="mt-4 flex flex-col gap-4">
                {clause.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 32)}
                    className="max-w-[62ch] text-base leading-relaxed text-[var(--rl-mute)]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {clause.list ? (
                <ul className="mt-5 flex flex-col gap-2">
                  {clause.list.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[0.9375rem] leading-relaxed text-[var(--rl-mute)]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-px w-4 shrink-0"
                        style={{ background: "var(--rl-accent)" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        {/* Questions */}
        <section
          aria-labelledby="terms-help"
          className="mt-16 rounded-[4px] border border-[var(--rl-line)] bg-[var(--rl-ink-2)] p-8"
        >
          <h2 id="terms-help" className="rl-display text-xl">
            Something unclear?
          </h2>

          <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-[var(--rl-mute)]">
            Ask us before you book rather than after. Email{" "}
            <a href={`mailto:${EMAIL}`} className="rl-check-link">
              {EMAIL}
            </a>{" "}
            and we will explain any part of this in plain terms.
          </p>
        </section>

        <div className="mt-16 border-t border-[var(--rl-line)] pt-12">
          <SocialLinks />
        </div>
      </article>
    </main>
  );
}
