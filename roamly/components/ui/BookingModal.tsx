"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedOptionId?: number | null;
}

const packageOptions = [
  {
    id: 1,
    title: "Summit Sunrise Tour",
    duration: "3 Days / 2 Nights",
    groupSize: "Up to 12 Explorers",
    difficulty: "Moderate Trek",
    includes: ["Expert Mountain Guide", "All Safety Equipment", "Trail Meals & Drinks", "Park Entry Permits", "Free Hotel Pick-up"],
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    title: "Hidden Falls Excursion",
    duration: "Full Day (8 Hours)",
    groupSize: "Up to 8 Explorers",
    difficulty: "Easy Walk",
    includes: ["Local Eco-Guide", "Waterfall Swim Stop", "Traditional Buffet Lunch", "Snacks & Refreshments", "Air-Conditioned Transport"],
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    title: "Reef Explorer Snorkel",
    duration: "Half Day (4 Hours)",
    groupSize: "Up to 15 Explorers",
    difficulty: "All Skill Levels",
    includes: ["Professional Divemaster", "Full Snorkel Gear Provided", "Boat Cruise", "Tropical Fruit & Drinks", "Marine Reserve Fee"],
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
  },
];

export default function BookingModal({
  isOpen,
  onClose,
  preSelectedOptionId,
}: BookingModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Default to first option (Summit Sunrise) if none passed
  const [selectedOption, setSelectedOption] = useState<number>(preSelectedOptionId || 1);

  // Tour booking details state
  const [startDate, setStartDate] = useState(26);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Popover Toggle States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  useEffect(() => {
    if (preSelectedOptionId) {
      setSelectedOption(preSelectedOptionId);
      setStep(2);
    }
  }, [preSelectedOptionId]);

  if (!isOpen) return null;

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => setStep((prev) => prev - 1);

  const handleProceedToPayment = () => {
    router.push(
      `/checkout?option=${selectedOption}&startDate=${startDate}&adults=${adults}&children=${children}`
    );
    onClose();
  };

  const activePackage = packageOptions.find((p) => p.id === selectedOption) || packageOptions[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl transition-all border border-slate-100 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Step {step} of 3
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              {step === 1 && "Tour Availability & Schedule"}
              {step === 2 && "Select Tour Package"}
              {step === 3 && "Confirm Tour Booking"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* STEP 1: TOUR CALENDAR & GUIDE SELECTOR */}
          {step === 1 && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7 rounded-xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <button className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    Today
                  </button>
                  <h3 className="text-lg font-bold text-slate-900">September 2026</h3>
                  <div className="flex gap-1 text-slate-500">
                    <button className="p-1 hover:text-slate-900">&lt;</button>
                    <button className="p-1 hover:text-slate-900">&gt;</button>
                  </div>
                </div>

                <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-400 mb-2">
                  <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>

                <div className="grid grid-cols-7 text-center text-xs gap-y-3 py-2 text-slate-700">
                  <span className="text-slate-300">30</span><span className="text-slate-300">31</span>
                  {[...Array(30)].map((_, i) => {
                    const day = i + 1;
                    const isSelected = day === startDate;
                    return (
                      <div
                        key={day}
                        onClick={() => setStartDate(day)}
                        className={`mx-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white font-bold shadow-md"
                            : "hover:bg-slate-100"
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between space-y-4 rounded-xl bg-slate-50 p-5 border border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  SCHEDULE YOUR TOUR
                </h3>

                <div className="space-y-3 text-left">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Preferred Tour Guide</label>
                    <select className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800 outline-none">
                      <option>John Willson (Certified Mountain Guide)</option>
                      <option>Sarah Jenkins (Eco-Tour Expert)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tour Reference Name</label>
                    <input
                      type="text"
                      defaultValue="Island Adventure Reservation"
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800 outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-blue-500"
                >
                  Continue to Tour Packages
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: TOUR PACKAGE SELECTION */}
          {step === 2 && (
            <div>
              {/* Filter Bar */}
              <div className="relative flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 p-3 mb-6 text-xs border border-slate-100">
                
                {/* DATE SELECTION BUTTON */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowDatePicker(!showDatePicker);
                      setShowGuestPicker(false);
                    }}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-800 shadow-sm hover:border-slate-300 active:scale-98"
                  >
                    <span>Tour Date:</span>
                    <span className="font-bold text-blue-600">
                      Sep {startDate}, 2026
                    </span>
                    <span className="text-slate-400">▼</span>
                  </button>

                  {/* CALENDAR POPOVER */}
                  {showDatePicker && (
                    <div className="absolute left-0 top-12 z-50 w-80 rounded-2xl bg-white p-5 text-slate-800 shadow-2xl border border-slate-200">
                      <div className="flex items-center justify-between mb-4">
                        <button className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-xs text-slate-600">
                          &lt;
                        </button>
                        <h4 className="font-bold uppercase tracking-wider text-xs text-slate-900">
                          SEPTEMBER 2026
                        </h4>
                        <button className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-xs text-slate-600">
                          &gt;
                        </button>
                      </div>

                      <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-2">
                        <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
                      </div>

                      <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
                        <span /><span />
                        {[...Array(30)].map((_, i) => {
                          const day = i + 1;
                          const isStart = day === startDate;

                          return (
                            <div key={day} className="relative py-0.5">
                              <button
                                onClick={() => setStartDate(day)}
                                className={`relative z-10 flex h-8 w-full items-center justify-center rounded-full text-xs font-semibold transition ${
                                  isStart
                                    ? "bg-blue-600 text-white font-bold shadow-md"
                                    : "text-slate-700 hover:bg-slate-100"
                                }`}
                              >
                                {day}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="mt-4 w-full rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                      >
                        Confirm Date
                      </button>
                    </div>
                  )}
                </div>

                {/* PARTICIPANTS SELECTION BUTTON */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowGuestPicker(!showGuestPicker);
                      setShowDatePicker(false);
                    }}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-800 shadow-sm hover:border-slate-300 active:scale-98"
                  >
                    <span>Participants:</span>
                    <span className="font-bold text-blue-600">
                      {adults} Adults, {children} Children
                    </span>
                    <span className="text-slate-400">▼</span>
                  </button>

                  {/* PARTICIPANT COUNTER POPOVER */}
                  {showGuestPicker && (
                    <div className="absolute left-0 top-12 z-50 w-64 rounded-xl bg-white p-4 text-slate-800 shadow-2xl border border-slate-200">
                      <div className="flex items-center justify-between py-2 border-b border-slate-100">
                        <div>
                          <p className="font-bold text-xs text-slate-900">Adults</p>
                          <p className="text-[10px] text-slate-400">Ages 13+</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            className="h-6 w-6 rounded-full bg-slate-100 font-bold hover:bg-slate-200 text-slate-700"
                          >
                            -
                          </button>
                          <span className="font-bold text-xs">{adults}</span>
                          <button
                            onClick={() => setAdults(adults + 1)}
                            className="h-6 w-6 rounded-full bg-slate-100 font-bold hover:bg-slate-200 text-slate-700"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2 mb-3">
                        <div>
                          <p className="font-bold text-xs text-slate-900">Children</p>
                          <p className="text-[10px] text-slate-400">Ages 0-12</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            className="h-6 w-6 rounded-full bg-slate-100 font-bold hover:bg-slate-200 text-slate-700"
                          >
                            -
                          </button>
                          <span className="font-bold text-xs">{children}</span>
                          <button
                            onClick={() => setChildren(children + 1)}
                            className="h-6 w-6 rounded-full bg-slate-100 font-bold hover:bg-slate-200 text-slate-700"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowGuestPicker(false)}
                        className="w-full rounded-lg bg-blue-600 py-1.5 text-xs font-bold text-white hover:bg-blue-500"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Tour Options Cards */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {packageOptions.map((pkg) => {
                  const isSelected = selectedOption === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedOption(pkg.id)}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                        isSelected
                          ? "border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/20"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="relative h-40 w-full overflow-hidden rounded-xl mb-3">
                        <Image
                          src={pkg.image}
                          alt={pkg.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-slate-900">{pkg.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{pkg.duration} • {pkg.groupSize}</p>

                      <ul className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-600">
                        {pkg.includes.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="text-blue-600 font-bold">✓</span> {item}
                          </li>
                        ))}
                      </ul>

                      <button
                        className={`mt-4 w-full rounded-full py-2 text-xs font-bold transition ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {isSelected ? "Selected" : "Select Tour"}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="mt-6 flex justify-between">
                <button
                  onClick={handlePrevStep}
                  className="rounded-full border border-slate-200 px-6 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  disabled={!selectedOption}
                  onClick={handleNextStep}
                  className="rounded-full bg-blue-600 px-8 py-2 text-xs font-bold text-white transition hover:bg-blue-500 disabled:opacity-50"
                >
                  Proceed to Confirmation
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TOUR CONFIRMATION */}
          {step === 3 && (
            <div className="max-w-xl mx-auto py-4 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-xl mb-4">
                ✓
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Confirm Your Tour Reservation
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Please review your excursion details before proceeding to payment.
              </p>

              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/50 p-6 text-left space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Selected Tour</span>
                  <span className="font-bold text-slate-900">{activePackage?.title}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-bold text-slate-900">{activePackage?.duration}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Departure Date</span>
                  <span className="font-bold text-slate-900">
                    Sep {startDate}, 2026
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Participants</span>
                  <span className="font-bold text-slate-900">{adults} Adults, {children} Children</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={handlePrevStep}
                  className="w-1/2 rounded-full border border-slate-200 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Edit Details
                </button>
                <button
                  onClick={handleProceedToPayment}
                  className="w-1/2 rounded-full bg-blue-600 py-3 text-xs font-bold text-white shadow-lg transition hover:bg-blue-500"
                >
                  Confirm & Pay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}