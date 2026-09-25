"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Sparkles, ArrowRight, Calendar, Star } from "lucide-react";
import { IApartment } from "@/types";
import { trackGAEvent, trackFBPixel } from "@/lib/analytics";

interface ApartmentUnlockBannerProps {
  apartment: IApartment;
}

function ApartmentUnlockBannerContent({ apartment }: ApartmentUnlockBannerProps) {
  const searchParams = useSearchParams();
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlUnlocked = searchParams.get("unlocked") === "true";
      const aptKey = apartment.slug || apartment._id || apartment.id;
      const storedAptUnlocked =
        sessionStorage.getItem(`rentorce_unlocked_${aptKey}`) === "true" ||
        sessionStorage.getItem(`apartmento_unlocked_${aptKey}`) === "true";
      const quizCompleted =
        sessionStorage.getItem("rentorce_quiz_completed") === "true" ||
        sessionStorage.getItem("apartmento_quiz_completed") === "true";

      const unlockedState = urlUnlocked || storedAptUnlocked || quizCompleted;
      setIsUnlocked(unlockedState);

      // Track standard GA4 view_item & Meta ViewContent
      trackGAEvent("view_item", {
        currency: "USD",
        value: apartment.baseRent,
        items: [
          {
            item_id: aptKey,
            item_name: apartment.title,
            price: apartment.baseRent,
            item_category: `${apartment.bedrooms} Bed`,
          },
        ],
      });

      trackFBPixel("ViewContent", {
        content_name: apartment.title,
        content_ids: [aptKey],
        content_type: "product",
        value: apartment.baseRent,
        currency: "USD",
      });
    }
  }, [searchParams, apartment]);

  if (isUnlocked) {
    return (
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white p-5 rounded-3xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3 duration-300">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/30 px-2 py-0.5 rounded-md border border-emerald-300/30">
                Pre-Qualified
              </span>
              <span className="text-xs text-emerald-200 font-semibold flex items-center gap-1">
                <Star className="w-3 h-3 fill-emerald-200" /> Quiz Completed
              </span>
            </div>
            <h3 className="text-base font-bold mt-0.5 text-white">
              Details & Tour Scheduling Unlocked!
            </h3>
            <p className="text-xs text-emerald-100">
              You are pre-qualified for {apartment.title}. Review full specifications below or book your private walkthrough.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("leasing-overview-sidebar");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs transition shadow-sm shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-700" />
          <span>Book Tour Below ↓</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-5 rounded-3xl shadow-md border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 border border-blue-400/30">
          <Sparkles className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">
            Pre-Qualify to Tour & Rent This Home
          </h3>
          <p className="text-xs text-slate-300">
            Complete our quick 2-minute tenant questionnaire to unlock tour scheduling and priority leasing agent review.
          </p>
        </div>
      </div>

      <Link
        href={`/find-apartment?apartment=${apartment.slug || apartment._id || apartment.id}`}
        onClick={() => {
          trackGAEvent("quiz_start_click", {
            source: "apartment_detail_banner",
            apartment_id: apartment.slug || apartment._id || apartment.id,
            apartment_title: apartment.title,
          });
        }}
        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-500/25 shrink-0 flex items-center gap-1.5 cursor-pointer"
      >
        <span>Take 2-Min Quiz</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

export default function ApartmentUnlockBanner(props: ApartmentUnlockBannerProps) {
  return (
    <Suspense fallback={null}>
      <ApartmentUnlockBannerContent {...props} />
    </Suspense>
  );
}
