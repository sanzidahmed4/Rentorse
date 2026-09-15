import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getApartments } from "@/lib/store";
import { BedDouble, Bath, MapPin, ArrowRight, CheckCircle, Building2 } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://rentorce.com";

const CITY_DATA: Record<string, {
  name: string; state: string; stateCode: string; zip: string;
  tagline: string; description: string; avgRent: string;
  neighborhoods: string[]; faqs: { q: string; a: string }[];
}> = {
  "new-york-ny": {
    name: "New York", state: "New York", stateCode: "NY", zip: "10001",
    tagline: "Apartments for Rent in New York, NY",
    description: "Find verified 1-bedroom, 2-bedroom, and 3-bedroom apartments for rent in New York City. From Manhattan to Brooklyn and Queens, Rentorce matches you with available rentals tailored to your exact budget and move-in date.",
    avgRent: "$1,200 – $1,800",
    neighborhoods: ["Manhattan", "Brooklyn", "Queens", "Bronx", "Jersey City"],
    faqs: [
      { q: "What is the average rent in New York City?", a: "Average rent in New York City ranges from $1,200/mo for a studio to $1,800+/mo for a 2-bedroom apartment, depending on the neighborhood." },
      { q: "Are there pet-friendly apartments in New York?", a: "Yes, many New York apartment buildings allow cats and small dogs. Use our matcher to filter for pet-friendly units." },
      { q: "How do I find a 2-bedroom apartment in NYC under $1,500?", a: "Use Rentorce's matching system — enter New York as your location and select 2 Bed / 1 Bath with a budget up to $1,500. Our algorithm surfaces the best available matches instantly." },
    ],
  },
  "los-angeles-ca": {
    name: "Los Angeles", state: "California", stateCode: "CA", zip: "90012",
    tagline: "Apartments for Rent in Los Angeles, CA",
    description: "Searching for apartments in Los Angeles? Browse verified 1BR, 2BR, and 3BR rentals across LA neighborhoods including Hollywood, Silver Lake, Koreatown, and Downtown LA. Rentorce matches you with pet-friendly and furnished options at your exact budget.",
    avgRent: "$1,100 – $1,700",
    neighborhoods: ["Hollywood", "Silver Lake", "Koreatown", "Downtown LA", "Culver City"],
    faqs: [
      { q: "What is the average rent in Los Angeles?", a: "Average rent in Los Angeles ranges from $1,100/mo for a 1-bedroom to $1,700+/mo for a 2-bedroom in popular neighborhoods." },
      { q: "Can I find furnished apartments in Los Angeles?", a: "Yes. Many LA rentals are fully furnished. Filter for furnished units in our apartment finder to see available options." },
      { q: "Is it easy to find a pet-friendly apartment in LA?", a: "LA has many pet-friendly buildings especially in suburban neighborhoods. Our matcher lets you filter specifically for buildings that allow dogs and cats." },
    ],
  },
  "chicago-il": {
    name: "Chicago", state: "Illinois", stateCode: "IL", zip: "60007",
    tagline: "Apartments for Rent in Chicago, IL",
    description: "Find your next apartment in Chicago, Illinois. From Wicker Park to Lincoln Park and the South Loop, Rentorce matches you with available 1-bedroom, 2-bedroom, and 3-bedroom rentals. Verified listings, real budgets.",
    avgRent: "$950 – $1,500",
    neighborhoods: ["Wicker Park", "Lincoln Park", "South Loop", "Logan Square", "Hyde Park"],
    faqs: [
      { q: "What is the average rent in Chicago?", a: "Chicago is one of the more affordable major US cities. Average rent ranges from $950/mo for 1-bedroom to $1,500/mo for a 2-bedroom in popular neighborhoods." },
      { q: "Are there apartments available immediately in Chicago?", a: "Yes, our database includes units available for immediate move-in. Select your preferred move-in date in the apartment finder." },
      { q: "What neighborhoods in Chicago are best for renters?", a: "Logan Square, Pilsen, and Bridgeport offer great value. Wicker Park and Lincoln Park are popular but pricier." },
    ],
  },
  "miami-fl": {
    name: "Miami", state: "Florida", stateCode: "FL", zip: "33130",
    tagline: "Apartments for Rent in Miami, FL",
    description: "Search for verified apartments in Miami, Florida. From Brickell to Wynwood and Little Havana, Rentorce connects renters with 1BR, 2BR, and 3BR units that match their exact budget, pet policy, and move-in timeline.",
    avgRent: "$1,100 – $1,650",
    neighborhoods: ["Brickell", "Wynwood", "Little Havana", "Coral Gables", "Coconut Grove"],
    faqs: [
      { q: "What is the average rent in Miami?", a: "Miami rents average $1,100–$1,650/mo depending on neighborhood. Brickell is premium while Little Havana offers more affordable options." },
      { q: "Are furnished apartments available in Miami?", a: "Yes, Miami has a large furnished apartment market, especially in Brickell and Wynwood. Our matcher filters for furnished units." },
      { q: "Is Miami a good city for pet owners renting apartments?", a: "Miami has many pet-friendly buildings. Many complexes allow dogs and cats, especially in suburban neighborhoods." },
    ],
  },
  "dallas-tx": {
    name: "Dallas", state: "Texas", stateCode: "TX", zip: "75201",
    tagline: "Apartments for Rent in Dallas, TX",
    description: "Find apartments in Dallas, Texas. Browse verified 1BR, 2BR, and 3BR rentals across Uptown, Deep Ellum, Oak Cliff, and the Design District. Rentorce matches your location and budget to available Dallas rentals in minutes.",
    avgRent: "$900 – $1,400",
    neighborhoods: ["Uptown", "Deep Ellum", "Oak Cliff", "Design District", "Knox/Henderson"],
    faqs: [
      { q: "What is the average rent in Dallas?", a: "Dallas is affordable compared to coastal cities. Expect $900–$1,400/mo for a 1-2 bedroom apartment in popular areas." },
      { q: "What neighborhoods in Dallas are best for young professionals?", a: "Uptown, Knox/Henderson, and the Design District are top picks for professionals due to walkability and dining options." },
      { q: "Are there 3-bedroom apartments available in Dallas under $1,500/mo?", a: "Yes, outer neighborhoods like Oak Cliff and Far North Dallas have 3-bedroom units in the $1,100–$1,500 range." },
    ],
  },
  "austin-tx": {
    name: "Austin", state: "Texas", stateCode: "TX", zip: "78701",
    tagline: "Apartments for Rent in Austin, TX",
    description: "Looking for an apartment in Austin, Texas? Browse verified rentals in East Austin, South Congress, Downtown, and Round Rock. Rentorce instantly matches your budget and bedroom count with available Austin apartments.",
    avgRent: "$1,000 – $1,600",
    neighborhoods: ["East Austin", "South Congress", "Downtown", "Mueller", "Round Rock"],
    faqs: [
      { q: "Is Austin expensive for renters?", a: "Austin rent has risen but remains lower than San Francisco or NYC. Expect $1,000–$1,600/mo for a 1-2 bedroom." },
      { q: "What are the best neighborhoods to rent in Austin?", a: "East Austin and Mueller are popular, walkable, and well-priced. South Congress has a vibrant culture but can be pricier." },
      { q: "Can I find pet-friendly apartments in Austin?", a: "Austin is very pet-friendly. Most apartment complexes allow dogs and cats, especially outside of Downtown." },
    ],
  },
  "houston-tx": {
    name: "Houston", state: "Texas", stateCode: "TX", zip: "77002",
    tagline: "Apartments for Rent in Houston, TX",
    description: "Find verified apartments in Houston, Texas. Search 1-bedroom, 2-bedroom, and 3-bedroom rentals in Midtown, The Heights, Montrose, and the Medical Center area. Rentorce matches your exact needs to available Houston inventory.",
    avgRent: "$850 – $1,350",
    neighborhoods: ["Midtown", "The Heights", "Montrose", "Museum District", "Energy Corridor"],
    faqs: [
      { q: "What is the average rent in Houston?", a: "Houston is one of the most affordable major US cities. Rent ranges from $850/mo for 1-bedroom to $1,350/mo for 2-bedroom in popular areas." },
      { q: "Is Houston good for families renting apartments?", a: "Yes, Houston has excellent 3-bedroom options in suburban areas. The Heights and Montrose are popular family neighborhoods." },
      { q: "Are there apartments with in-unit laundry in Houston?", a: "Many newer Houston apartment buildings include in-unit washer/dryer. Use our matcher to filter for this amenity." },
    ],
  },
  "atlanta-ga": {
    name: "Atlanta", state: "Georgia", stateCode: "GA", zip: "30301",
    tagline: "Apartments for Rent in Atlanta, GA",
    description: "Search verified apartments in Atlanta, Georgia. From Midtown and Virginia-Highland to West Midtown and Decatur, find 1BR, 2BR, and 3BR rentals matched to your exact budget through Rentorce.",
    avgRent: "$950 – $1,500",
    neighborhoods: ["Midtown", "Virginia-Highland", "West Midtown", "Decatur", "Old Fourth Ward"],
    faqs: [
      { q: "What is the average rent in Atlanta?", a: "Atlanta rentals average $950–$1,500/mo for a 1-2 bedroom, depending on proximity to Downtown and Midtown." },
      { q: "What is the best neighborhood to rent in Atlanta?", a: "Old Fourth Ward and West Midtown are top picks for young professionals. Virginia-Highland is popular for families." },
      { q: "Are there furnished apartments in Atlanta for short-term stays?", a: "Yes, Atlanta has a range of furnished units especially in Midtown. Our matcher can filter by furnished status." },
    ],
  },
  "seattle-wa": {
    name: "Seattle", state: "Washington", stateCode: "WA", zip: "98101",
    tagline: "Apartments for Rent in Seattle, WA",
    description: "Find apartments for rent in Seattle, Washington. Browse verified 1BR, 2BR, and 3BR units in Capitol Hill, Ballard, South Lake Union, and Fremont. Rentorce matches Seattle renters with available inventory at their exact budget.",
    avgRent: "$1,200 – $1,800",
    neighborhoods: ["Capitol Hill", "Ballard", "South Lake Union", "Fremont", "Belltown"],
    faqs: [
      { q: "What is the average rent in Seattle?", a: "Seattle rent averages $1,200–$1,800/mo for a 1-2 bedroom. South Lake Union and Capitol Hill are on the higher end." },
      { q: "Is Seattle pet-friendly for apartment renters?", a: "Seattle is generally pet-friendly. Many Capitol Hill and Ballard buildings welcome cats and dogs." },
      { q: "Are there affordable neighborhoods in Seattle?", a: "Rainier Valley, White Center, and Burien are more affordable alternatives near Seattle." },
    ],
  },
  "denver-co": {
    name: "Denver", state: "Colorado", stateCode: "CO", zip: "80202",
    tagline: "Apartments for Rent in Denver, CO",
    description: "Search for apartments in Denver, Colorado. Find verified 1-bedroom, 2-bedroom, and 3-bedroom rentals in RiNo, Capitol Hill, Cherry Creek, and LoDo. Rentorce matches your Denver apartment search to real available inventory.",
    avgRent: "$1,050 – $1,600",
    neighborhoods: ["RiNo", "Capitol Hill", "Cherry Creek", "LoDo", "Baker"],
    faqs: [
      { q: "What is the average rent in Denver?", a: "Denver rent averages $1,050–$1,600/mo for a 1-2 bedroom. RiNo and Cherry Creek are premium; Capitol Hill is more affordable." },
      { q: "Are there pet-friendly apartments in Denver?", a: "Yes, Denver is extremely pet-friendly. Most apartment buildings in the city allow dogs and cats." },
      { q: "Is Denver a good place to rent an apartment?", a: "Denver offers a great quality of life with outdoor access. It is popular with young professionals, with strong rental demand." },
    ],
  },
  "phoenix-az": {
    name: "Phoenix", state: "Arizona", stateCode: "AZ", zip: "85001",
    tagline: "Apartments for Rent in Phoenix, AZ",
    description: "Find apartments for rent in Phoenix, Arizona. Discover 1-bedroom, 2-bedroom, and 3-bedroom rentals across Scottsdale, Tempe, Chandler, and Downtown Phoenix with Rentorce's intelligent rental matching system.",
    avgRent: "$900 – $1,400",
    neighborhoods: ["Scottsdale", "Tempe", "Chandler", "Downtown Phoenix", "Ahwatukee"],
    faqs: [
      { q: "What is the average rent in Phoenix?", a: "Phoenix is one of the most affordable large cities. Rent averages $900–$1,400/mo for a 1-2 bedroom apartment." },
      { q: "What neighborhoods in Phoenix are best for young professionals?", a: "Downtown Phoenix and Scottsdale are popular. Tempe is great for those near ASU campus." },
      { q: "Are there apartments with pools in Phoenix?", a: "Yes, most Phoenix apartment complexes have pools due to the desert climate. Use our amenity filter to find them." },
    ],
  },
  "philadelphia-pa": {
    name: "Philadelphia", state: "Pennsylvania", stateCode: "PA", zip: "19103",
    tagline: "Apartments for Rent in Philadelphia, PA",
    description: "Search verified apartments in Philadelphia, Pennsylvania. Browse 1BR, 2BR, and 3BR rentals in Center City, Fishtown, South Philly, and Manayunk. Rentorce matches Philadelphia renters with available inventory at their exact budget.",
    avgRent: "$950 – $1,500",
    neighborhoods: ["Center City", "Fishtown", "South Philly", "Manayunk", "Northern Liberties"],
    faqs: [
      { q: "What is the average rent in Philadelphia?", a: "Philadelphia offers great value. Rent averages $950–$1,500/mo for a 1-2 bedroom, much lower than NYC or DC." },
      { q: "Is Philadelphia a good city to rent in?", a: "Philadelphia has one of the best value-for-money rental markets on the East Coast, with great neighborhoods and public transit." },
      { q: "What are the safest neighborhoods to rent in Philadelphia?", a: "Center City, Rittenhouse Square, and Manayunk are considered among the safest and most desirable rental areas." },
    ],
  },
};

interface Props { params: Promise<{ city: string }>; }

export async function generateStaticParams() {
  return Object.keys(CITY_DATA).map((city) => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const data = CITY_DATA[city];
  if (!data) return { title: "Apartments for Rent | Rentorce" };
  const title = `Apartments for Rent in ${data.name}, ${data.stateCode} | 1BR, 2BR, 3BR — Rentorce`;
  const description = `Find verified 1-bedroom, 2-bedroom, and 3-bedroom apartments for rent in ${data.name}, ${data.stateCode}. Average rent ${data.avgRent}/mo. Pet-friendly and furnished options available. Instant matching — no signup required.`;
  const canonicalUrl = `${BASE_URL}/apartments/location/${city}`;
  return {
    title, description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, siteName: "Rentorce", images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: `Apartments in ${data.name}` }], locale: "en_US", type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [`${BASE_URL}/og-image.png`] },
  };
}

export default async function CityLandingPage({ params }: Props) {
  const { city } = await params;
  const data = CITY_DATA[city];
  if (!data) notFound();

  const allApartments = await getApartments({ isActive: true });
  const sampleApartments = allApartments.slice(0, 6);

  const citySchema = {
    "@context": "https://schema.org", "@type": "RealEstateAgent",
    name: `Rentorce — ${data.name} Apartments`,
    description: data.description,
    url: `${BASE_URL}/apartments/location/${city}`,
    areaServed: { "@type": "City", name: data.name, containedInPlace: { "@type": "State", name: data.state } },
    serviceType: "Apartment Rental Matching", priceRange: data.avgRent,
  };

  const categories = [
    { label: "1 Bed / 1 Bath" }, { label: "2 Bed / 1 Bath" }, { label: "2 Bed / 2 Bath" },
    { label: "3 Bed / 1 Bath" }, { label: "3 Bed / 2 Bath" }, { label: "3 Bed / 3 Bath" },
  ];

  const locationParam = encodeURIComponent(`${data.name}, ${data.stateCode} ${data.zip}`);

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(citySchema) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold uppercase tracking-widest mb-4">
            <MapPin className="w-3.5 h-3.5" /><span>{data.name}, {data.stateCode}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Apartments for Rent in<br /><span className="text-blue-400">{data.name}, {data.stateCode}</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed mb-8">{data.description}</p>
          <div className="flex flex-wrap gap-3 mb-8">
            {[`Avg Rent: ${data.avgRent}/mo`, "Pet-Friendly Options", "Furnished Available", "Instant Matching"].map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold border border-white/20">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> {tag}
              </span>
            ))}
          </div>
          <Link href={`/find-apartment?location=${locationParam}`} className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg text-sm">
            Find My Apartment in {data.name} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Category Chips */}
      <section className="bg-slate-50 border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Browse by Apartment Type</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link key={cat.label} href={`/find-apartment?location=${locationParam}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 bg-white hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50 text-slate-700 text-xs font-semibold transition">
                <BedDouble className="w-3 h-3" /> {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Apartment Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Available Apartments in {data.name}</h2>
              <p className="text-slate-500 text-sm mt-1">Units calibrated to your exact budget and bedroom count.</p>
            </div>
            <Link href={`/find-apartment?location=${locationParam}`} className="hidden sm:inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold text-sm transition">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sampleApartments.map((apt) => (
              <Link key={apt._id || apt.id} href={`/find-apartment?location=${locationParam}`} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  {apt.images?.[0] ? (
                    <Image src={apt.images[0]} alt={`${apt.bedrooms} Bed ${apt.bathrooms} Bath Apartment in ${data.name}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200"><Building2 className="w-10 h-10 text-slate-400" /></div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-black shadow">From ${apt.baseRent}/mo</div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 text-xs text-slate-500 mb-1.5"><MapPin className="w-3 h-3 text-blue-500" /><span>{data.name}, {data.stateCode}</span></div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition mb-2 line-clamp-1">{apt.bedrooms} Bed {apt.bathrooms} Bath Apartment</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-600 mt-auto pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-0.5"><BedDouble className="w-3 h-3 text-blue-500" /> {apt.bedrooms} Bed</span>
                    <span className="flex items-center gap-0.5"><Bath className="w-3 h-3 text-blue-500" /> {apt.bathrooms} Bath</span>
                    <span className="ml-auto text-blue-600 font-bold">View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href={`/find-apartment?location=${locationParam}`} className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition shadow-lg text-sm">
              Get My Matched {data.name} Apartments <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-slate-400 mt-3">Takes 2 minutes · No signup required</p>
          </div>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-black text-slate-900 mb-4">Popular Neighborhoods in {data.name}</h2>
          <div className="flex flex-wrap gap-2">
            {data.neighborhoods.map((n) => (
              <span key={n} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700">{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-8">Frequently Asked Questions — Renting in {data.name}</h2>
          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <h2 className="text-2xl sm:text-3xl font-black mb-3">Ready to find your apartment in {data.name}?</h2>
        <p className="text-blue-100 mb-6 max-w-md mx-auto text-sm">Answer 8 quick questions and our algorithm matches you with available {data.name} rentals calibrated to your exact budget.</p>
        <Link href={`/find-apartment?location=${locationParam}`} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-black rounded-2xl hover:bg-blue-50 transition shadow-xl text-sm">
          Start Free Apartment Match <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
