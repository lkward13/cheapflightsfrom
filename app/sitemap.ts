import type { MetadataRoute } from "next";
import { METROS, AIRPORT_TO_METRO } from "@/lib/metro-data";
import { getDestSlug } from "@/lib/city-mapping";
import { getAllQualifyingRoutes } from "@/lib/queries";

export const revalidate = 86400; // Cache sitemap for 24 hours

const BASE_URL = "https://cheapflightsfrom.us";

/**
 * ID 0 = static + hubs (no DB). ID 1 = route pages.
 * /sitemap.xml becomes an index; /sitemap/0.xml, /sitemap/1.xml are child sitemaps.
 */
export function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }];
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  if (id === "0") {
    // Static pages + hub pages (no route DB query)
    entries.push(
      { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
      { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
      { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.3 }
    );
    for (const metro of METROS) {
      entries.push({
        url: `${BASE_URL}/cheap-flights-from-${metro.slug}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
    return entries;
  }

  // Route pages (id 1)
  if (id !== "1") return entries;

  try {
    const routes = await getAllQualifyingRoutes();
    const seen = new Set<string>();

    for (const route of routes) {
      const routeOrigin = route.origin.trim().toUpperCase();
      const routeDestination = route.destination.trim().toUpperCase();
      const metro = AIRPORT_TO_METRO[routeOrigin];
      if (!metro) continue;
      const dSlug = getDestSlug(routeDestination);
      const key = `${metro.slug}|${dSlug}`;
      if (seen.has(key)) continue;
      seen.add(key);

      entries.push({
        url: `${BASE_URL}/cheap-flights-from-${metro.slug}/to-${dSlug}`,
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
