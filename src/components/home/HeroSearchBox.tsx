"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Loader2, Building2 } from "lucide-react";

interface LocationSuggestion {
  name: string;
  zipOrCity: string;
  availableCount: number;
  tag: string;
}

const POPULAR_MARKETS: LocationSuggestion[] = [
  { name: "Chicago, IL", zipOrCity: "60007 & Metro Area", availableCount: 28, tag: "High Demand" },
  { name: "New York, NY", zipOrCity: "11004 & NYC Metro", availableCount: 38, tag: "Top Rated" },
  { name: "Austin, TX", zipOrCity: "78701 & Downtown", availableCount: 22, tag: "Fast Moving" },
  { name: "Los Angeles, CA", zipOrCity: "90012 & Metro", availableCount: 31, tag: "Popular" },
  { name: "Miami, FL", zipOrCity: "33130 & Brickell", availableCount: 24, tag: "Trending" },
  { name: "Dallas, TX", zipOrCity: "75201 & Uptown", availableCount: 26, tag: "Active Inventory" },
];

export default function HeroSearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchedCount, setMatchedCount] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered suggestions based on query
  const filteredMarkets = query.trim()
    ? POPULAR_MARKETS.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.zipOrCity.toLowerCase().includes(query.toLowerCase())
      )
    : POPULAR_MARKETS;

  // Calculate dynamic count for custom queries
  const getCustomCount = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    return 18 + (Math.abs(hash) % 25); // returns between 18 and 42
  };

  const handleSelectLocation = (locationName: string, count: number) => {
    setQuery(locationName);
    setMatchedCount(count);
    setIsSubmitting(true);
    setIsOpen(false);

    setTimeout(() => {
      router.push(
        `/find-apartment?location=${encodeURIComponent(locationName)}&count=${count}`
      );
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveLoc = query.trim() || "Chicago, IL 60007";
    const foundCount =
      POPULAR_MARKETS.find((m) => m.name.toLowerCase() === effectiveLoc.toLowerCase())
        ?.availableCount || getCustomCount(effectiveLoc);

    handleSelectLocation(effectiveLoc, foundCount);
  };

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto relative mb-6 sm:mb-8">
      {/* Main Zillow-Style Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center bg-white rounded-2xl sm:rounded-full shadow-2xl shadow-slate-950/40 border-2 border-white/90 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 transition-all overflow-hidden"
      >
        <div className="flex-1 flex items-center pl-4 sm:pl-6">
          <input
            type="text"
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            placeholder="Enter an address, neighborhood, city, or ZIP code"
            className="w-full py-4 sm:py-4.5 text-slate-900 text-sm sm:text-base font-medium placeholder-slate-400 bg-transparent outline-none"
            disabled={isSubmitting}
          />
        </div>

        {/* Right Search Button (Zillow-Style Magnifying Glass) */}
        <button
          type="submit"
          disabled={isSubmitting}
          aria-label="Search available apartments"
          className="m-1.5 sm:m-2 p-3 sm:p-3.5 rounded-xl sm:rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white transition-all flex items-center justify-center cursor-pointer shadow-md shadow-blue-600/30 flex-shrink-0"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5 stroke-[2.5]" />
          )}
        </button>
      </form>

      {/* Submitting Feedback Toast */}
      {isSubmitting && matchedCount && (
        <div className="absolute -bottom-11 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg border border-slate-700 flex items-center gap-2 whitespace-nowrap animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>
            Found <strong>{matchedCount} Apartments</strong> in {query}! Opening Matcher...
          </span>
        </div>
      )}

      {/* Interactive Live Inventory Dropdown */}
      {isOpen && !isSubmitting && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Live Available Rental Inventory</span>
            <span className="text-blue-600 font-bold lowercase">instant match</span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {/* Custom typed query option if typed something not in list */}
            {query.trim().length > 0 && (
              <button
                type="button"
                onClick={() => handleSelectLocation(query.trim(), getCustomCount(query.trim()))}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-blue-50/60 transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                      Search for &quot;{query.trim()}&quot;
                    </div>
                    <div className="text-xs text-slate-500">
                      Calibrate verified units in this target area
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {getCustomCount(query.trim())}+ Available
                  </span>
                </div>
              </button>
            )}

            {/* Predefined Popular Locations */}
            {filteredMarkets.map((market) => (
              <button
                key={market.name}
                type="button"
                onClick={() => handleSelectLocation(market.name, market.availableCount)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-2">
                      <span>{market.name}</span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {market.tag}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">{market.zipOrCity}</div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="inline-flex items-center gap-1 text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition">
                    <Building2 className="w-3 h-3" />
                    {market.availableCount} Available
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
