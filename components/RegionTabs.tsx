"use client";

import { useState } from "react";
import Link from "next/link";
import { getCityName, getDestSlug } from "@/lib/city-mapping";
import { formatPrice } from "@/lib/utils";
import {
  type DestRegion,
  REGION_LABELS,
  REGION_ORDER,
} from "@/lib/destination-regions";

export interface RegionDestRow {
  destination: string;
  low_price_threshold: number | null;
  typical_price: number | null;
  region: DestRegion;
}

interface RegionTabsProps {
  destinations: RegionDestRow[];
  metroSlug: string;
  /** Counts per region, keyed by DestRegion */
  regionCounts: Record<DestRegion, number>;
}

export default function RegionTabs({
  destinations,
  metroSlug,
  regionCounts,
}: RegionTabsProps) {
  // Only show regions that have data
  const availableRegions = REGION_ORDER.filter(
    (r) => regionCounts[r] > 0
  );
  const [activeRegion, setActiveRegion] = useState<DestRegion>(
    availableRegions[0] || "domestic"
  );

  const filtered = destinations.filter((d) => d.region === activeRegion);

  // Show cheapest price per region as subtitle
  const cheapestByRegion = (region: DestRegion) => {
    const first = destinations.find((d) => d.region === region);
    return first?.low_price_threshold;
  };

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Browse Destinations by Region
      </h2>

      {/* Region tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {availableRegions.map((region) => {
          const isActive = region === activeRegion;
          const cheapest = cheapestByRegion(region);
          return (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                isActive
                  ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:border-brand-primary hover:text-brand-primary"
              }`}
            >
              {REGION_LABELS[region]}
              <span
                className={`ml-1.5 text-xs ${
                  isActive ? "text-white/80" : "text-gray-400"
                }`}
              >
                ({regionCounts[region]})
              </span>
              {cheapest && (
                <span
                  className={`ml-1 text-xs ${
                    isActive ? "text-white/80" : "text-brand-accent"
                  }`}
                >
                  from {formatPrice(cheapest)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Destination grid for active region */}
      {filtered.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                  Destination
                </th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700">
                  Deals From
                </th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700 hidden sm:table-cell">
                  Typical Price
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((dest, i) => {
                const destSlug = getDestSlug(dest.destination);
                return (
                  <tr
                    key={dest.destination}
                    className={`border-b border-gray-100 hover:bg-brand-light/50 transition-colors ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/cheap-flights-from-${metroSlug}/to-${destSlug}`}
                        className="text-brand-primary hover:underline font-medium"
                        prefetch={false}
                      >
                        {getCityName(dest.destination)}
                      </Link>
                      <span className="text-xs text-gray-400 ml-1">
                        ({dest.destination})
                      </span>
                    </td>
                    <td className="text-right px-4 py-3">
                      <span className="text-brand-accent font-bold">
                        {formatPrice(dest.low_price_threshold)}
                      </span>
                    </td>
                    <td className="text-right px-4 py-3 text-gray-600 hidden sm:table-cell">
                      {formatPrice(dest.typical_price)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 py-4">
          No destinations found in this region.
        </p>
      )}
    </section>
  );
}
