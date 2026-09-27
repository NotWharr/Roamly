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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    setIsMenuOpen(false);

    if (name === "Booking") {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div
        className={`fixed left-1/2 z-50 -translate-x-1/2 w-[90%] max-w-2xl transition-all duration-500 ease-in-out ${
          isScrolled ? "bottom-6 top-auto" : "top-6 bottom-auto"
        }`}
      >
        {/* Main Navbar Bar */}
        <nav
          className={`flex items-center justify-between rounded-full px-5 sm:px-6 py-3.5 transition-all duration-300 border ${
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

          {/* Desktop Links (Visible on sm and up) */}
          <ul className="hidden sm:flex items-center gap-1 sm:gap-2">
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

          {/* Mobile Menu Toggle Button (Visible on mobile only) */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="flex sm:hidden items-center justify-center p-2 rounded-full transition-colors focus:outline-none"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Dropdown Panel (Appears above or below navbar depending on scroll position) */}
        {isMenuOpen && (
          <div
            className={`absolute left-0 right-0 sm:hidden rounded-2xl border p-3 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
              isScrolled
                ? "bottom-16 bg-white/95 border-slate-200 text-slate-900"
                : "top-16 bg-slate-900/90 border-white/20 text-white"
            }`}
          >
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.name;

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.name)}
                      className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? isScrolled
                            ? "bg-slate-100 font-semibold text-slate-900"
                            : "bg-white/20 font-semibold text-white"
                          : isScrolled
                          ? "text-slate-600 hover:bg-slate-50"
                          : "text-white/80 hover:bg-white/10"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preSelectedOptionId={null}
      />
    </>
  );
}