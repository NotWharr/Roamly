"use client";

import { useState } from "react";
import Image from "next/image";
import BookingModal from "@/components/ui/BookingModal";

const tours = [
  {
    id: 1,
    title: "Summit Sunrise",
    duration: "3 DAYS / 2 NIGHTS",
    price: "$299 / person",
    description:
      "A golden-hour climb with panoramic island views and a local breakfast.",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Hidden Falls",
    duration: "FULL DAY",
    price: "$149 / person",
    description:
      "Swim, hike, and pause at a hidden cascade surrounded by lush jungle.",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Reef Explorer",
    duration: "HALF DAY",
    price: "$119 / person",
    description:
      "Float over living coral gardens with a certified guide by your side.",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Explore() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState<number | null>(null);

  const handleBookClick = (tourId: number) => {
    setSelectedTourId(tourId);
    setIsModalOpen(true);
  };

  return (
    <>
      <section id="explore" className="w-full bg-slate-50/50 py-24 px-6 md:px-16">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-14 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
              MAKE YOUR NEXT MEMORY
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Choose your perfect escape
            </h2>
            <p className="mt-3 text-base text-slate-500 sm:text-lg">
              Every experience is hosted by people who know these places best.
            </p>
          </div>

          {/* Tour Cards Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {tours.map((tour) => (
              <div
                key={tour.id}
                className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
              >
                {/* Card Image */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    {/* Duration & Price Row */}
                    <div className="flex items-center justify-between text-xs font-bold tracking-wide">
                      <span className="text-blue-600 uppercase">{tour.duration}</span>
                      <span className="text-slate-900">{tour.price}</span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-3 text-xl font-bold text-slate-900">
                      {tour.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {tour.description}
                    </p>
                  </div>

                  {/* Dynamic Book Button */}
                  <div className="mt-6">
                    <button
                      onClick={() => handleBookClick(tour.id)}
                      className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)] transition-all hover:bg-blue-500 hover:shadow-[0_12px_25px_rgba(37,99,235,0.45)] active:scale-95"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Calendar & Option Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preSelectedOptionId={selectedTourId}
      />
    </>
  );
}