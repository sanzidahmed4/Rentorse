"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, PhoneCall, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    setMobileMenuOpen(false);

    if (pathname === "/") {
      e.preventDefault();

      if (targetId === "home" || targetId === "top") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        window.history.pushState(null, "", "/");
        return;
      }

      const element = document.getElementById(targetId);
      if (element) {
        const navOffset = 76;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const offsetPosition = elementRect - bodyRect - navOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth",
        });
        window.history.pushState(null, "", `/#${targetId}`);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const targetId = window.location.hash.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        const timer = setTimeout(() => {
          const navOffset = 76;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = elem.getBoundingClientRect().top;
          const offsetPosition = elementRect - bodyRect - navOffset;
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: "smooth",
          });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/98 border-b border-slate-100 shadow-xs">

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => handleScrollTo(e, "home")}
            className="flex items-center group py-1"
          >
            <Image
              src="/fulllogo.svg"
              alt="Rentorce — Find Your Next Home"
              width={200}
              height={59}
              className="h-9 sm:h-[42px] md:h-[46px] w-auto object-contain transition-transform group-hover:scale-[1.02]"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              onClick={(e) => handleScrollTo(e, "home")}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition cursor-pointer"
            >
              Home
            </Link>
            <Link
              href="/#how-it-works"
              onClick={(e) => handleScrollTo(e, "how-it-works")}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition cursor-pointer"
            >
              Guides
            </Link>
            <Link
              href="/#testimonials"
              onClick={(e) => handleScrollTo(e, "testimonials")}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition cursor-pointer"
            >
              Reviews
            </Link>
            <Link
              href="/#faq"
              onClick={(e) => handleScrollTo(e, "faq")}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition cursor-pointer"
            >
              FAQs
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/find-apartment"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 transition active:scale-95"
            >
              Find Your Apartment
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/find-apartment"
              className="px-3.5 py-1.5 rounded-full bg-blue-600 text-white text-xs font-semibold"
            >
              Find Apartment
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-3 space-y-1 text-sm font-medium text-slate-700">
          <Link
            href="/"
            onClick={(e) => handleScrollTo(e, "home")}
            className="block py-2 px-3 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            Home
          </Link>
          <Link
            href="/#how-it-works"
            onClick={(e) => handleScrollTo(e, "how-it-works")}
            className="block py-2 px-3 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            Guides
          </Link>
          <Link
            href="/#testimonials"
            onClick={(e) => handleScrollTo(e, "testimonials")}
            className="block py-2 px-3 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            Reviews
          </Link>
          <Link
            href="/#faq"
            onClick={(e) => handleScrollTo(e, "faq")}
            className="block py-2 px-3 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            Frequently Asked Questions
          </Link>
        </div>
      )}
    </header>
  );
}
