"use client";

interface TourSummaryProps {
  tourTitle: string;
  duration: string;
  startDate: string;
  adults: number;
  childrenCount: number;
  basePrice: number;
  taxes: number;
  total: number;
}

export default function TourSummaryCard({
  tourTitle,
  duration,
  startDate,
  adults,
  childrenCount,
  basePrice,
  taxes,
  total,
}: TourSummaryProps) {
  return (
    <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 text-xs">
      <div className="border-b border-slate-100 pb-3">
        <span className="font-bold text-slate-900 block text-sm">{tourTitle}</span>
        <span className="text-slate-500">Guided Excursion Booking</span>
      </div>

      <div className="space-y-2 text-slate-600">
        <div className="flex justify-between">
          <span>Tour Date:</span>
          <span className="font-semibold text-slate-800">Sep {startDate}, 2026</span>
        </div>
        <div className="flex justify-between">
          <span>Departure Time:</span>
          <span className="font-semibold text-slate-800">08:00 AM</span>
        </div>
        <div className="flex justify-between">
          <span>Duration:</span>
          <span className="font-semibold text-slate-800">{duration}</span>
        </div>
        <div className="flex justify-between">
          <span>Participants:</span>
          <span className="font-semibold text-slate-800">{adults} Adults, {childrenCount} Children</span>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3 space-y-2 text-slate-600">
        <div className="flex justify-between">
          <span>Tour Tickets:</span>
          <span className="font-semibold text-slate-800">${basePrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Taxes & Fees:</span>
          <span className="font-semibold text-slate-800">${taxes.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3 flex justify-between text-sm font-bold text-slate-900">
        <span>Total:</span>
        <span className="text-blue-600">${total.toFixed(2)}</span>
      </div>

      <div className="flex justify-between bg-emerald-50 p-2.5 rounded text-emerald-800 font-bold border border-emerald-100">
        <span>Due Now:</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}