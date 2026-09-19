import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const SITE_URL = "https://rentorce.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
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
    url: SITE_URL,
    siteName: "Rentorce",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Rentorce — Find Verified USA Apartments For Rent",
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
    images: ["/og-image.png"],
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
    // WebSite schema
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Rentorce",
      url: `${SITE_URL}/`,
      description: "USA Apartment Rental Matching Platform — find verified 1BR, 2BR, and 3BR apartments nationwide.",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
    // Organization schema
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Rentorce",
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/fulllogo.svg`,
      description: "Rentorce is a nationwide USA apartment rental matching platform helping renters discover apartment options across the United States based on location, budget, bedrooms, amenities, and lifestyle needs.",
      email: "support@rentorce.com",
      telephone: "+1 (800) 492-7836",
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
        {/* Google Analytics 4 (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LNBHKWE17R"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = function(){window.dataLayer.push(arguments);};
            window.gtag('js', new Date());
            window.gtag('config', 'G-LNBHKWE17R');
          `}
        </Script>

        {/* Meta Pixel Code (Facebook) */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1306981108071575');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1306981108071575&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
