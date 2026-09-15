import { MetadataRoute } from "next";
import { getApartments } from "@/lib/store";

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://apartmento-ten.vercel.app");

  // ── Static Core Pages ──────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/find-apartment`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/results`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  // ── Apartment Detail Pages (dynamic from DB) ───────────────────────────────
  let apartmentRoutes: MetadataRoute.Sitemap = [];
  try {
    const activeApartments = await getApartments({ isActive: true });
    apartmentRoutes = activeApartments
      .filter((apt) => apt.slug || apt.id || apt._id)
      .map((apt) => ({
        url: `${baseUrl}/apartments/${apt.slug || apt.id || apt._id}`,
        lastModified: apt.updatedAt ? new Date(apt.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      }));
  } catch {
    // Gracefully skip if DB unavailable at build time
  }

  // ── City Landing Pages ─────────────────────────────────────────────────────
  const topCities = [
    "new-york-ny",
    "los-angeles-ca",
    "chicago-il",
    "miami-fl",
    "dallas-tx",
    "austin-tx",
    "houston-tx",
    "atlanta-ga",
    "seattle-wa",
    "denver-co",
    "phoenix-az",
    "philadelphia-pa",
  ];

  const cityRoutes: MetadataRoute.Sitemap = topCities.map((city) => ({
    url: `${baseUrl}/apartments/location/${city}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // ── Guide / Blog Pages ─────────────────────────────────────────────────────
  const guideSlugs = [
    "how-to-rent-apartment-usa",
    "1-bedroom-vs-2-bedroom-apartment",
    "pet-friendly-apartments-guide",
    "apartment-hunting-checklist",
    "furnished-vs-unfurnished-apartment",
  ];

  const guideRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    },
    ...guideSlugs.map((slug) => ({
      url: `${baseUrl}/guides/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return [...staticRoutes, ...apartmentRoutes, ...cityRoutes, ...guideRoutes];
}

