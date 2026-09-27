"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CheckoutHeader from "@/components/checkout/Header";
import TravelerInfoForm from "@/components/checkout/TravelerInfoForm";
import TourSummaryCard from "@/components/checkout/TourSummaryCard";
import ConfirmationModal from "@/components/checkout/ConfirmationModal";

const tourPackagesMap: Record<string, { title: string; price: number; duration: string }> = {
  "1": { title: "Summit Sunrise Tour", price: 148.0, duration: "3 Days / 2 Nights Trek" },
  "2": { title: "Hidden Falls Excursion", price: 95.0, duration: "Full Day (8 Hours)" },
  "3": { title: "Reef Explorer Snorkel", price: 65.0, duration: "Half Day (4 Hours)" },
};

function CheckoutContent() {
  const searchParams = useSearchParams();

  const optionId = searchParams.get("option") || "1";
  const startDate = searchParams.get("startDate") || "26";
  const adults = parseInt(searchParams.get("adults") || "2", 10);
  const children = parseInt(searchParams.get("children") || "0", 10);

  const activeTour = tourPackagesMap[optionId] || tourPackagesMap["1"];
  const basePrice = activeTour.price * adults + activeTour.price * 0.5 * children;
  const taxes = Number((basePrice * 0.2).toFixed(2));
  const total = basePrice + taxes;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate API Payment Processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccessModal(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="mx-auto max-w-6xl">
        <CheckoutHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Area */}
          <form onSubmit={handleSubmitPayment} className="lg:col-span-8 space-y-6">
            <TravelerInfoForm
              tourTitle={activeTour.title}
              adults={adults}
              childrenCount={children}
              fullName={fullName}
              setFullName={setFullName}
              email={email}
              setEmail={setEmail}
            />

            {/* Payment Section */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Payment Details</h2>
              <div className="space-y-3 text-xs">
                <input
                  type="text"
                  required
                  placeholder="Cardholder Name"
                  className="w-full rounded-md border border-slate-300 p-2.5 outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Card Number (•••• •••• •••• ••••)"
                  className="w-full rounded-md border border-slate-300 p-2.5 outline-none"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    className="rounded-md border border-slate-300 p-2.5 outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="CVC"
                    className="rounded-md border border-slate-300 p-2.5 outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full rounded-xl bg-blue-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-blue-500 transition disabled:opacity-50"
            >
              {isProcessing ? "Processing Payment..." : "Confirm Tour Booking"}
            </button>
          </form>

          {/* Right Sidebar */}
          <div className="lg:col-span-4">
            <TourSummaryCard
              tourTitle={activeTour.title}
              duration={activeTour.duration}
              startDate={startDate}
              adults={adults}
              childrenCount={children}
              basePrice={basePrice}
              taxes={taxes}
              total={total}
            />
          </div>
        </div>
      </div>

      {/* Floating Modal */}
      <ConfirmationModal
        isOpen={showSuccessModal}
        email={email}
        tourTitle={activeTour.title}
        startDate={startDate}
        totalAmount={total.toFixed(2)}
      />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}