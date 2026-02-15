import { IATA_TO_CITY } from "./city-mapping-data";
export { IATA_TO_CITY };

/** Get a human-readable city name from an IATA airport code */
export function getCityName(iata: string): string {
  return IATA_TO_CITY[iata] || iata;
}

/** Convert an IATA code to a URL-safe destination slug */
export function getDestSlug(iata: string): string {
  const city = getCityName(iata);
  return city
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Reverse lookup: find IATA code from a destination slug */
export function findIataFromSlug(slug: string): string | null {
  for (const [iata, city] of Object.entries(IATA_TO_CITY)) {
    const citySlug = city
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (citySlug === slug) return iata;
  }
  return null;
}
