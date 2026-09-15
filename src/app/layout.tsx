import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://rentorce.com"),
  title: "Rentorce — Find Verified USA Apartments For Rent | 1B, 2B, 3B Rentals",
  description:
    "Find your next USA apartment with Rentorce. Verified 1-bed, 2-bed, and 3-bed apartments tailored to your exact city, ZIP code, pet policies, and budget from $800 to $1,800/month.",
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
  authors: [{ name: "Rentorce Team" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: [
      { url: "/favicon.svg" },
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Rentorce — Smart USA Apartment Rental Finder",
    description:
      "Match with verified 1, 2, and 3-bedroom rental properties across the USA in under 2 minutes. Free matching for renters.",
    url: "https://rentorce.com",
    siteName: "Rentorce",
    images: [
      {
        url: "/fulllogo.svg",
        width: 1200,
        height: 600,
        alt: "Rentorce — Find Your Next Home",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rentorce — Smart USA Apartment Finder",
    description:
      "Match with verified 1, 2, and 3-bedroom apartments tailored to your exact budget and location.",
    images: ["/fulllogo.svg"],
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
  const jsonLd = [
    // WebSite schema with SearchAction → enables Google Sitelinks Search Box
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Rentorce",
      url: "https://rentorce.com",
      description: "USA Apartment Rental Matching Platform — find verified 1BR, 2BR, and 3BR apartments nationwide.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://rentorce.com/find-apartment?location={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    // LocalBusiness / RealEstateAgent schema — full service details
    {
      "@context": "https://schema.org",
      "@type": ["RealEstateAgent", "LocalBusiness"],
      name: "Rentorce",
      alternateName: "Rentorce USA",
      description: "Rentorce is a nationwide USA apartment rental matching platform. Find verified 1-bedroom, 2-bedroom, and 3-bedroom rentals in any US city — matched to your exact budget, pet policy, and move-in date.",
      url: "https://rentorce.com",
      logo: "https://rentorce.com/fulllogo.svg",
      image: "https://rentorce.com/fulllogo.svg",
      priceRange: "$800 – $1,800/mo",
      currenciesAccepted: "USD",
      areaServed: {
        "@type": "Country",
        name: "United States",
      },
      serviceType: [
        "Apartment Rental Matching",
        "Leasing Assistance",
        "Pet-Friendly Apartment Search",
        "Furnished Apartment Search",
        "1 Bedroom Apartment Search",
        "2 Bedroom Apartment Search",
        "3 Bedroom Apartment Search",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "USA Apartment Rentals",
        itemListElement: [
          { "@type": "Offer", name: "1 Bed / 1 Bath Apartment", priceCurrency: "USD", priceRange: "$800–$1,200/mo" },
          { "@type": "Offer", name: "2 Bed / 1 Bath Apartment", priceCurrency: "USD", priceRange: "$900–$1,400/mo" },
          { "@type": "Offer", name: "2 Bed / 2 Bath Apartment", priceCurrency: "USD", priceRange: "$1,000–$1,600/mo" },
          { "@type": "Offer", name: "3 Bed / 2 Bath Apartment", priceCurrency: "USD", priceRange: "$1,100–$1,800/mo" },
        ],
      },
      sameAs: [
        "https://apartmento-ten.vercel.app",
      ],
    },
  ];

  return (
    <html lang="en" className="h-full antialiased font-sans">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
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
