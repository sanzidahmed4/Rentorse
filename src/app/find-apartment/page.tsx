import { Suspense } from "react";
import ApartmentFinderFunnel from "@/components/funnel/ApartmentFinderFunnel";
import { Metadata } from "next";
import { Clock, Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Find Your Apartment — Smart Rental Matcher | Apartmento",
  description:
    "Match with verified 1, 2, and 3-bedroom apartments across the USA tailored to your exact budget, pet requirements, and preferred city or ZIP code in under 2 minutes.",
};

export default function FindApartmentPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
          Instant Rental Matching
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Find Your Ideal USA Apartment
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
          Complete the quick questionnaire below. Our algorithm instantly matches available inventory to your desired location and budget.
        </p>

        <div className="flex items-center justify-center gap-1.5 mt-4 text-xs font-medium text-slate-500">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Takes 2 Minutes</span>
        </div>
      </div>

      {/* The Interactive Apartment Match Funnel */}
      <Suspense
        fallback={
          <div className="max-w-2xl mx-auto p-12 bg-white rounded-3xl border border-slate-100 shadow-md text-center text-slate-500 flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-sm font-semibold">Loading rental matching questionnaire...</span>
          </div>
        }
      >
        <ApartmentFinderFunnel />
      </Suspense>
    </div>
  );
}
