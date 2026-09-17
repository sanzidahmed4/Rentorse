"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { IApartment } from "@/types";
import { PiggyBank, MapPin, Mail, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

interface Props {
  apartments: IApartment[];
}

export default function RecommendationsNewsletter({ apartments }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeOnTop, setActiveOnTop] = useState<"budget" | "location" | null>(null);

  // Take up to 3 apartments
  const displayApartments = apartments.slice(0, 3);
  const currentApt = displayApartments[activeIndex] || displayApartments[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setMessage(data.message || "You're subscribed to Rentorce apartment alerts!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (_) {
      setStatus("error");
      setMessage("Network error. Please try again later.");
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, description, and newsletter subscription form */}
          <div className="lg:col-span-6 space-y-5 max-w-xl">
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-slate-900 tracking-tight whitespace-normal sm:whitespace-nowrap">
              Get apartment recommendations
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Be the first to know when new apartments match your preferences. Get newly listed rentals delivered directly to your inbox.
            </p>

            {/* Newsletter Input Form */}
            <form onSubmit={handleSubmit} className="pt-2 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status !== "idle") setStatus("idle");
                    }}
                    placeholder="Enter your email address"
                    disabled={status === "loading"}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-6 py-3.5 rounded-2xl border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-sm sm:text-base transition shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <span>Notify me</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Status Message */}
              {status === "success" && (
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{message}</span>
                </div>
              )}
              {status === "error" && (
                <p className="text-red-600 text-xs sm:text-sm font-medium pl-1">
                  {message}
                </p>
              )}

              <p className="text-xs text-slate-400 pl-1">
                No spam. You can unsubscribe anytime with one click.
              </p>
            </form>
          </div>

          {/* Right Column: Visual Folder / Stacked Cards with floating badges */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px] sm:max-w-[440px] pt-14 pb-8 pr-6 pl-4">
              
              {/* Floating Badge 1: Budget (Green / PiggyBank) */}
              <div 
                onMouseEnter={() => setActiveOnTop("budget")}
                onMouseLeave={() => setActiveOnTop(null)}
                onClick={() => setActiveOnTop((prev) => (prev === "budget" ? null : "budget"))}
                className={`absolute top-0 sm:-top-1 left-2 sm:left-3 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-full px-4 py-2 sm:py-2.5 border border-slate-200/80 flex items-center gap-3 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white hover:z-40 ${
                  activeOnTop === "budget"
                    ? "z-40 shadow-2xl scale-105 bg-white ring-1 ring-emerald-500/20"
                    : activeOnTop === "location"
                    ? "z-10 shadow-sm opacity-90 scale-[0.98]"
                    : "z-20 shadow-md scale-100"
                }`}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <PiggyBank className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                    Recommended apartments
                  </div>
                  <div className="text-[11px] text-slate-500 leading-tight">
                    based on your monthly budget
                  </div>
                </div>
              </div>

              {/* Floating Badge 2: Location (Orange / MapPin) */}
              <div 
                onMouseEnter={() => setActiveOnTop("location")}
                onMouseLeave={() => setActiveOnTop(null)}
                onClick={() => setActiveOnTop((prev) => (prev === "location" ? null : "location"))}
                className={`absolute top-7 sm:top-8 -left-2 sm:-left-4 bg-white backdrop-blur-md rounded-2xl sm:rounded-full px-4 py-2.5 border border-slate-100 flex items-center gap-3 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:z-40 ${
                  activeOnTop === "location"
                    ? "z-40 shadow-2xl scale-105 bg-white ring-1 ring-orange-500/20"
                    : activeOnTop === "budget"
                    ? "z-20 shadow-md scale-[0.98]"
                    : "z-30 shadow-xl scale-100"
                }`}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                    Recommended apartments
                  </div>
                  <div className="text-[11px] text-slate-500 leading-tight">
                    based on your preferred location
                  </div>
                </div>
              </div>

              {/* Stacked Cards Container ("Folder" Effect) */}
              <div className="relative w-full aspect-[4/3] sm:h-[360px]">
                
                {/* Back Card (Card 3) */}
                <div className="absolute inset-0 translate-x-6 translate-y-6 rounded-3xl bg-white border border-slate-200/60 shadow-md opacity-60 pointer-events-none" />

                {/* Middle Card (Card 2) */}
                <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-white border border-slate-200/70 shadow-lg opacity-80 pointer-events-none" />

                {/* Front Card (Card 1 — Active Real Apartment) */}
                {currentApt && (
                  <Link
                    href={`/apartments/${currentApt.slug || currentApt._id || currentApt.id}?from=recommendations`}
                    className="group absolute inset-0 rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col transition hover:-translate-y-1 duration-300"
                  >
                    {/* Apartment Image */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={
                          currentApt.images?.[0] ||
                          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={currentApt.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 440px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Small Carousel Dots (matching the screenshot reference) */}
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-950/40 backdrop-blur-xs">
                        {displayApartments.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveIndex(idx);
                            }}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              idx === activeIndex
                                ? "w-4 bg-white"
                                : "bg-white/60 hover:bg-white"
                            }`}
                            title={`View Apartment ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                      <div>
                        {/* Price */}
                        <div className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight">
                          ${currentApt.baseRent ? currentApt.baseRent.toLocaleString() : "1,250"}
                          <span className="text-xs font-semibold text-slate-500"> / mo</span>
                        </div>

                        {/* Specs Row */}
                        <div className="text-xs sm:text-sm text-slate-700 font-semibold mt-1 flex items-center gap-1.5 flex-wrap">
                          <span>{currentApt.bedrooms || 2} bd</span>
                          <span className="text-slate-300">|</span>
                          <span>{currentApt.bathrooms || 1} ba</span>
                          <span className="text-slate-300">|</span>
                          <span>{currentApt.squareFeet || 850} sqft</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-blue-600 font-bold">Apartment for Rent</span>
                        </div>

                        {/* Skeletal placeholder lines (as seen in the reference screenshot) */}
                        <div className="mt-3 space-y-1.5">
                          <div className="h-2 bg-slate-100 rounded-full w-4/5" />
                          <div className="h-2 bg-slate-100 rounded-full w-3/5" />
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs text-blue-600 font-bold">
                        <span>Click to view details</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
