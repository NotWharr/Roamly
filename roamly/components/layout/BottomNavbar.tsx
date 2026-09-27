"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BookingModal from "@/components/ui/BookingModal";

const navItems = [
  { name: "Explore", href: "#explore" },
  { name: "Gallery", href: "#gallery" },
  { name: "Contact", href: "#contact" },
  { name: "Booking", href: "#booking" },
];

export default function BottomNavbar() {
  const [activeTab, setActiveTab] = useState("Explore");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, name: string) => {
    setActiveTab(name);

    if (name === "Booking") {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div
        className={`fixed left-1/2 z-50 -translate-x-1/2 w-full max-w-2xl px-4 transition-all duration-500 ease-in-out ${
          isScrolled ? "bottom-6 top-auto" : "top-6 bottom-auto"
        }`}
      >
        <nav
          className={`flex items-center justify-between rounded-full px-6 py-3.5 transition-all duration-300 border ${
            isScrolled
              ? "bg-white/90 text-slate-900 border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-md"
              : "bg-black/30 text-white border-white/20 shadow-lg backdrop-blur-md"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-bold tracking-tight transition-opacity hover:opacity-80"
          >
            Roam<span className={isScrolled ? "text-blue-600" : "text-blue-400"}>ly</span>
          </Link>

          {/* Links */}
          <ul className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.name;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.name)}
                    className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? isScrolled
                          ? "text-slate-900 font-semibold"
                          : "text-white font-semibold"
                        : isScrolled
                        ? "text-slate-500 hover:text-slate-800"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Booking Modal (Identical setup as Explore) */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preSelectedOptionId={null}
      />
    </>
  );
}