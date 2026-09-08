"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  Home,
  Bath,
  BedDouble,
  Maximize2,
  X,
  Clock,
  ShieldCheck,
  Send,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";
import { MatchedApartmentResult } from "@/lib/matching-engine";
import { FunnelFormData } from "@/types";

export default function ResultsPage() {
  const [matches, setMatches] = useState<MatchedApartmentResult[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<FunnelFormData | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Tour Booking Modal State
  const [selectedApt, setSelectedApt] = useState<MatchedApartmentResult | null>(null);
  const [renterName, setRenterName] = useState("");
  const [renterPhone, setRenterPhone] = useState("");
  const [renterEmail, setRenterEmail] = useState("");
  const [tourDate, setTourDate] = useState("");
  const [tourTime, setTourTime] = useState("11:00 AM");
  const [tourType, setTourType] = useState<"In-Person" | "Virtual Video">("In-Person");
  const [tourSubmitted, setTourSubmitted] = useState(false);
  const [updatingLead, setUpdatingLead] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMatches = sessionStorage.getItem("apartmento_last_matches");
      const storedSearch = sessionStorage.getItem("apartmento_last_search");
      const storedLeadId = sessionStorage.getItem("apartmento_lead_id");

      if (storedMatches) {
        try {
          const parsed = JSON.parse(storedMatches);
          setMatches(parsed);
        } catch (e) {
          console.error(e);
        }
      }

      if (storedSearch) {
        try {
          const parsed = JSON.parse(storedSearch);
          setSearchCriteria(parsed);
          if (parsed.fullName) setRenterName(parsed.fullName);
          if (parsed.phone) setRenterPhone(parsed.phone);
          if (parsed.email) setRenterEmail(parsed.email);
        } catch (e) {
          console.error(e);
        }
      }

      if (storedLeadId) {
        setLeadId(storedLeadId);
      }

      setLoading(false);
    }
  }, []);

  const handleBookTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApt) return;
    setUpdatingLead(true);

    const effectiveName = renterName.trim() || searchCriteria?.fullName || "Prospective Renter";
    const effectivePhone = renterPhone.trim() || searchCriteria?.phone || "";
    const effectiveEmail = renterEmail.trim() || searchCriteria?.email || "";
    const tourNote = `Requested ${tourType} tour for ${selectedApt.title} (${selectedApt.displayLocation}) on ${
      tourDate || "Soonest available"
    } at ${tourTime}`;

    try {
      if (leadId) {
        // Update existing lead with tour request
        await fetch(`/api/leads/${leadId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: effectiveName,
            phone: effectivePhone,
            email: effectiveEmail,
            desiredLocation: selectedApt.displayLocation || searchCriteria?.desiredLocation || "United States",
            selectedApartmentId: selectedApt._id || selectedApt.id,
            selectedApartmentTitle: selectedApt.title,
            selectedApartmentPrice: selectedApt.displayRent || selectedApt.baseRent,
            status: "Qualified",
            notes: tourNote,
          }),
        });
      } else {
        // No prior lead found, create new Qualified booking lead
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: effectiveName,
            phone: effectivePhone,
            email: effectiveEmail,
            desiredLocation: selectedApt.displayLocation || "United States",
            bedrooms: selectedApt.bedrooms,
            bathrooms: selectedApt.bathrooms,
            budgetMin: selectedApt.displayRent || selectedApt.baseRent,
            budgetMax: selectedApt.displayRent || selectedApt.baseRent,
            selectedApartmentId: selectedApt._id || selectedApt.id,
            selectedApartmentTitle: selectedApt.title,
            selectedApartmentPrice: selectedApt.displayRent || selectedApt.baseRent,
            matchedApartments: [selectedApt._id || selectedApt.id],
            status: "Qualified",
            notes: tourNote,
            isUsResident: true,
            age: 25,
            familyMembers: 1,
            hasPets: false,
            kitchenRequired: selectedApt.hasKitchen,
          }),
        });

        const data = await res.json();
        if (data.success && data.lead?._id) {
          setLeadId(data.lead._id);
          sessionStorage.setItem("apartmento_lead_id", data.lead._id);
        }
      }
      setTourSubmitted(true);
    } catch (err) {
      console.error("Error updating lead with tour interest:", err);
      setTourSubmitted(true);
    } finally {
      setUpdatingLead(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-600 font-semibold text-sm">Loading your matched apartments...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="min-h-[70vh] max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Home className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          No Recent Search Found
        </h2>
        <p className="text-slate-600 text-sm">
          Please run the Apartment Finder to match available rentals tailored to your location and price.
        </p>
        <Link
          href="/find-apartment"
          className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md"
        >
          Start Apartment Finder
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Results Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Available Properties
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Found {matches.length} Apartments in{" "}
                <span className="text-blue-600">
                  {searchCriteria?.desiredLocation || "Your Target Area"}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Showing available units matching your preferences and budget.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/find-apartment"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition"
              >
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                Modify Search
              </Link>
            </div>
          </div>

          {/* Quick Filters Chips */}
          {searchCriteria && (
            <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-slate-100 text-xs">
              <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                🛏️ {searchCriteria.bedrooms} Bedroom{searchCriteria.bedrooms > 1 ? "s" : ""}
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                🚿 {searchCriteria.bathrooms} Bath{searchCriteria.bathrooms > 1 ? "s" : ""}
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                💵 ${searchCriteria.budgetMin} – ${searchCriteria.budgetMax}/mo
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                🐾 {searchCriteria.hasPets ? "Pet Friendly" : "No Pets"}
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                📍 {searchCriteria.desiredLocation}
              </span>
              {searchCriteria.creditScore && (
                <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium border border-blue-200">
                  💳 Credit: {searchCriteria.creditScore}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Apartment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((apt, index) => (
            <div
              key={apt.id || apt._id || index}
              className={`bg-white rounded-3xl overflow-hidden border ${
                apt.isManual
                  ? "border-blue-500/60 ring-2 ring-blue-500/15 shadow-lg"
                  : "border-slate-200/80 shadow-sm"
              } hover:shadow-xl transition-all duration-300 flex flex-col group [transform:translateZ(0)]`}
            >
              {/* Image Preview */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <Image
                  src={apt.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"}
                  alt={apt.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
                />

                {/* Rent Badge */}
                <div className="absolute bottom-3 right-3 bg-blue-600 text-white px-3.5 py-1.5 rounded-xl font-black text-base shadow-lg">
                  ${apt.displayRent || apt.baseRent}
                  <span className="text-[11px] font-normal text-blue-100"> / mo</span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{apt.displayLocation}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {apt.title}
                  </h3>

                  <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {apt.description}
                  </p>

                  {/* Specs row */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 mt-3 text-xs text-slate-600 text-center font-medium">
                    <div className="flex items-center justify-center gap-1">
                      <BedDouble className="w-3.5 h-3.5 text-blue-600" />
                      <span>{apt.bedrooms} Bed</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Bath className="w-3.5 h-3.5 text-blue-600" />
                      <span>{apt.bathrooms} Bath</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>{apt.squareFeet} sq ft</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedApt(apt);
                      setTourSubmitted(false);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-200" />
                    Schedule Tour / Inquire
                  </button>

                  <Link
                    href={`/apartments/${apt.slug || apt.id || apt._id}${
                      apt.displayLocation ? `?loc=${encodeURIComponent(apt.displayLocation)}` : ""
                    }`}
                    className="py-3 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                    title="View Apartment Specs"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TOUR BOOKING / HIGH INTENT MODAL */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedApt(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 transition z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {tourSubmitted ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Appointment Request Confirmed!
                </h3>
                <div className="text-slate-600 text-sm leading-relaxed space-y-3 max-w-md mx-auto">
                  <p>
                    Your appointment request has been successfully submitted. One of our leasing agents will email you within the next 15–20 minutes with the apartment details and appointment information.
                  </p>
                  <p className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-amber-900 text-xs font-medium text-left">
                    Please reply to the email within 24 hours to confirm your appointment. If we do not receive your confirmation within 24 hours, your appointment will be cancelled.
                  </p>
                  <p className="font-semibold text-slate-800">
                    We look forward to helping you find your next home!
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500 text-left space-y-1 max-w-md mx-auto">
                  <span className="font-semibold block text-slate-700">Appointment Summary</span>
                  <div><strong className="text-slate-700">Apartment:</strong> {selectedApt.title}</div>
                  <div><strong className="text-slate-700">Schedule:</strong> {tourType} • {tourDate || "Next Available"} at {tourTime}</div>
                </div>
                <Link
                  href="/"
                  onClick={() => setSelectedApt(null)}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition text-center block cursor-pointer"
                >
                  Return to Home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleBookTour}>
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6">
                  <span className="text-xs uppercase tracking-widest text-blue-300 font-semibold">
                    Direct Property Booking
                  </span>
                  <h3 className="text-xl font-bold mt-1">{selectedApt.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{selectedApt.displayLocation}</span>
                  </div>
                  <div className="mt-3 inline-block px-3 py-1 bg-white/10 rounded-lg text-xs font-bold text-white">
                    Rent: ${selectedApt.displayRent}/month
                  </div>
                </div>

                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* Contact Details */}
                  <div className="space-y-3 pb-3 border-b border-slate-100">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Renter Information
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={renterName}
                      onChange={(e) => setRenterName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-600 outline-none text-slate-900"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number"
                        value={renterPhone}
                        onChange={(e) => setRenterPhone(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-600 outline-none text-slate-900"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={renterEmail}
                        onChange={(e) => setRenterEmail(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-600 outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Tour Format
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setTourType("In-Person")}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition ${
                          tourType === "In-Person"
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-slate-200 text-slate-600"
                        }`}
                      >
                        🚶 In-Person Walkthrough
                      </button>
                      <button
                        type="button"
                        onClick={() => setTourType("Virtual Video")}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition ${
                          tourType === "Virtual Video"
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-slate-200 text-slate-600"
                        }`}
                      >
                        📱 Live Video Tour
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={tourDate}
                        onChange={(e) => setTourDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Preferred Time
                      </label>
                      <select
                        value={tourTime}
                        onChange={(e) => setTourTime(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-800"
                      >
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                        <option>1:00 PM</option>
                        <option>3:00 PM</option>
                        <option>5:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>No application fee required to schedule an official tour.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={updatingLead}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                  >
                    {updatingLead ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Confirm Tour Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
