"use client";

import { useState } from "react";
import BookingModal from "@/components/ui/BookingModal";

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "What is included in each Roamly tour package?",
    answer:
      "All Roamly excursions include certified local guides, safety gear, entry/park fees, and complimentary bottled water and snacks. Specific inclusions like lunch or hotel pickup are detailed on each tour card.",
  },
  {
    id: 2,
    question: "What is your cancellation and refund policy?",
    answer:
      "You can cancel up to 24 hours before your scheduled tour time for a full 100% refund. Cancellations made within 24 hours or weather-related reschedules can be adjusted free of charge.",
  },
  {
    id: 3,
    question: "How difficult are the hiking and adventure activities?",
    answer:
      "We offer tours for all fitness levels—from leisurely island sightseeing and reef snorkeling to moderate and challenging summit climbs. Each tour description lists physical fitness requirements.",
  },
  {
    id: 4,
    question: "Do you accommodate dietary restrictions or special requests?",
    answer:
      "Yes! When placing your booking, simply let us know about any dietary preferences, physical restrictions, or special occasions in the booking notes, and our guides will accommodate you.",
  },
  {
    id: 5,
    question: "What should I bring with me on the excursion?",
    answer:
      "We recommend comfortable footwear, sunscreen, a hat, a swimsuit, and a camera. Once your booking is confirmed, you will receive a complete packing checklist customized for your tour.",
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(1);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const toggleFAQ = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <section id="contact" className="w-full bg-[#f8f8f8] py-24 px-6 sm:px-12 md:px-20">
        <div className="mx-auto max-w-7xl grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Heading & CTA */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
                GOT QUESTIONS?
              </p>
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl leading-[1.1]">
                Frequently asked questions.
              </h2>
            </div>

            <div className="mt-12 lg:mt-0">
              <p className="max-w-sm text-sm font-medium leading-relaxed text-slate-600">
                Our friendly team is always here to help you plan your next adventure with quick, clear, and reliable answers.
              </p>
              <button
                onClick={() => setIsBookingOpen(true)}
                className="mt-6 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)] transition-all hover:bg-blue-500 active:scale-95"
              >
                Book an Excursion
              </button>
            </div>
          </div>

          {/* Right Column: Accordion Items */}
          <div className="flex flex-col gap-4 lg:col-span-7">
            {faqData.map((item) => {
              const isOpen = openId === item.id;

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 border border-slate-100"
                >
                  <button
                    onClick={() => toggleFAQ(item.id)}
                    className="flex w-full items-center justify-between gap-4 text-left focus:outline-none"
                  >
                    <span className="text-base font-semibold text-slate-900 sm:text-lg">
                      {item.question}
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition-colors hover:bg-slate-50">
                      {isOpen ? (
                        <MinusIcon className="h-4 w-4 text-blue-600" />
                      ) : (
                        <PlusIcon className="h-4 w-4" />
                      )}
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100 mt-4"
                        : "grid-rows-[0fr] opacity-0 mt-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preSelectedOptionId={null}
      />
    </>
  );
}