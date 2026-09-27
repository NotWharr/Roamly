"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedOptionId?: number | null;
}

const tourOptions = [
  { id: 1, name: "Summit Sunrise", price: 299 },
  { id: 2, name: "Hidden Falls", price: 149 },
  { id: 3, name: "Reef Explorer", price: 119 },
];

export default function BookingModal({
  isOpen,
  onClose,
  preSelectedOptionId,
}: BookingModalProps) {
  const router = useRouter();
  const [selectedTour, setSelectedTour] = useState<number>(
    preSelectedOptionId || 1
  );
  const [guests, setGuests] = useState<number>(1);
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    if (preSelectedOptionId) {
      setSelectedTour(preSelectedOptionId);
    }
  }, [preSelectedOptionId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    // Route to the modular checkout page passing booking query parameters
    router.push(
      `/checkout?tourId=${selectedTour}&guests=${guests}&date=${encodeURIComponent(
        date
      )}`
    );
  };

  const currentTourObj =
    tourOptions.find((t) => t.id === selectedTour) || tourOptions[0];
  const totalPrice = currentTourObj.price * guests;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-opacity">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/80">
          <h3 className="text-lg font-bold text-slate-900">Book Your Excursion</h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200/60 text-slate-600 transition-colors hover:bg-slate-200 active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          <form onSubmit={handleProceedToPayment} className="space-y-5">
            {/* Package Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Select Package
              </label>
              <div className="grid grid-cols-1 gap-2">
                {tourOptions.map((tour) => (
                  <button
                    key={tour.id}
                    type="button"
                    onClick={() => setSelectedTour(tour.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition ${
                      selectedTour === tour.id
                        ? "border-blue-600 bg-blue-50/50 text-blue-900 font-semibold shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-sm">{tour.name}</span>
                    <span className="text-xs font-bold text-blue-600">
                      ${tour.price} / person
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Excursion Date
              </label>
              <input
                required
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            {/* Guest Counter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Number of Guests
              </label>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2">
                <button
                  type="button"
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm font-bold text-slate-700 active:scale-95"
                >
                  -
                </button>
                <span className="text-base font-bold text-slate-900">
                  {guests} {guests === 1 ? "Guest" : "Guests"}
                </span>
                <button
                  type="button"
                  onClick={() => setGuests((g) => g + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm font-bold text-slate-700 active:scale-95"
                >
                  +
                </button>
              </div>
            </div>

            {/* Summary & Proceed Button */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Price
              </span>
              <span className="text-xl font-extrabold text-slate-900">
                ${totalPrice}
              </span>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 active:scale-95"
            >
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}