"use client";

import Link from "next/link";

interface ConfirmationModalProps {
  isOpen: boolean;
  email: string;
  tourTitle: string;
  startDate: string;
  totalAmount: string;
}

export default function ConfirmationModal({
  isOpen,
  email,
  tourTitle,
  startDate,
  totalAmount,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl border border-slate-100">
        
        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 ring-8 ring-emerald-50">
          <svg className="h-8 w-8 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900">Payment Received!</h3>
        <p className="text-xs text-slate-500 mt-1">Your excursion reservation is officially confirmed.</p>

        {/* Email Invoice Alert */}
        <div className="mt-4 rounded-xl bg-blue-50/70 border border-blue-100 p-3 text-left">
          <div className="flex items-start gap-2.5">
            <span className="text-base">📧</span>
            <div className="text-xs">
              <p className="font-bold text-blue-950">Invoice & E-Tickets Sent</p>
              <p className="text-blue-700/80 mt-0.5">We have dispatched a detailed receipt and voucher to:</p>
              <p className="font-semibold text-blue-900 mt-1 truncate">{email || "your email address"}</p>
            </div>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="mt-4 border-t border-b border-slate-100 py-3 text-xs space-y-2 text-slate-600">
          <div className="flex justify-between">
            <span>Booking Reference:</span>
            <span className="font-bold text-slate-900 font-mono">#TRX-94820</span>
          </div>
          <div className="flex justify-between">
            <span>Tour Package:</span>
            <span className="font-semibold text-slate-800">{tourTitle}</span>
          </div>
          <div className="flex justify-between">
            <span>Departure Date:</span>
            <span className="font-semibold text-slate-800">Sep {startDate}, 2026</span>
          </div>
          <div className="flex justify-between">
            <span>Amount Paid:</span>
            <span className="font-bold text-emerald-600">${totalAmount}</span>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="block w-full rounded-xl bg-slate-900 py-3 text-center text-xs font-bold text-white shadow-md transition hover:bg-slate-800"
          >
            Return to IsleTours.com
          </Link>
        </div>

      </div>
    </div>
  );
}