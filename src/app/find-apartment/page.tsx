import { Suspense } from "react";
import ApartmentFinderFunnel from "@/components/funnel/ApartmentFinderFunnel";
import { Metadata } from "next";
import { Clock, Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Find Your Apartment — Smart Rental Matcher | Rentorce",
  description:
    "Match with verified 1, 2, and 3-bedroom apartments across the USA tailored to your exact budget, pet requirements, and preferred city or ZIP code in under 2 minutes.",
};

export default function FindApartmentPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight whitespace-nowrap sm:whitespace-normal">
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

      {/* Informational SEO Content Section (Server-Rendered, Helpful for Renters & Search Crawlers) */}
      <section className="max-w-4xl mx-auto mt-16 sm:mt-20 pt-12 border-t border-slate-200">
        <div className="space-y-10 text-slate-700">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-3">
              How the Rentorce Apartment Matching Process Works
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              Rentorce is an apartment discovery and rental matching service designed to simplify the rental search experience for renters across the United States. Rather than scrolling through hundreds of generic classifieds, our system matches your housing criteria directly with curated floor plans and regional rental options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base mb-2">1. Specify Your Preferences</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Enter your target city, neighborhood, or ZIP code. Choose your desired monthly budget, bedroom and bathroom layout (from studios up to 3 bedrooms), and move-in timeline.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base mb-2">2. Tailor Key Amenities</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Filter by lifestyle essentials including pet-friendly policies (cats and dogs), fully furnished or unfurnished units, in-unit laundry, parking, and modern kitchen appliances.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base mb-2">3. Review Matched Results</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our algorithmic matching engine compares your submitted preferences against active property network data and representative market inventory to deliver a tailored shortlist.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 space-y-4 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900">
              Serving Renters Nationwide Across Major US Markets
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Rentorce assists renters seeking long-term residential leases throughout metropolitan regions in all 50 states, including major rental hubs like New York, Los Angeles, Chicago, Dallas, Houston, Miami, and Atlanta.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              When physical properties in our direct verified network are available, renters can explore exact floor plans, square footage, and schedule tours with local leasing teams. For emerging markets or custom queries, our platform matches representative inventory and coordinates leasing outreach to help you find an apartment that aligns with your budget and lifestyle requirements.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
