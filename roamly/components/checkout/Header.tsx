"use client";

import Link from "next/link";

export default function CheckoutHeader() {
  return (
    <header className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
      <Link
        href="/"
        className="text-2xl font-black uppercase tracking-wider text-blue-600 hover:opacity-90 transition"
      >
        Roam<span className="text-slate-800">ly</span>
      </Link>
      <Link
        href="/"
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <span>←</span> Back to Exploration
      </Link>
    </header>
  );
}