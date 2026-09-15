import { getApartmentByIdOrSlug, getApartments } from "@/lib/store";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { IApartment } from "@/types";
import { cleanStreetOrIntersection } from "@/lib/us-locations";
import ApartmentTourCTA from "@/components/booking/ApartmentTourCTA";
import ApartmentPhotoGallery from "@/components/apartments/ApartmentPhotoGallery";
import {
  BedDouble,
  Bath,
  Maximize2,
  Check,
  ShieldCheck,
  Calendar,
  ArrowLeft,
  Share2,
  Heart,
  PawPrint,
  Utensils,
  MapPin,
} from "lucide-react";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://apartmento-ten.vercel.app");

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    loc?: string;
    from?: string;
    beds?: string;
    baths?: string;
    rent?: string;
  }>;
}

export async function generateStaticParams() {
  const apts = await getApartments({ isActive: true });
  return apts.map((a) => ({ id: a.slug || a.id || a._id }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  const sp = searchParams ? await searchParams : {};
  const apt = await getApartmentByIdOrSlug(id);

  if (!apt) {
    return {
      title: "Apartment Not Found | Rentorce",
      description: "The apartment you are looking for is no longer available. Browse other verified USA rentals on Rentorce.",
    };
  }

  const beds = sp.beds ? Number(sp.beds) : apt.bedrooms;
  const baths = sp.baths ? Number(sp.baths) : apt.bathrooms;
  const rent = sp.rent ? Number(sp.rent) : apt.baseRent;

  // Derive city from location fields
  const rawLocation =
    sp.loc
      ? decodeURIComponent(sp.loc)
      : apt.displayLocation || apt.cityState || apt.addressTemplate || "";
  const locationParts = rawLocation.split(",").map((p) => p.trim());
  const cityDisplay = locationParts.length >= 2
    ? locationParts.slice(-2).join(", ")
    : rawLocation || "USA";

  // Dynamic title: "2 Bed 1 Bath Apartment in Los Angeles, CA | From $950/mo — Rentorce"
  const dynamicTitle = `${beds} Bed ${baths} Bath Apartment in ${cityDisplay} | From $${rent}/mo — Rentorce`;

  // Dynamic description: first 145 chars of description + key attributes
  const descSnippet = apt.description.replace(/\s+/g, " ").slice(0, 140).trim();
  const amenitiesSnippet = apt.amenities.slice(0, 3).join(", ");
  const dynamicDesc = `${descSnippet}... ${beds}-bedroom, ${baths}-bathroom rental in ${cityDisplay}. ${apt.furnished} | ${amenitiesSnippet}. From $${rent}/mo. Schedule a tour today.`;

  const ogImage = apt.images?.[0] || `${BASE_URL}/og-image.png`;
  const canonicalUrl = `${BASE_URL}/apartments/${apt.slug || id}`;

  return {
    title: dynamicTitle,
    description: dynamicDesc.slice(0, 160),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: dynamicTitle,
      description: `${beds} Bed / ${baths} Bath | ${cityDisplay} | From $${rent}/mo. ${apt.furnished}. ${amenitiesSnippet}.`,
      url: canonicalUrl,
      siteName: "Rentorce",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${beds} Bed ${baths} Bath Apartment in ${cityDisplay} — Rentorce`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dynamicTitle,
      description: `${beds} Bed / ${baths} Bath in ${cityDisplay} | From $${rent}/mo. Available now on Rentorce.`,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ApartmentDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = searchParams ? await searchParams : {};
  const queryLoc = sp.loc ? decodeURIComponent(sp.loc) : null;
  const isFromHome = sp.from === "home";
  const apt = await getApartmentByIdOrSlug(id);

  if (!apt) {
    notFound();
  }

  const effectiveBedrooms = sp.beds ? Number(sp.beds) : apt.bedrooms;
  const effectiveBathrooms = sp.baths ? Number(sp.baths) : apt.bathrooms;
  const effectiveRent = sp.rent ? Number(sp.rent) : apt.baseRent;
  const effectiveCategory = `${effectiveBedrooms}B${effectiveBathrooms}B` as any;

  const effectiveLocation = cleanStreetOrIntersection(
    queryLoc?.trim() ||
    apt.displayLocation?.trim() ||
    apt.cityState?.trim() ||
    (apt.addressTemplate?.includes(",")
      ? apt.addressTemplate.split(",").slice(-2).join(",").trim()
      : "Philadelphia, PA")
  );

  let effectiveDescription = apt.description;
  effectiveDescription = effectiveDescription
    .replace(/\b\d+B\/\d+B\b/gi, `${effectiveBedrooms}B/${effectiveBathrooms}B`)
    .replace(/\b\d+\s*Bed\s*\/\s*\d+\s*Bath\b/gi, `${effectiveBedrooms} Bed / ${effectiveBathrooms} Bath`)
    .replace(/\b(one|two|three|\d+)-bedroom,\s*(one|two|three|\d+)-bathroom\b/gi, `${effectiveBedrooms}-bedroom, ${effectiveBathrooms}-bathroom`);

  if (effectiveBathrooms === 1) {
    effectiveDescription = effectiveDescription
      .replace(/two\s*bathrooms|three\s*bathrooms|three\s*lavish\s*full\s*bathrooms/gi, "one full bathroom")
      .replace(/dual\s*master|triple\s*master/gi, "spacious master")
      .replace(/dual\s*vanities|double\s*vanity|double\s*sink\s*vanities/gi, "designer vanity")
      .replace(/every\s*single\s*bedroom\s*has\s*its\s*own\s*private\s*ensuite\s*bathroom/gi, "convenient central bathroom layout")
      .replace(/each\s*bedroom\s*with\s*en-suite\s*bath/gi, "central bathroom layout")
      .replace(/marble\s*bathrooms/gi, "designer marble bathroom");
  } else if (effectiveBathrooms === 2) {
    effectiveDescription = effectiveDescription
      .replace(/three\s*bathrooms|three\s*lavish\s*full\s*bathrooms|one\s*bathroom/gi, "two full bathrooms")
      .replace(/triple\s*master/gi, "dual master")
      .replace(/every\s*single\s*bedroom\s*has\s*its\s*own\s*private\s*ensuite\s*bathroom/gi, "private master suite plus guest bath")
      .replace(/each\s*bedroom\s*with\s*en-suite\s*bath/gi, "master ensuite and hallway bath");
  } else if (effectiveBathrooms === 3) {
    effectiveDescription = effectiveDescription
      .replace(/one\s*bathroom|two\s*bathrooms/gi, "three full bathrooms");
  }

  let effectiveTitle = apt.title;
  if (effectiveTitle.includes("3B/2B") || effectiveTitle.includes("3B/3B")) {
    effectiveTitle = effectiveTitle.replace(/\s*3B\/[23]B/g, ` ${effectiveBedrooms}B/${effectiveBathrooms}B`);
  } else if (effectiveTitle.includes("2B/2B")) {
    effectiveTitle = effectiveTitle.replace(/\s*2B\/2B/g, ` ${effectiveBedrooms}B/${effectiveBathrooms}B`);
  }

  const effectiveApartment: IApartment = {
    ...apt,
    title: effectiveTitle,
    category: effectiveCategory,
    bedrooms: effectiveBedrooms,
    bathrooms: effectiveBathrooms,
    baseRent: effectiveRent,
    displayRent: effectiveRent,
    displayLocation: effectiveLocation,
    addressTemplate: effectiveLocation,
    description: effectiveDescription,
  };

  // Build Apartment JSON-LD schema for Google Rich Results
  const apartmentSchema = {
    "@context": "https://schema.org",
    "@type": "Apartment",
    name: effectiveApartment.title,
    description: effectiveApartment.description.slice(0, 300),
    url: `${BASE_URL}/apartments/${apt.slug || id}`,
    image: apt.images?.[0] || `${BASE_URL}/site-logo.png`,
    numberOfRooms: effectiveApartment.bedrooms,
    numberOfBathroomsTotal: effectiveApartment.bathrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: effectiveApartment.squareFeet,
      unitCode: "FTK",
    },
    petsAllowed: apt.petPolicy !== "No Pets",
    address: {
      "@type": "PostalAddress",
      streetAddress: effectiveLocation,
      addressCountry: "US",
    },
    offers: {
      "@type": "Offer",
      price: effectiveRent,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: effectiveRent,
        priceCurrency: "USD",
        referenceQuantity: {
          "@type": "QuantitativeValue",
          value: 1,
          unitCode: "MON",
        },
      },
    },
    amenityFeature: apt.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
    provider: {
      "@type": "RealEstateAgent",
      name: "Rentorce",
      url: BASE_URL,
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Apartment JSON-LD Schema for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(apartmentSchema) }}
      />
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href={isFromHome ? "/" : "/results"}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> {isFromHome ? "Back to Home" : "Back to Matched Results"}
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
              Verified Unit
            </span>
          </div>
        </div>

        {/* Interactive Photo Gallery Grid with +N Overlay & Lightbox */}
        <ApartmentPhotoGallery images={apt.images} title={apt.title} />

        {/* Details & Inquire Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Specs */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-2xl bg-slate-50">
                <BedDouble className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                <span className="block text-base font-bold text-slate-900">{effectiveApartment.bedrooms} Bed</span>
                <span className="text-xs text-slate-500">Bedrooms</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50">
                <Bath className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                <span className="block text-base font-bold text-slate-900">{effectiveApartment.bathrooms} Bath</span>
                <span className="text-xs text-slate-500">Bathrooms</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50">
                <Maximize2 className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                <span className="block text-base font-bold text-slate-900">{effectiveApartment.squareFeet}</span>
                <span className="text-xs text-slate-500">Square Feet</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-slate-900">About This Home</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{effectiveApartment.description}</p>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Property Type:</span>
                  <span className="font-semibold text-slate-800">{apt.propertyType || "Apartment"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Climate Control:</span>
                  <span className="font-semibold text-slate-800">
                    {apt.climate ||
                      (apt.cooling && apt.heating
                        ? `${apt.cooling} & ${apt.heating}`
                        : apt.cooling || apt.heating || "Central AC & Heating")}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Laundry:</span>
                  <span className="font-semibold text-slate-800">{apt.laundry || "In-unit laundry"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Parking:</span>
                  <span className="font-semibold text-slate-800">{apt.parking || "Street parking"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Furnishing:</span>
                  <span className="font-semibold text-slate-800">{apt.furnished}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Kitchen:</span>
                  <span className="font-semibold text-slate-800">
                    {apt.hasKitchen ? "Full Chef's Kitchen" : "Kitchenette"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Security Deposit:</span>
                  <span className="font-semibold text-emerald-600">Not Required</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Pet Policy:</span>
                  <span className="font-semibold text-slate-800">{apt.petPolicy}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Available Date:</span>
                  <span className="font-semibold text-slate-800">{apt.availableDate}</span>
                </div>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Features & Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {apt.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-700"
                  >
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar CTA & Location Column */}
          <div className="space-y-4 lg:sticky lg:top-6">
            <div id="leasing-overview-sidebar" className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-xl space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Leasing Overview
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  ${effectiveApartment.baseRent} <span className="text-xs font-normal text-slate-500">/ mo</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Application Fee:</span>
                  <span className="font-bold text-emerald-600">$0 (Waived Online)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Lease Terms:</span>
                  <span className="font-medium text-slate-800">12 Months (Flexible)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Security Deposit:</span>
                  <span className="font-bold text-emerald-600">Not Required</span>
                </div>

                <div className="pt-2.5 border-t border-slate-100 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Furnished Status:</span>
                    <span className="font-bold text-slate-800">{apt.furnished || "Unfurnished"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category Layout:</span>
                    <span className="font-bold text-slate-800">
                      {effectiveApartment.category?.replace(/(\d+B)(\d+B)/i, "$1/$2") || effectiveApartment.category}
                    </span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Unit Type:</span>
                    <span className="font-semibold text-slate-800">{apt.propertyType || "Apartment"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Climate Control:</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {apt.climate ||
                        (apt.cooling && apt.heating
                          ? `${apt.cooling} & ${apt.heating}`
                          : apt.cooling || apt.heating || "Central AC & Heating")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Laundry:</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {apt.laundry || "In-unit laundry"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Parking:</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {apt.parking || "Street parking"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500 shrink-0">Location:</span>
                    <span className="font-semibold text-blue-600 text-right truncate">
                      {apt.addressTemplate?.trim() || effectiveLocation}
                    </span>
                  </div>
                </div>
              </div>

              <ApartmentTourCTA apartment={effectiveApartment} />

              <Link
                href="/find-apartment"
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-2 text-center"
              >
                Find Similar in My ZIP
              </Link>

              <div className="pt-1 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Equal Housing Opportunity Guarantee</span>
              </div>
            </div>

            {/* Compact Rental Location (Google Map) - Right Below Leasing Overview */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Rental Location</span>
              </div>

              {/* Compact Map Canvas with Circular Boundary */}
              <div className="relative w-full h-36 sm:h-40 rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-100 shadow-inner">
                <iframe
                  title="Rental approximate area map"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0 filter saturate-95 brightness-95"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    effectiveLocation
                  )}&t=m&z=13&ie=UTF8&iwloc=&output=embed`}
                />

                {/* Circular Shaded Radius Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-blue-600/40 bg-blue-500/15 shadow-sm pointer-events-none backdrop-blur-[0.5px]" />
                </div>
              </div>

              {/* Area Info Below Map */}
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {effectiveLocation}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Location is approximate. Exact address provided upon scheduling a tour.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
