"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ShieldCheck, Heart, MapPin, Mail, Phone } from "lucide-react";

const DEFAULT_SUPPORT_EMAIL = "leasing@rentorce.com";
const DEFAULT_SUPPORT_PHONE = "+1 (800) 492-7836";

export default function Footer() {
  const pathname = usePathname();
  const [supportEmail, setSupportEmail] = useState(DEFAULT_SUPPORT_EMAIL);
  const [supportPhone, setSupportPhone] = useState(DEFAULT_SUPPORT_PHONE);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        if (isMounted && data?.success && data?.stats) {
          if (data.stats.supportEmail) {
            setSupportEmail(data.stats.supportEmail);
          }
          if (data.stats.supportPhone) {
            setSupportPhone(data.stats.supportPhone);
          }
        }
      } catch (_) {}
    };

    loadStats();

    const handleUpdate = () => {
      loadStats();
    };
    window.addEventListener("rentorce_stats_updated", handleUpdate);
    window.addEventListener("apartmento_stats_updated", handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("rentorce_stats_updated", handleUpdate);
      window.removeEventListener("apartmento_stats_updated", handleUpdate);
    };
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="bg-slate-50 text-slate-600 text-sm border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group py-1">
              <Image
                src="/fulllogo.svg"
                alt="Rentorce — Find Your Next Home"
                width={200}
                height={59}
                className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              />
            </Link>
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
              Rentorce is America’s premier smart apartment rental finder. We match qualified renters with verified 1-bed, 2-bed, and 3-bed apartments tailored to your exact budget and neighborhood in seconds.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Property Network
              </span>
              <span>•</span>
              <span>Equal Housing Partner</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-slate-900 font-bold text-sm mb-4">Apartment Types</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/find-apartment" className="text-slate-600 hover:text-blue-600 transition">
                  1 Bed / 1 Bath Rentals
                </Link>
              </li>
              <li>
                <Link href="/find-apartment" className="text-slate-600 hover:text-blue-600 transition">
                  2 Bed / 2 Bath Rentals
                </Link>
              </li>
              <li>
                <Link href="/find-apartment" className="text-slate-600 hover:text-blue-600 transition">
                  3 Bed / 2 Bath Family Units
                </Link>
              </li>
              <li>
                <Link href="/find-apartment" className="text-slate-600 hover:text-blue-600 transition">
                  3 Bed / 3 Bath Luxury Suites
                </Link>
              </li>
              <li>
                <Link href="/find-apartment" className="text-slate-600 hover:text-blue-600 transition">
                  Pet Friendly Apartments
                </Link>
              </li>
              <li>
                <Link href="/find-apartment" className="text-slate-600 hover:text-blue-600 transition">
                  Furnished Loft Units
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h4 className="text-slate-900 font-bold text-sm mb-4">Top Rental Markets</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/apartments/location/new-york-ny" className="text-slate-600 hover:text-blue-600 transition">
                  New York, NY Apartments
                </Link>
              </li>
              <li>
                <Link href="/apartments/location/los-angeles-ca" className="text-slate-600 hover:text-blue-600 transition">
                  Los Angeles, CA Apartments
                </Link>
              </li>
              <li>
                <Link href="/apartments/location/chicago-il" className="text-slate-600 hover:text-blue-600 transition">
                  Chicago, IL Apartments
                </Link>
              </li>
              <li>
                <Link href="/apartments/location/miami-fl" className="text-slate-600 hover:text-blue-600 transition">
                  Miami, FL Apartments
                </Link>
              </li>
              <li>
                <Link href="/apartments/location/dallas-tx" className="text-slate-600 hover:text-blue-600 transition">
                  Dallas, TX Apartments
                </Link>
              </li>
              <li>
                <Link href="/apartments/location/austin-tx" className="text-slate-600 hover:text-blue-600 transition">
                  Austin, TX Apartments
                </Link>
              </li>
            </ul>
          </div>

          {/* Renter Guides */}
          <div>
            <h4 className="text-slate-900 font-bold text-sm mb-4">Renter Guides</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/guides/how-to-rent-apartment-usa" className="text-slate-600 hover:text-blue-600 transition">
                  How to Rent in the USA
                </Link>
              </li>
              <li>
                <Link href="/guides/pet-friendly-apartments-guide" className="text-slate-600 hover:text-blue-600 transition">
                  Pet-Friendly Apartments Guide
                </Link>
              </li>
              <li>
                <Link href="/guides/apartment-hunting-checklist" className="text-slate-600 hover:text-blue-600 transition">
                  Apartment Hunting Checklist
                </Link>
              </li>
              <li>
                <Link href="/guides/1-bedroom-vs-2-bedroom-apartment" className="text-slate-600 hover:text-blue-600 transition">
                  1BR vs 2BR Comparison
                </Link>
              </li>
              <li>
                <Link href="/guides/furnished-vs-unfurnished-apartment" className="text-slate-600 hover:text-blue-600 transition">
                  Furnished vs Unfurnished
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-blue-600 hover:text-blue-700 font-semibold transition">
                  All Renter Guides →
                </Link>
              </li>
            </ul>
          </div>


          {/* Contact / Portal */}
          <div>
            <h4 className="text-slate-900 font-bold text-sm mb-4">Contact & Support</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <a
                  href={`mailto:${supportEmail}`}
                  className="hover:text-blue-600 transition truncate"
                  title="Contact Leasing Support Email"
                >
                  {supportEmail}
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <a
                  href={`tel:${supportPhone.replace(/[^0-9+]/g, "")}`}
                  className="hover:text-blue-600 transition"
                  title="Call Leasing Support Hotline"
                >
                  {supportPhone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Rentorce Platform Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-slate-900 transition">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-slate-900 transition">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-slate-900 transition">
              Equal Housing Opportunity
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
