"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  X,
  Loader2,
  Send,
  ShieldCheck,
} from "lucide-react";
import { IApartment } from "@/types";

interface ApartmentBookingModalProps {
  apartment: IApartment;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApartmentBookingModal({
  apartment,
  isOpen,
  onClose,
}: ApartmentBookingModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tourType, setTourType] = useState<"In-Person" | "Virtual Video">("In-Person");
  const [tourDate, setTourDate] = useState("");
  const [tourTime, setTourTime] = useState("11:00 AM");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  React.useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      const stored = sessionStorage.getItem("apartmento_last_search");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.fullName && !fullName) setFullName(parsed.fullName);
          if (parsed.phone && !phone) setPhone(parsed.phone);
          if (parsed.email && !email) setEmail(parsed.email);
        } catch (e) {
          console.error("Error reading stored renter profile:", e);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email) {
      setErrorMsg("Please fill in your name, phone, and email.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          desiredLocation: apartment.addressTemplate || "United States",
          bedrooms: apartment.bedrooms,
          bathrooms: apartment.bathrooms,
          budgetMin: apartment.baseRent,
          budgetMax: apartment.baseRent,
          selectedApartmentId: apartment._id || apartment.id,
          selectedApartmentTitle: apartment.title,
          selectedApartmentPrice: apartment.baseRent,
          matchedApartments: [apartment._id || apartment.id],
          status: "Qualified",
          notes: `Direct Booking / Tour Request for ${apartment.title} (${tourType} on ${
            tourDate || "Soonest available"
          } at ${tourTime})${notes ? ` — Note: ${notes}` : ""}`,
          isUsResident: true,
          age: 25,
          familyMembers: 1,
          hasPets: false,
          kitchenRequired: apartment.hasKitchen,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof window !== "undefined" && data.lead?._id) {
          sessionStorage.setItem("apartmento_lead_id", data.lead._id);
        }
        setSuccess(true);
      } else {
        setErrorMsg(data.error || "Failed to book tour. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setErrorMsg("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setSuccess(false);
    setErrorMsg("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 relative">
          <span className="text-[10px] uppercase tracking-widest text-blue-300 font-bold px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30">
            Official Tour Booking
          </span>
          <h3 className="text-xl font-bold mt-2 text-white">{apartment.title}</h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">{apartment.addressTemplate || "United States"}</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2.5 py-1 bg-white/10 rounded-lg text-xs font-bold text-white">
              ${apartment.baseRent}/month
            </span>
            <span className="text-xs text-slate-300">
              {apartment.bedrooms} Bed • {apartment.bathrooms} Bath
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900">
                Appointment Request Confirmed!
              </h4>
              <div className="text-slate-600 text-sm leading-relaxed space-y-3 max-w-sm mx-auto text-center">
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

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 text-left space-y-1 max-w-sm mx-auto">
                <div className="font-bold text-slate-800 text-sm mb-1">Appointment Details:</div>
                <div><strong>Apartment:</strong> {apartment.title}</div>
                <div><strong>Format:</strong> {tourType}</div>
                <div><strong>Date & Time:</strong> {tourDate || "Soonest Available"} at {tourTime}</div>
                <div><strong>Renter Name:</strong> {fullName}</div>
              </div>

              <Link
                href="/"
                onClick={handleModalClose}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition text-center block cursor-pointer"
              >
                Return to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Renter Contact Info */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Your Contact Information
                </label>

                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-blue-600 outline-none text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-blue-600 outline-none text-slate-900"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-blue-600 outline-none text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Tour Format */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Tour Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTourType("In-Person")}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      tourType === "In-Person"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🚶 In-Person Walkthrough
                  </button>
                  <button
                    type="button"
                    onClick={() => setTourType("Virtual Video")}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      tourType === "Virtual Video"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    📱 Live Video Tour
                  </button>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={tourDate}
                    onChange={(e) => setTourDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Preferred Time
                  </label>
                  <select
                    value={tourTime}
                    onChange={(e) => setTourTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-blue-500"
                  >
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>1:00 PM</option>
                    <option>3:00 PM</option>
                    <option>5:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Move-In Date or Special Request (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Planning to move next month, have a cat..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Free. No application fee to schedule a tour.</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Booking Tour...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirm Tour Request</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
