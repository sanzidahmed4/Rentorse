import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  CheckCircle,
  ShieldCheck,
  Search,
  Star,
  ArrowRight,
  Home,
  MapPin,
  Calendar,
  Users,
} from "lucide-react";
import { getSiteStats, getApartments } from "@/lib/store";
import FaqAccordion from "@/components/home/FaqAccordion";
import HeroSearchBox from "@/components/home/HeroSearchBox";

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const stats = await getSiteStats();
  const sampleApartments = await getApartments({ isActive: true });

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative z-10 bg-slate-950 text-white pt-[69px] pb-[101px] lg:pt-[85px] lg:pb-[133px]">
        {/* Background Apartment Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/hero-background.png"
            alt="Apartment Interior Background"
            fill
            priority
            className="object-cover object-center animate-subtle-drift will-change-transform"
          />
          {/* Gradient Overlay for Text Readability & Brand Color */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-blue-950/75 to-blue-950/90" />
          {/* Ambient Blue Spotlight (Zero-blur GPU-friendly radial gradient) */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.25)_0%,_transparent_70%)] pointer-events-none" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-block text-blue-300 text-xs sm:text-sm font-semibold tracking-wide mb-3 sm:mb-3.5">
            <span>The Smarter Way to Rent an Apartment</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-4 sm:mb-5">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300">Next Apartment</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto mb-6 sm:mb-7">
            Discover verified 1, 2, and 3-bedroom rentals across all 50 states. Simply tell us your desired city, budget, and lifestyle requirements—we’ll match you with curated listings in seconds.
          </p>

          {/* Zillow-Style Hero Search Box with Live Count */}
          <HeroSearchBox />

          {/* Trust Badges */}
          <div className="pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Free Renter Service</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>Verified Landlords</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>4.9/5 Renter Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* INVENTORY CATEGORIES */}
      <section id="categories" className="bg-slate-50 relative pb-20">
        {/* DYNAMIC STATISTICS (From MongoDB / Admin) - Elevated Floating Card */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-14 sm:-mt-16 [transform:translateZ(0)]">
          <div className="bg-white border border-slate-200/80 py-7 sm:py-8 px-6 sm:px-8 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/60">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="pt-3 md:pt-0">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  {stats.activeApartments}
                </div>
                <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
                  Active Apartments
                </p>
              </div>

              <div className="pt-3 md:pt-0">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-600 tracking-tight">
                  {stats.activeRenters}
                </div>
                <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
                  Active Renters
                </p>
              </div>

              <div className="pt-3 md:pt-0">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  {stats.propertiesListed}
                </div>
                <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
                  Properties Listed
                </p>
              </div>

              <div className="pt-3 md:pt-0">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-indigo-600 tracking-tight">
                  {stats.customersServed}
                </div>
                <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
                  Customers Served
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600 mb-2">
              Explore Available Inventory
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900">
              Tailored for Every Stage of Life
            </h3>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              Choose from our verified layouts with flexible leases, chef kitchens, and pet-friendly accommodations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1B1B */}
            <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col [transform:translateZ(0)]">
              <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                <Image
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
                  alt="1 Bed / 1 Bath Apartment"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
                />
                <div className="absolute top-4 left-4 bg-slate-950/85 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  10–15 Units Ready
                </div>
                <div className="absolute bottom-4 right-4 bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-lg">
                  From $800 / mo
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">1 Bed / 1 Bath Suites</h4>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Perfect for solo professionals and couples. Features open layouts, in-unit laundry options, and modern kitchenettes.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-6">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100">600–750 sq ft</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100">Modern Appliances</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100">Pet Friendly</span>
                  </div>
                </div>
                <Link
                  href="/find-apartment"
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 text-center font-bold text-sm transition"
                >
                  View 1 Bed Options →
                </Link>
              </div>
            </div>

            {/* 2B2B */}
            <div className="group bg-white rounded-3xl overflow-hidden border-2 border-blue-600/30 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col relative [transform:translateZ(0)]">
              <div className="absolute top-3 right-3 z-10 bg-blue-600 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow">
                Most Popular
              </div>
              <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                <Image
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
                  alt="2 Bed / 2 Bath Apartment"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
                />
                <div className="absolute top-4 left-4 bg-slate-950/85 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  10–15 Units Ready
                </div>
                <div className="absolute bottom-4 right-4 bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-lg">
                  From $1,180 / mo
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">2 Bed / 2 Bath Residences</h4>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Dual master bedrooms ideal for roommates, growing families, or home offices. Spacious living rooms with private balconies.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-6">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100">950–1,150 sq ft</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100">Dual Bathrooms</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100">Covered Parking</span>
                  </div>
                </div>
                <Link
                  href="/find-apartment"
                  className="w-full py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-center font-bold text-sm shadow-md transition"
                >
                  View 2 Bed Options →
                </Link>
              </div>
            </div>

            {/* 3B2B / 3B3B */}
            <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col [transform:translateZ(0)]">
              <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                <Image
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
                  alt="3 Bed Luxury Apartment"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
                />
                <div className="absolute top-4 left-4 bg-slate-950/85 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  10–15 Units Ready
                </div>
                <div className="absolute bottom-4 right-4 bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-lg">
                  From $1,520 / mo
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">3 Bed / 2 & 3 Bath Luxury</h4>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Grand family floorplans featuring primary ensuite bathrooms, walk-in closets, granite kitchens, and resort amenities.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-6">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100">1,280–1,600 sq ft</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100">Pool & Gym Access</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100">Private Balcony</span>
                  </div>
                </div>
                <Link
                  href="/find-apartment"
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 text-center font-bold text-sm transition"
                >
                  View 3 Bed Options →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600 mb-2">
              Simple & Transparent
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900">
              How Apartmento Connects You
            </h3>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              We took the frustration out of finding an apartment in the United States.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xl shadow-sm">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900">Complete 8-Step Quiz</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Provide your preferred location (any ZIP code or city), bedroom count, pets, and target budget from $800 to $1,800.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xl shadow-sm">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900">Dynamic Matching</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our algorithm scans verified properties and adapts location details and calibrated prices matching your exact criteria.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xl shadow-sm">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900">Schedule Tour & Lease</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pick your preferred apartment and schedule an in-person or virtual walkthrough directly with property management.
              </p>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-14 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h4 className="text-2xl sm:text-3xl font-bold">Ready to find your ideal home?</h4>
              <p className="text-blue-100 text-sm mt-1">Takes less than 2 minutes. Free and no obligation.</p>
            </div>
            <Link
              href="/find-apartment"
              className="px-8 py-4 rounded-2xl bg-white text-blue-700 font-bold text-sm sm:text-base hover:bg-blue-50 transition shadow-lg shrink-0"
            >
              Start Apartment Finder →
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600 mb-2">
              Verified Renters
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900">
              Trusted by 12,000+ Renters Nationwide
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm italic">
                “I was relocating to Chicago and couldn’t find honest listings in 60007. Apartmento matched me with a 2-bedroom with pet approval in 24 hours!”
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-900">Sarah M.</span>
                <span>Chicago, IL</span>
              </div>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm italic">
                “Finding a 1 Bed under $900 in New York seemed impossible until I used the finder. The application was seamless and the manager called me the same afternoon.”
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-900">David K.</span>
                <span>New York, NY</span>
              </div>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm italic">
                “The multi-step quiz is so fast on mobile. We got a 3 Bed / 2 Bath for our kids with an in-unit washer and private parking inside our exact budget.”
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-900">Elena & Marcus R.</span>
                <span>Austin, TX</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600 mb-2">
              Got Questions?
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900">
              Frequently Asked Questions
            </h3>
          </div>

          <FaqAccordion />
        </div>
      </section>
    </div>
  );
}
