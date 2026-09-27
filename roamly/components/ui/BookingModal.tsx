"use client";

import { useState, useEffect } from "react";

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
  const [selectedTour, setSelectedTour] = useState<number>(
    preSelectedOptionId || 1
  );
  const [guests, setGuests] = useState<number>(1);
  const [date, setDate] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Sync selected tour when preSelectedOptionId prop changes
  useEffect(() => {
    if (preSelectedOptionId) {
      setSelectedTour(preSelectedOptionId);
    }
  }, [preSelectedOptionId]);

  // Lock background scroll when open on mobile
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

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  const currentTourObj = tourOptions.find((t) => t.id === selectedTour) || tourOptions[0];
  const totalPrice = currentTourObj.price * guests;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-opacity">
      {/* Backdrop click handler */}
      <div className="absolute inset-0" onClick={handleResetAndClose} />

      {/* Modal Container */}
      <div className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] z-10 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/80">
          <h3 className="text-lg font-bold text-slate-900">Book Your Excursion</h3>
          <button
            onClick={handleResetAndClose}
            aria-label="Close modal"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200/60 text-slate-600 transition-colors hover:bg-slate-200 active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="text-5xl">🏝️</div>
              <h4 className="text-2xl font-extrabold text-slate-900">You're All Set!</h4>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                We’ve received your booking request for <strong>{currentTourObj.name}</strong>. Check your email for confirmation details.
              </p>
              <button
                onClick={handleResetAndClose}
                className="mt-4 w-full rounded-full bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 active:scale-95"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-5">
              {/* Select Tour */}
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
                      <span className="text-xs font-bold text-blue-600">${tour.price} / person</span>
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
                  <span className="text-base font-bold text-slate-900">{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                  <button
                    type="button"
                    onClick={() => setGuests((g) => g + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm font-bold text-slate-700 active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Summary */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Price</span>
                <span className="text-xl font-extrabold text-slate-900">${totalPrice}</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-full bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 active:scale-95"
              >
                Confirm Reservation
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}