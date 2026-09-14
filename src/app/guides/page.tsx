import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, BookOpen } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://apartmento.us";

export const metadata: Metadata = {
  title: "Apartment Renting Guides & Tips | Apartmento",
  description: "Expert guides on renting apartments in the USA. Learn how to find your perfect 1BR, 2BR, or 3BR rental, negotiate rent, pass background checks, and more.",
  alternates: { canonical: `${BASE_URL}/guides` },
  openGraph: {
    title: "Apartment Renting Guides & Tips | Apartmento",
    description: "Expert guides on how to rent apartments in the USA. Budget tips, pet-friendly searches, furnished options, and more.",
    url: `${BASE_URL}/guides`,
    siteName: "Apartmento",
    images: [{ url: `${BASE_URL}/site-logo.png`, width: 1200, height: 630 }],
    locale: "en_US", type: "website",
  },
};

const GUIDES = [
  {
    slug: "how-to-rent-apartment-usa",
    title: "How to Rent an Apartment in the USA: Complete Step-by-Step Guide",
    excerpt: "Everything you need to know about renting your first or next apartment in the United States — from credit checks to lease signing.",
    readTime: "8 min read",
    category: "Getting Started",
  },
  {
    slug: "1-bedroom-vs-2-bedroom-apartment",
    title: "1 Bedroom vs 2 Bedroom Apartment: Which Is Right for You?",
    excerpt: "Compare costs, space, and lifestyle factors to decide whether a 1BR or 2BR apartment fits your budget and living situation.",
    readTime: "5 min read",
    category: "Apartment Types",
  },
  {
    slug: "pet-friendly-apartments-guide",
    title: "How to Find Pet-Friendly Apartments in the USA",
    excerpt: "A complete guide for pet owners searching for rental apartments that allow dogs, cats, and other animals — including what to expect from landlords.",
    readTime: "6 min read",
    category: "Pet Owners",
  },
  {
    slug: "apartment-hunting-checklist",
    title: "Ultimate Apartment Hunting Checklist (2025)",
    excerpt: "A comprehensive checklist covering everything from setting your budget to inspecting the unit and reviewing your lease before signing.",
    readTime: "7 min read",
    category: "Checklists",
  },
  {
    slug: "furnished-vs-unfurnished-apartment",
    title: "Furnished vs Unfurnished Apartment: Pros, Cons & Cost Comparison",
    excerpt: "Understand the real cost difference between furnished and unfurnished rentals and decide which option makes financial sense for your situation.",
    readTime: "5 min read",
    category: "Cost & Budget",
  },
];

export default function GuidesIndexPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest mb-5 border border-blue-400/30">
            <BookOpen className="w-3.5 h-3.5" /> Renter Resource Center
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            USA Apartment Renting Guides
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Expert advice on finding, evaluating, and renting apartments across the United States. Written for renters by real estate professionals.
          </p>
        </div>
      </section>

      {/* Guide Cards */}
      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100">
                    {guide.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Clock className="w-3 h-3" /> {guide.readTime}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition mb-2 leading-snug">
                  {guide.title}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">{guide.excerpt}</p>
                <div className="flex items-center gap-1 mt-4 text-blue-600 text-xs font-bold group-hover:gap-2 transition-all">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-100 text-center">
        <h2 className="text-xl font-black text-slate-900 mb-3">Ready to find your apartment?</h2>
        <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">Use our free instant matching tool to find verified rentals in your city — no agent fees.</p>
        <Link href="/find-apartment" className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-sm shadow-md">
          Start Free Apartment Match <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
