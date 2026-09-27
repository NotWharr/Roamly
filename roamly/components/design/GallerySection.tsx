"use client";

import Image from "next/image";

const galleryImages = [
  {
    id: 1,
    title: "Tropical Shoreline Aerial",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    height: "h-80",
  },
  {
    id: 2,
    title: "Rainforest River & Waterfall",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    height: "h-96",
  },
  {
    id: 3,
    title: "Coral Reef & Marine Life",
    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    height: "h-80",
  },
  {
    id: 4,
    title: "Crystal Blue Lagoon",
    url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80",
    height: "h-80",
  },
  {
    id: 5,
    title: "Overhead Island Coastline",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    height: "h-96",
  },
  {
    id: 6,
    title: "Sunlit Water Horizon",
    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    height: "h-80",
  },
  {
    id: 7,
    title: "Top-Down Forest Canopy",
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    height: "h-80",
  },
  {
    id: 8,
    title: "Turquoise Waves Over Coral",
    url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80",
    height: "h-96",
  },
  {
    id: 9,
    title: "Exotic Island Cove",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    height: "h-80",
  },
  {
    id: 10,
    title: "Deep Sea Reef Exploration",
    url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=800&q=80",
    height: "h-80",
  },
];

export default function GallerySection() {
  return (
    <section id="gallery" className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        
        {/* Title Matching Image Header */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-12">
          The moments you’ll remember
        </h2>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center">
          {galleryImages.map((img) => (
            <div
              key={img.id}
              className={`group relative w-full ${img.height} overflow-hidden rounded-3xl bg-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              <Image
                src={img.url}
                alt={img.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-xs font-semibold text-white tracking-wide">
                  {img.title}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}