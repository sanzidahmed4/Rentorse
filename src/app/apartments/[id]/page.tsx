import { getApartmentByIdOrSlug, getApartments } from "@/lib/store";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ApartmentTourCTA from "@/components/booking/ApartmentTourCTA";
import ApartmentUnlockBanner from "@/components/apartments/ApartmentUnlockBanner";
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

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const apts = await getApartments({ isActive: true });
  return apts.map((a) => ({ id: a.slug || a.id || a._id }));
}

export default async function ApartmentDetailPage({ params }: Props) {
  const { id } = await params;
  const apt = await getApartmentByIdOrSlug(id);

  if (!apt) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/results"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Matched Results
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
              Verified Unit
            </span>
          </div>
        </div>

        {/* Pre-Qualification & Tour Unlock Status Banner */}
        <ApartmentUnlockBanner apartment={apt} />

        {/* Title & Price Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
              <span>{apt.category} Model</span>
              <span>•</span>
              <span>Ready for Move-In ({apt.availableDate})</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{apt.title}</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              {apt.addressTemplate || "United States Metropolitan Area"}
            </p>
          </div>

          <div className="flex items-baseline gap-2 bg-blue-50/60 p-4 rounded-2xl border border-blue-100">
            <span className="text-3xl sm:text-4xl font-black text-blue-600">${apt.baseRent}</span>
            <span className="text-xs font-medium text-slate-500">/ month</span>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-sm">
            <Image
              src={apt.images[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"}
              alt={apt.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-rows-2 gap-4 h-72 sm:h-96">
            <div className="relative rounded-2xl overflow-hidden shadow-sm">
              <Image
                src={apt.images[1] || apt.images[0]}
                alt={`${apt.title} interior`}
                fill
                className="object-cover"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-sm">
              <Image
                src={apt.images[2] || apt.images[0]}
                alt={`${apt.title} layout`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Details & Inquire Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Specs */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-2xl bg-slate-50">
                <BedDouble className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                <span className="block text-base font-bold text-slate-900">{apt.bedrooms} Bed</span>
                <span className="text-xs text-slate-500">Bedrooms</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50">
                <Bath className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                <span className="block text-base font-bold text-slate-900">{apt.bathrooms} Bath</span>
                <span className="text-xs text-slate-500">Bathrooms</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50">
                <Maximize2 className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                <span className="block text-base font-bold text-slate-900">{apt.squareFeet}</span>
                <span className="text-xs text-slate-500">Square Feet</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-slate-900">About This Home</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{apt.description}</p>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
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

          {/* Sidebar CTA Card */}
          <div className="space-y-6">
            <div id="leasing-overview-sidebar" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl space-y-5 sticky top-24">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Leasing Overview
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  ${apt.baseRent} <span className="text-xs font-normal text-slate-500">/ mo</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Application Fee:</span>
                  <span className="font-bold text-emerald-600">$0 (Waived Online)</span>
                </div>
                <div className="flex justify-between">
                  <span>Lease Terms:</span>
                  <span className="font-medium text-slate-800">12 Months (Flexible)</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Deposit:</span>
                  <span className="font-bold text-emerald-600">Not Required</span>
                </div>
              </div>

              <ApartmentTourCTA apartment={apt} />

              <Link
                href="/find-apartment"
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-2 text-center"
              >
                Find Similar in My ZIP
              </Link>

              <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Equal Housing Opportunity Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
