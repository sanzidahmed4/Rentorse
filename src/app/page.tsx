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
  BedDouble,
  Bath,
  Maximize2,
} from "lucide-react";
import { getSiteStats, getApartments } from "@/lib/store";
import FaqAccordion from "@/components/home/FaqAccordion";
import HeroSearchBox from "@/components/home/HeroSearchBox";

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const stats = await getSiteStats();
  const allApartments = await getApartments({ isActive: true });
  const featuredList = allApartments.filter((apt) => apt.featured);
  const featuredApartments =
    featuredList.length >= 3
      ? featuredList.slice(0, 3)
      : [
          ...featuredList,
          ...allApartments.filter(
            (a) => !featuredList.some((f) => String(f._id || f.id) === String(a._id || a.id))
          ),
        ].slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section id="home" className="relative bg-slate-950 text-white pt-8 pb-14 sm:pt-[69px] sm:pb-[101px] lg:pt-[85px] lg:pb-[133px] scroll-mt-20">
        {/* Background Apartment Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/hero-background.webp"
            alt="Apartment Interior Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Gradient Overlay for Text Readability & Brand Color */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-blue-950/75 to-blue-950/90" />
          {/* Ambient Blue Spotlight (Zero-blur GPU-friendly radial gradient) */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.25)_0%,_transparent_70%)] pointer-events-none" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 text-center">
          <div className="inline-block text-blue-300 text-[11px] sm:text-sm font-semibold tracking-wide mb-2 sm:mb-3.5">
            <span>The Smarter Way to Rent an Apartment</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2] mb-3 sm:mb-5">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300">Next Apartment</span>
          </h1>

          <p className="text-xs sm:text-base lg:text-lg text-slate-300 max-w-xl sm:max-w-2xl leading-relaxed mx-auto mb-4 sm:mb-7">
            Discover verified 1, 2, and 3-bedroom rentals across all 50 states. Simply tell us your desired city, budget, and lifestyle requirements—we’ll match you with curated listings in seconds.
          </p>

          {/* Zillow-Style Hero Search Box with Live Count */}
          <HeroSearchBox />

          {/* Trust Badges */}
          <div className="pt-3.5 sm:pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-slate-400">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span>100% Free Renter Service</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
              <span>Verified Landlords</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
              <span>4.9/5 Renter Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* INVENTORY CATEGORIES */}
      <section id="categories" className="bg-slate-50 relative pb-20">
        {/* DYNAMIC STATISTICS (From MongoDB / Admin) - Elevated Floating Card */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-10 sm:-mt-16">
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
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600 mb-2">
              Explore Available Inventory
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Handpicked Featured Residences
            </h3>
            <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-2xl mx-auto">
              Browse our handpicked real listings. Click any property to view complete interior photos, exact floor specs, location map, and schedule a private walkthrough.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredApartments.map((apt) => {
              const locationStr =
                apt.addressTemplate?.trim() ||
                apt.displayLocation?.trim() ||
                apt.cityState?.trim() ||
                "United States";
              const targetUrl = `/apartments/${apt.slug || apt._id || apt.id}?from=home`;

              return (
                <div
                  key={apt._id || apt.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col"
                >
                  {/* Photo Container */}
                  <Link href={targetUrl} className="relative h-60 w-full overflow-hidden bg-slate-100 block">
                    <Image
                      src={
                        apt.images?.[0] ||
                        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={apt.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Featured Amber Badge */}
                    <div className="absolute top-3.5 left-3.5 z-10 bg-slate-950/85 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-white/10">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>Featured</span>
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-3 right-3 bg-blue-600 text-white px-3.5 py-1.5 rounded-xl font-black text-base shadow-lg">
                      ${apt.baseRent}
                      <span className="text-[11px] font-normal text-blue-100"> / mo</span>
                    </div>
                  </Link>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{locationStr}</span>
                      </div>

                      <Link href={targetUrl} className="block">
                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                          {apt.title}
                        </h4>
                      </Link>

                      <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                        {apt.description ||
                          "Verified residential listing with modern fixtures, flexible lease terms, and convenient neighborhood amenities."}
                      </p>

                      {/* Specs Row */}
                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600 text-center font-medium">
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

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-slate-500">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium">
                          {apt.furnished}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium">
                          {apt.petPolicy?.includes("Allowed") ? "🐾 Pets Welcome" : "🐾 No Pets"}
                        </span>
                        {apt.hasKitchen && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium">
                            Chef Kitchen
                          </span>
                        )}
                      </div>
                    </div>

                    {/* View Details CTA Button */}
                    <Link
                      href={targetUrl}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-center font-bold text-sm shadow-md shadow-blue-500/15 transition flex items-center justify-center gap-2 group-hover:shadow-lg cursor-pointer"
                    >
                      <span>View Apartment Details</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Secondary Quiz Option for Custom Searches */}
          <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-slate-100/80 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Looking for apartments in another city or specific ZIP code?
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Our smart matching engine instantly searches listings in all 50 states tailored to your budget.
              </p>
            </div>
            <Link
              href="/find-apartment"
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-blue-700 font-bold text-xs sm:text-sm shadow-sm transition shrink-0 flex items-center gap-1.5"
            >
              <span>Take 2-Minute Finder Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white scroll-mt-20 sm:scroll-mt-24">
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
      <section id="testimonials" className="py-20 bg-slate-50 border-t border-slate-100 scroll-mt-20 sm:scroll-mt-24">
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
      <section id="faq" className="py-20 bg-white scroll-mt-20 sm:scroll-mt-24">
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
