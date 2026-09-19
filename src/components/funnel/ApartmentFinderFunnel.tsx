"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  MapPin,
  Home,
  Users,
  PawPrint,
  Calendar,
  ShieldAlert,
  Loader2,
  Building,
  CreditCard,
  ChevronDown,
  Star,
  Sparkles,
} from "lucide-react";
import { FunnelFormData, IApartment } from "@/types";
import { trackGAEvent, trackFBPixel } from "@/lib/analytics";

const getStepName = (step: number, total: number) => {
  const names: Record<number, string> = {
    1: "Personal Info",
    2: "US Residency",
    3: "Age",
    4: "Household Size",
    5: "Pets",
    6: "Apartment Specs",
    7: "Rental Budget",
    8: total === 8 ? "Credit Status & Pre-filled Location" : "Credit Status",
    9: "Location Selection",
  };
  return names[step] || `Step ${step}`;
};

const ALL_AMENITIES = [
  "Parking",
  "Laundry",
  "Air Conditioning",
  "Heating",
  "Wi-Fi",
  "Gym",
  "Swimming Pool",
  "Elevator",
  "Pet Friendly",
  "Security",
  "Balcony",
  "Dishwasher",
];

const POPULAR_LOCATIONS = [
  "New York, NY 11004",
  "Chicago, IL 60007",
  "Austin, TX 78701",
  "Los Angeles, CA 90012",
  "Miami, FL 33130",
  "Dallas, TX 75201",
];

export default function ApartmentFinderFunnel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlLocation = searchParams.get("location") || "";
  const urlCount = searchParams.get("count") || "";
  const targetApartmentParam = searchParams.get("apartment") || searchParams.get("targetApartment") || "";
  const hasPreselectedLocation = Boolean(urlLocation.trim());

  const [targetApartment, setTargetApartment] = useState<IApartment | null>(null);
  const [loadingApartment, setLoadingApartment] = useState(Boolean(targetApartmentParam));

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = hasPreselectedLocation || Boolean(targetApartmentParam) ? 8 : 9;
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState<FunnelFormData>({
    fullName: "",
    phone: "",
    email: "",
    isUsResident: true,
    age: 28,
    familyMembers: 1,
    hasPets: false,
    petDetails: "",
    bedrooms: 1,
    bathrooms: 1,
    furnished: "Either",
    kitchenRequired: true,
    amenities: ["Air Conditioning", "Wi-Fi", "Dishwasher"],
    budgetMin: 800,
    budgetMax: 1400,
    creditScore: "Good (660 - 719)",
    desiredLocation: urlLocation.trim() || "",
  });

  // Keep location synced if query param is passed
  useEffect(() => {
    if (urlLocation.trim()) {
      setFormData((prev) => ({ ...prev, desiredLocation: urlLocation.trim() }));
    }
  }, [urlLocation]);

  // GA4: Track funnel step view and start
  useEffect(() => {
    const stepName = getStepName(currentStep, totalSteps);
    trackGAEvent("quiz_step_view", {
      step_number: currentStep,
      step_name: stepName,
      total_steps: totalSteps,
      is_target_apartment: Boolean(targetApartmentParam),
    });

    // Step-specific event name for seamless GA4 funnel selection without parameter setup
    trackGAEvent(`quiz_step_${currentStep}_view`, {
      step_number: currentStep,
      step_name: stepName,
      total_steps: totalSteps,
    });

    if (currentStep === 1) {
      trackGAEvent("quiz_start", {
        total_steps: totalSteps,
        is_target_apartment: Boolean(targetApartmentParam),
        has_preselected_location: hasPreselectedLocation,
      });
    }
  }, [currentStep, totalSteps, targetApartmentParam, hasPreselectedLocation]);

  // Load target apartment details if routed from featured apartment cards
  useEffect(() => {
    if (targetApartmentParam) {
      setLoadingApartment(true);
      fetch(`/api/apartments/${encodeURIComponent(targetApartmentParam)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.apartment) {
            const apt: IApartment = data.apartment;
            setTargetApartment(apt);
            setFormData((prev) => ({
              ...prev,
              bedrooms: apt.bedrooms || prev.bedrooms,
              bathrooms: apt.bathrooms || prev.bathrooms,
              budgetMin: Math.max(500, apt.baseRent - 200),
              budgetMax: apt.baseRent + 200,
              furnished: (apt.furnished as any) || prev.furnished,
              desiredLocation: prev.desiredLocation || apt.addressTemplate || "United States Metropolitan Area",
              selectedApartmentId: apt._id || apt.id,
              selectedApartmentTitle: apt.title,
              selectedApartmentPrice: apt.baseRent,
            }));
          }
        })
        .catch((err) => console.error("Error loading target apartment for quiz:", err))
        .finally(() => setLoadingApartment(false));
    }
  }, [targetApartmentParam]);

  const updateField = <K extends keyof FunnelFormData>(field: K, value: FunnelFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMsg("");
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      const updated = exists
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: updated };
    });
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!formData.fullName.trim()) {
        setErrorMsg("Please enter your full name.");
        return false;
      }
      if (!formData.phone.trim() || formData.phone.length < 7) {
        setErrorMsg("Please enter a valid phone number for rental updates.");
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes("@")) {
        setErrorMsg("Please enter a valid email address.");
        return false;
      }
    }
    if (step === 8) {
      if (!formData.creditScore) {
        setErrorMsg("Please select your credit score status.");
        return false;
      }
    }
    if (step === 9 && !hasPreselectedLocation && !targetApartmentParam) {
      if (!formData.desiredLocation.trim()) {
        setErrorMsg("Please provide your desired City, State, or ZIP Code.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (submitting) return;
    if (validateStep(currentStep)) {
      const stepName = getStepName(currentStep, totalSteps);
      trackGAEvent("quiz_step_complete", {
        step_number: currentStep,
        step_name: stepName,
        total_steps: totalSteps,
      });
      trackGAEvent(`quiz_step_${currentStep}_complete`, {
        step_name: stepName,
      });

      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    } else {
      trackGAEvent("quiz_step_validation_error", {
        step_number: currentStep,
        step_name: getStepName(currentStep, totalSteps),
      });
    }
  };

  const handleBack = () => {
    if (submitting) return;
    if (currentStep > 1) {
      trackGAEvent("quiz_step_back", {
        from_step: currentStep,
        to_step: currentStep - 1,
      });
      setErrorMsg("");
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!validateStep(currentStep)) return;
    const effectiveLocation =
      formData.desiredLocation.trim() ||
      targetApartment?.addressTemplate ||
      "United States Metropolitan Area";

    if (!effectiveLocation) {
      setErrorMsg("Please provide your desired City, State, or ZIP Code.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");

    let seenApartmentIds: string[] = [];
    if (typeof window !== "undefined") {
      try {
        const rawSeen = sessionStorage.getItem("rentorce_seen_apartments") || sessionStorage.getItem("apartmento_seen_apartments");
        if (rawSeen) seenApartmentIds = JSON.parse(rawSeen);
      } catch {
        seenApartmentIds = [];
      }
    }

    const submissionData = {
      ...formData,
      desiredLocation: effectiveLocation,
      selectedApartmentId: targetApartment?._id || targetApartment?.id || formData.selectedApartmentId,
      selectedApartmentTitle: targetApartment?.title || formData.selectedApartmentTitle,
      selectedApartmentPrice: targetApartment?.baseRent || formData.selectedApartmentPrice,
      seenApartmentIds,
    };

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        trackGAEvent("quiz_complete", {
          total_steps: totalSteps,
          has_target_apartment: Boolean(targetApartment),
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          budget_min: formData.budgetMin,
          budget_max: formData.budgetMax,
          has_pets: formData.hasPets,
        });

        trackFBPixel("Lead", {
          content_name: "Apartment Match Quiz",
          currency: "USD",
          value: formData.budgetMax || 1200,
        });

        // Save search and matches into sessionStorage
        if (typeof window !== "undefined") {
          // Track seen chameleon/matched apartments so consecutive searches rotate to fresh units
          const newMatchedIds: string[] = (data.matches || [])
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((m: any) => m._id || m.id)
            .filter(Boolean);
          const updatedSeen = Array.from(new Set([...seenApartmentIds, ...newMatchedIds]));
          sessionStorage.setItem("rentorce_seen_apartments", JSON.stringify(updatedSeen));
          sessionStorage.setItem("apartmento_seen_apartments", JSON.stringify(updatedSeen));

          sessionStorage.setItem("rentorce_last_search", JSON.stringify(submissionData));
          sessionStorage.setItem("rentorce_last_matches", JSON.stringify(data.matches));
          sessionStorage.setItem("rentorce_lead_id", data.leadId);
          sessionStorage.setItem("rentorce_quiz_completed", "true");
          // Also set legacy keys for backward compatibility
          sessionStorage.setItem("apartmento_last_search", JSON.stringify(submissionData));
          sessionStorage.setItem("apartmento_last_matches", JSON.stringify(data.matches));
          sessionStorage.setItem("apartmento_lead_id", data.leadId);
          sessionStorage.setItem("apartmento_quiz_completed", "true");
          if (targetApartment) {
            const aptKey = targetApartment.slug || targetApartment._id || targetApartment.id;
            sessionStorage.setItem(`rentorce_unlocked_${aptKey}`, "true");
            sessionStorage.setItem(`apartmento_unlocked_${aptKey}`, "true");
          }
        }

        if (targetApartment) {
          const aptKey = targetApartment.slug || targetApartment._id || targetApartment.id;
          router.push(`/apartments/${aptKey}?unlocked=true`);
        } else {
          router.push("/results");
        }
      } else {
        trackGAEvent("quiz_submission_error", {
          error_message: data.error || "Failed to search apartments",
        });
        setErrorMsg(data.error || "Failed to search apartments. Please retry.");
        setSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      trackGAEvent("quiz_submission_error", {
        error_message: "Network error",
      });
      setErrorMsg("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  };

  // Keyboard navigation & enter key support
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const budgetMaxInputRef = useRef<HTMLInputElement>(null);

  const formDataRef = useRef(formData);
  formDataRef.current = formData;
  const submittingRef = useRef(submitting);
  submittingRef.current = submitting;
  const handleNextRef = useRef(handleNext);
  handleNextRef.current = handleNext;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      if (submittingRef.current) return;

      const target = e.target as HTMLElement | null;

      // If focus is specifically on the Back button, let Back execute
      if (target?.getAttribute("data-action") === "back") {
        return;
      }

      // Step 1: Smooth sequential progression if subsequent fields are still empty
      if (target?.getAttribute("data-field") === "fullName") {
        if (!formDataRef.current.phone?.trim() && phoneInputRef.current) {
          e.preventDefault();
          phoneInputRef.current.focus();
          return;
        }
        if (!formDataRef.current.email?.trim() && emailInputRef.current) {
          e.preventDefault();
          emailInputRef.current.focus();
          return;
        }
      }

      if (target?.getAttribute("data-field") === "phone") {
        if (!formDataRef.current.email?.trim() && emailInputRef.current) {
          e.preventDefault();
          emailInputRef.current.focus();
          return;
        }
      }

      // Step 7: Smooth progression from min budget to max budget if max is not filled
      if (target?.getAttribute("data-field") === "budgetMin") {
        if (!formDataRef.current.budgetMax && budgetMaxInputRef.current) {
          e.preventDefault();
          budgetMaxInputRef.current.focus();
          return;
        }
      }

      // Otherwise, Enter triggers the Next Step button (or Submit on final step)
      e.preventDefault();
      handleNextRef.current();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
      {/* Target Apartment Banner if routed from featured apartment */}
      {targetApartment && (
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-4 sm:p-5 border-b border-blue-500/30 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-white/20 shadow-md">
              <Image
                src={
                  targetApartment.images?.[0] ||
                  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=300&q=80"
                }
                alt={targetApartment.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  <Star className="w-3 h-3 fill-emerald-300" /> Selected Unit
                </span>
                <span className="text-xs font-black text-blue-200">
                  From ${targetApartment.baseRent}/mo
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white truncate mt-1">
                {targetApartment.title}
              </h3>
              <p className="text-[11px] text-blue-200/80 truncate">
                Complete this quick 2-min quiz to unlock full verified details & schedule your tour!
              </p>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end shrink-0 text-right">
            <span className="text-xs font-bold text-slate-200">
              {targetApartment.bedrooms} Bed • {targetApartment.bathrooms} Bath
            </span>
            <span className="text-[10px] text-slate-400">
              {targetApartment.furnished}
            </span>
          </div>
        </div>
      )}

      {/* Funnel Header / Progress */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
              {currentStep}
            </span>
            <span className="text-xs uppercase tracking-widest text-slate-300 font-semibold">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <span className="text-xs text-blue-300 font-medium">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-indigo-400 h-2 rounded-full"
            initial={{ width: "12%" }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Dynamic Step Title */}
        <h2 className="text-xl sm:text-2xl font-bold mt-5 tracking-tight">
          {currentStep === 1 && "Personal Information"}
          {currentStep === 2 && "U.S. Residency Status"}
          {currentStep === 3 && "What is your age?"}
          {currentStep === 4 && "Household & Family Size"}
          {currentStep === 5 && "Do you have any pets?"}
          {currentStep === 6 && "Apartment Specifications"}
          {currentStep === 7 && "What is your monthly budget?"}
          {currentStep === 8 && "What's your credit status?"}
          {currentStep === 9 && "Where are you moving?"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          {currentStep === 1 && "Enter your contact details so our leasing managers can send your matches."}
          {currentStep === 2 && "Apartments require residency verification for tenancy agreements."}
          {currentStep === 3 && "Help us find communities and lease terms tailored for you."}
          {currentStep === 4 && "We'll suggest optimal square footage and floor plans."}
          {currentStep === 5 && "We match you with buildings with compatible pet policies."}
          {currentStep === 6 && "Select your desired apartment category and preferred amenities."}
          {currentStep === 7 && "We calibrate available apartments directly into your price range."}
          {currentStep === 8 && "Select your estimated credit standing so we can match you with eligible properties."}
          {currentStep === 9 && "Enter any city, neighborhood, or 5-digit ZIP code in the USA."}
        </p>

        {hasPreselectedLocation && (
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>Target Location: <strong className="text-white">{formData.desiredLocation}</strong></span>
            {urlCount && (
              <>
                <span className="text-blue-400/50">•</span>
                <span className="text-emerald-400 font-semibold">{urlCount} Units Available</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Step Contents */}
      <div className="p-6 sm:p-8">
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Personal Info */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    data-field="fullName"
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Phone Number <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    required
                    data-field="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 transition"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Used for SMS updates on apartment availability and tour schedules.
                </span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email Address <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    ref={emailInputRef}
                    type="email"
                    required
                    data-field="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 transition"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: US Residency */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <p className="text-sm font-medium text-slate-700">
                Are you currently a U.S. citizen or permanent resident?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateField("isUsResident", true)}
                  className={`p-5 rounded-2xl border-2 text-left transition flex flex-col justify-between cursor-pointer ${
                    formData.isUsResident
                      ? "border-blue-600 bg-blue-50/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">🇺🇸</span>
                    {formData.isUsResident && (
                      <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-base">
                      Yes, I am a U.S. Resident
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Citizen, Green Card, or valid US status
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => updateField("isUsResident", false)}
                  className={`p-5 rounded-2xl border-2 text-left transition flex flex-col justify-between cursor-pointer ${
                    !formData.isUsResident
                      ? "border-blue-600 bg-blue-50/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">✈️</span>
                    {!formData.isUsResident && (
                      <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-base">
                      No, Relocating / International
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Moving to the United States soon
                    </span>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Age */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "18 - 24", val: 21 },
                  { label: "25 - 34", val: 29 },
                  { label: "35 - 49", val: 40 },
                  { label: "50+", val: 55 },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => updateField("age", item.val)}
                    className={`py-4 px-3 rounded-2xl border-2 text-center transition font-semibold cursor-pointer ${
                      formData.age === item.val
                        ? "border-blue-600 bg-blue-50/60 text-blue-700"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Exact Age:</span>
                <input
                  type="number"
                  min={18}
                  max={99}
                  value={formData.age}
                  onChange={(e) => updateField("age", Number(e.target.value))}
                  className="w-24 px-3 py-2 text-center text-lg font-bold rounded-xl border border-slate-300 focus:border-blue-600 outline-none"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 4: Family / Household */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <p className="text-sm font-medium text-slate-700">
                How many household members will occupy this apartment?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { count: 1, title: "Just Me", desc: "1 occupant" },
                  { count: 2, title: "2 People", desc: "Couple or roommate" },
                  { count: 3, title: "3 People", desc: "Small family" },
                  { count: 4, title: "4+ People", desc: "Family / group" },
                ].map((item) => (
                  <button
                    key={item.count}
                    type="button"
                    onClick={() => updateField("familyMembers", item.count)}
                    className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer ${
                      formData.familyMembers === item.count
                        ? "border-blue-600 bg-blue-50/60 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <Users className={`w-5 h-5 mb-2 ${formData.familyMembers === item.count ? "text-blue-600" : "text-slate-400"}`} />
                    <span className="block font-bold text-slate-900 text-sm">{item.title}</span>
                    <span className="block text-xs text-slate-500">{item.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 5: Pets */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    updateField("hasPets", false);
                    updateField("petDetails", "");
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition flex items-center justify-between cursor-pointer ${
                    !formData.hasPets
                      ? "border-blue-600 bg-blue-50/60"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🚫</span>
                    <div>
                      <span className="block font-bold text-slate-900 text-sm">No Pets</span>
                      <span className="block text-xs text-slate-500">I do not own pets</span>
                    </div>
                  </div>
                  {!formData.hasPets && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => updateField("hasPets", true)}
                  className={`p-4 rounded-2xl border-2 text-left transition flex items-center justify-between cursor-pointer ${
                    formData.hasPets
                      ? "border-blue-600 bg-blue-50/60"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🐾</span>
                    <div>
                      <span className="block font-bold text-slate-900 text-sm">Yes, I Have Pets</span>
                      <span className="block text-xs text-slate-500">Dogs, cats, or others</span>
                    </div>
                  </div>
                  {formData.hasPets && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                </button>
              </div>

              {formData.hasPets && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Pet Type & Quantity:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["1 Dog", "1 Cat", "Multiple Pets"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => updateField("petDetails", p)}
                        className={`py-2 px-3 text-xs font-medium rounded-xl border cursor-pointer ${
                          formData.petDetails === p
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 6: Apartment Requirements */}
          {currentStep === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              {/* Apartment Category / Layout Dropdown */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-slate-600 mb-2">
                  Apartment Layout / Category
                </label>
                <div className="relative">
                  <select
                    value={
                      formData.bedrooms === 1 && formData.bathrooms === 1
                        ? "1B1B"
                        : formData.bedrooms === 2 && formData.bathrooms === 1
                        ? "2B1B"
                        : formData.bedrooms === 2 && formData.bathrooms === 2
                        ? "2B2B"
                        : formData.bedrooms === 3 && formData.bathrooms === 1
                        ? "3B1B"
                        : formData.bedrooms === 3 && formData.bathrooms === 2
                        ? "3B2B"
                        : formData.bedrooms === 3 && formData.bathrooms === 3
                        ? "3B3B"
                        : "1B1B"
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      let beds = 1;
                      let baths = 1;
                      if (val === "1B1B") { beds = 1; baths = 1; }
                      else if (val === "2B1B") { beds = 2; baths = 1; }
                      else if (val === "2B2B") { beds = 2; baths = 2; }
                      else if (val === "3B1B") { beds = 3; baths = 1; }
                      else if (val === "3B2B") { beds = 3; baths = 2; }
                      else if (val === "3B3B") { beds = 3; baths = 3; }
                      setFormData((prev) => ({
                        ...prev,
                        bedrooms: beds,
                        bathrooms: baths,
                      }));
                    }}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-200 text-sm sm:text-base font-bold text-slate-800 bg-white hover:border-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition cursor-pointer outline-none shadow-sm"
                  >
                    <option value="1B1B">1 Bed / 1 Bath</option>
                    <option value="2B1B">2 Bed / 1 Bath</option>
                    <option value="2B2B">2 Bed / 2 Bath</option>
                    <option value="3B1B">3 Bed / 1 Bath</option>
                    <option value="3B2B">3 Bed / 2 Bath</option>
                    <option value="3B3B">3 Bed / 3 Bath</option>
                  </select>
                </div>
              </div>

              {/* Furnished & Kitchen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 mb-1.5">
                    Furnished Status
                  </label>
                  <select
                    value={formData.furnished}
                    onChange={(e) => updateField("furnished", e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white cursor-pointer"
                  >
                    <option value="Either">Either (Furnished or Unfurnished)</option>
                    <option value="Furnished">Furnished Only</option>
                    <option value="Unfurnished">Unfurnished Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 mb-1.5">
                    Kitchen
                  </label>
                  <select
                    value={formData.kitchenRequired ? "yes" : "no"}
                    onChange={(e) => updateField("kitchenRequired", e.target.value === "yes")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white cursor-pointer"
                  >
                    <option value="yes">Full Kitchen Required</option>
                    <option value="no">Kitchenette is fine</option>
                  </select>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">
                  Select Desired Amenities
                </label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                  {ALL_AMENITIES.map((item) => {
                    const isSelected = formData.amenities.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleAmenity(item)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition flex items-center gap-1.5 font-medium cursor-pointer ${
                          isSelected
                            ? "bg-blue-50 border-blue-400 text-blue-700"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 7: Budget */}
          {currentStep === 7 && (
            <motion.div
              key="step7"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Target Rental Budget
                </span>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
                  ${formData.budgetMin} – ${formData.budgetMax}
                  <span className="text-sm font-normal text-slate-500"> / month</span>
                </div>
              </div>

              {/* Budget Preset Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { min: 600, max: 900, label: "$600 – $900" },
                  { min: 900, max: 1300, label: "$900 – $1,300" },
                  { min: 1300, max: 1600, label: "$1,300 – $1,600" },
                  { min: 1600, max: 2000, label: "$1,600 – $2,000" },
                ].map((b) => (
                  <button
                    key={b.label}
                    type="button"
                    onClick={() => {
                      updateField("budgetMin", b.min);
                      updateField("budgetMax", b.max);
                    }}
                    className={`p-3 rounded-2xl border text-xs font-bold transition text-center cursor-pointer ${
                      formData.budgetMin === b.min && formData.budgetMax === b.max
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              {/* Manual Budget Input Option */}
              <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/90 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                    Enter Budget Manually
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Type custom amount</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Min Monthly Rent ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">$</span>
                      <input
                        type="number"
                        min={100}
                        max={30000}
                        step={50}
                        data-field="budgetMin"
                        value={formData.budgetMin || ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : Number(e.target.value);
                          updateField("budgetMin", val);
                        }}
                        placeholder="Enter min rent"
                        className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Max Monthly Rent ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">$</span>
                      <input
                        ref={budgetMaxInputRef}
                        type="number"
                        min={100}
                        max={50000}
                        step={50}
                        data-field="budgetMax"
                        value={formData.budgetMax || ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : Number(e.target.value);
                          updateField("budgetMax", val);
                        }}
                        placeholder="Enter max rent"
                        className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 8: Credit Score Status */}
          {currentStep === 8 && (
            <motion.div
              key="step8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    What's your credit status? <span className="text-blue-600">*</span>
                  </label>
                  <div className="relative">
                    <CreditCard className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                    <select
                      value={formData.creditScore}
                      onChange={(e) => updateField("creditScore", e.target.value)}
                      className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 text-sm font-semibold bg-white appearance-none cursor-pointer shadow-sm transition"
                    >
                      <option value="Excellent (720+)">Excellent (720+)</option>
                      <option value="Good (660 - 719)">Good (660 – 719)</option>
                      <option value="Fair (600 - 659)">Fair (600 – 659)</option>
                      <option value="Poor / Rebuilding (Under 600)">Poor / Rebuilding (Under 600)</option>
                      <option value="No Credit Score">I don't have a credit score</option>
                    </select>
                    <div className="absolute right-3.5 top-4 pointer-events-none text-slate-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 mt-1.5 block">
                    Choose the range that best estimates your current credit standing.
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 9: Location (Only shown if not preselected via Hero search) */}
          {!hasPreselectedLocation && currentStep === 9 && (
            <motion.div
              key="step9"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Target City, State, or U.S. ZIP Code <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-3.5 top-3.5 text-blue-600" />
                  <input
                    type="text"
                    required
                    data-field="desiredLocation"
                    placeholder="Enter city, state, or ZIP code"
                    value={formData.desiredLocation}
                    onChange={(e) => updateField("desiredLocation", e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 font-medium transition"
                  />
                </div>
                <span className="text-xs text-slate-400 mt-1 block">
                  You can search any town, metropolitan area, or ZIP across the United States.
                </span>
              </div>

              {/* Quick Pick Location Pills */}
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2 block">
                  Popular Searches:
                </span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => updateField("desiredLocation", loc)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition cursor-pointer ${
                        formData.desiredLocation === loc
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button
              type="button"
              data-action="back"
              onClick={handleBack}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            data-action="next"
            onClick={handleNext}
            disabled={submitting}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-blue-600/25 flex items-center gap-2 transition ml-auto cursor-pointer disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                {targetApartment ? "Unlocking Apartment Details..." : "Matching Local Inventory..."}
              </>
            ) : currentStep === totalSteps ? (
              <span>
                {targetApartment ? "Unlock Details & Schedule Tour →" : "Find Apartments"}
              </span>
            ) : (
              <>
                Next Step
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Learn More Link */}
        <div className="mt-5 pt-2 text-center text-xs text-slate-500">
          Learn more about how it works:{" "}
          <Link
            href="/guides/how-rentorce-works"
            className="text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-2 transition"
          >
            Click here
          </Link>
        </div>
      </div>
    </div>
  );
}
