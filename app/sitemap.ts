import type { MetadataRoute } from "next";
import { METROS, AIRPORT_TO_METRO } from "@/lib/metro-data";
import { getDestSlug } from "@/lib/city-mapping";
import { getAllQualifyingRoutes } from "@/lib/queries";

export const revalidate = 86400;

const BASE_URL = "https://cheapflightsfrom.us";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Sitemap query timed out after ${ms}ms`)), ms)
    ),
  ]);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const now = new Date();
    const entries: MetadataRoute.Sitemap = [];

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

    try {
      const routes = await withTimeout(getAllQualifyingRoutes(), 8000);
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
      console.error("Sitemap: route query failed, returning static entries only:", error);
    }

    return entries;
  } catch (error) {
    console.error("Sitemap: unexpected error, returning empty sitemap:", error);
    return [{ url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 }];
  }
}
