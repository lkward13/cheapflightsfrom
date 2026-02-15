import { MetadataRoute } from "next";
import { METROS, AIRPORT_TO_METRO } from "@/lib/metro-data";
import { getDestSlug } from "@/lib/city-mapping";
import { getAllQualifyingRoutes } from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://cheapflightsfrom.us";
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Hub pages
  for (const metro of METROS) {
    entries.push({
      url: `${baseUrl}/cheap-flights-from-${metro.slug}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    });
  }

  // Route pages
  try {
    const routes = await getAllQualifyingRoutes();
    const seen = new Set<string>();

    for (const route of routes) {
      const metro = AIRPORT_TO_METRO[route.origin.trim()];
      if (!metro) continue;
      const dSlug = getDestSlug(route.destination.trim());
      const key = `${metro.slug}|${dSlug}`;
      if (seen.has(key)) continue;
      seen.add(key);

      entries.push({
        url: `${baseUrl}/cheap-flights-from-${metro.slug}/to-${dSlug}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.6,
      });
    }
  } catch (error) {
    console.error("Error generating route sitemap entries:", error);
  }

  return entries;
}
