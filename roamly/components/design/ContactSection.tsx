"use client";

import React, { useState } from "react";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="w-full bg-slate-900 py-24 px-6 md:px-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
              GET IN TOUCH
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Let’s plan your next journey together.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Have questions about tour dates, custom private itineraries, or group bookings? Drop us a message or reach out directly.
            </p>

            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 font-bold">
                  📍
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Location</h4>
                  <p className="text-sm font-semibold text-slate-200">St. George's, Grenada</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 font-bold">
                  ✉️
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Us</h4>
                  <p className="text-sm font-semibold text-slate-200">hello@roamlytours.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-7 bg-white text-slate-900 p-8 sm:p-10 rounded-3xl shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="text-5xl">🎉</div>
                <h3 className="text-2xl font-bold text-slate-900">Message Received!</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  Thanks for reaching out. Our local team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-bold text-blue-600 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">First Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Jane"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Last Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Doe"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="jane@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your trip plans or any questions..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 active:scale-95"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}