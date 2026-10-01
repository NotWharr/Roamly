"use client";

import { Check, Mail } from "lucide-react";

import JigglyButton from "@/components/ui/JigglyButton";

const CHECK_ICON = 26;
const MAIL_ICON = 18;

interface ConfirmationProps {
  isOpen: boolean;
  email: string;
  tourTitle: string;
  dateLabel: string;
  total: string;
  reference: string;
}

/**
 * What replaces the form once the details check out.
 *
 * A real dialog rather than a div, because it takes focus and Escape has to
 * work, and it says plainly that nothing was charged. The old version of this
 * claimed "Payment Received" and gave a booking reference that was hardcoded,
 * which is a worse lie than an unfinished page.
 */
export default function Confirmation({
  isOpen,
  email,
  tourTitle,
  dateLabel,
  total,
  reference,
}: ConfirmationProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="rl-root rl-z-modal fixed inset-0 flex items-center justify-center bg-[rgba(4,14,18,0.86)] p-5 backdrop-blur-md"
    >
      <div className="rl-sheet-in w-full max-w-md rounded-[4px] border border-[var(--rl-line)] bg-[var(--rl-ink-2)] p-7">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-[color-mix(in_srgb,var(--rl-accent)_18%,transparent)] text-[var(--rl-accent-text)]">
          <Check
            style={{ width: CHECK_ICON, height: CHECK_ICON }}
            strokeWidth={2}
            aria-hidden="true"
          />
        </span>

        <h2 id="confirm-title" className="rl-display mt-5 text-2xl">
          Details look right
        </h2>

        <p className="mt-2.5 text-sm leading-relaxed text-[var(--rl-mute)]">
          No card was charged, because no payment provider is connected to this
          site yet. Connect one and this step becomes the real thing.
        </p>

        <dl className="mt-6 flex flex-col gap-3 border-y border-[var(--rl-line)] py-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--rl-mute)]">Excursion</dt>
            <dd className="text-right font-semibold">{tourTitle}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--rl-mute)]">Date</dt>
            <dd className="text-right font-semibold">{dateLabel}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--rl-mute)]">Total</dt>
            <dd className="text-right font-semibold tabular-nums">${total}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--rl-mute)]">Reference</dt>
            <dd className="text-right font-semibold tabular-nums">{reference}</dd>
          </div>
        </dl>

        {email ? (
          <p className="mt-5 flex items-start gap-2 text-sm text-[var(--rl-mute)]">
            <Mail
              style={{ width: MAIL_ICON, height: MAIL_ICON, flexShrink: 0, marginTop: 2 }}
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span>
              A confirmation would reach{" "}
              <span className="text-[var(--rl-text)]">{email}</span>.
            </span>
          </p>
        ) : null}

        <JigglyButton href="/" size="block" className="mt-7 w-full">
          Back to the tours
        </JigglyButton>
      </div>
    </div>
  );
}
