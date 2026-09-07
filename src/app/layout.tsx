import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://apartmento.us"),
  title: "Apartmento — Find Verified USA Apartments For Rent | 1B, 2B, 3B Rentals",
  description:
    "Find your next USA apartment with Apartmento. Verified 1-bed, 2-bed, and 3-bed apartments tailored to your exact city, ZIP code, pet policies, and budget from $800 to $1,800/month.",
  keywords: [
    "apartments for rent",
    "1 bedroom apartment",
    "2 bedroom apartment",
    "3 bedroom apartment",
    "affordable apartments USA",
    "pet friendly apartments",
    "rental finder",
    "apartments in New York",
    "apartments in Chicago",
  ],
  authors: [{ name: "Apartmento Team" }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/apartmento-full-logo.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Apartmento — Smart USA Apartment Rental Finder",
    description:
      "Match with verified 1, 2, and 3-bedroom rental properties across the USA in under 2 minutes. Free matching for renters.",
    url: "https://apartmento.us",
    siteName: "Apartmento",
    images: [
      {
        url: "/site-logo.png",
        width: 1200,
        height: 600,
        alt: "Apartmento — Find Your Next Home",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apartmento — Smart USA Apartment Finder",
    description:
      "Match with verified 1, 2, and 3-bedroom apartments tailored to your exact budget and location.",
    images: ["/site-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Apartmento",
    description: "USA Apartment Rental Matcher and Qualified Renter Lead Generation",
    url: "https://apartmento.us",
    priceRange: "$800 - $1800",
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    serviceType: [
      "Apartment Rental Matching",
      "Leasing Assistance",
      "Pet-Friendly Rentals",
      "Furnished Apartments",
    ],
  };

  return (
    <html lang="en" className="h-full antialiased font-sans">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
