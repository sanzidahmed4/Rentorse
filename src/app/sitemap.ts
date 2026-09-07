import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apartmento.us";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/find-apartment`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/results`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // High-priority SEO location pages / landing points
  const topCities = [
    "new-york-ny-11004",
    "chicago-il-60007",
    "austin-tx-78701",
    "los-angeles-ca-90012",
    "miami-fl-33130",
    "dallas-tx-75201",
    "atlanta-ga-30301",
    "houston-tx-77001",
  ];

  const cityRoutes: MetadataRoute.Sitemap = topCities.map((city) => ({
    url: `${baseUrl}/find-apartment?city=${city}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...cityRoutes];
}
