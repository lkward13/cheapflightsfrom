"use client";

import { useState } from "react";
import Link from "next/link";
import { getCityName, getDestSlug } from "@/lib/city-mapping";
import { formatPrice, getCheapestMonths } from "@/lib/utils";
import type { RouteInsight } from "@/lib/queries";

interface PriceTableProps {
  destinations: RouteInsight[];
  metroSlug: string;
}

type SortKey = "destination" | "low_price" | "typical_price" | "best_month";

export default function PriceTable({ destinations, metroSlug }: PriceTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("low_price");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sorted = [...destinations].sort((a, b) => {
    const mult = sortAsc ? 1 : -1;
    switch (sortKey) {
      case "destination":
        return mult * getCityName(a.destination).localeCompare(getCityName(b.destination));
      case "low_price":
        return mult * ((a.low_price_threshold || 9999) - (b.low_price_threshold || 9999));
      case "typical_price":
        return mult * ((a.typical_price || 9999) - (b.typical_price || 9999));
      default:
        return 0;
    }
  });

  const SortIcon = ({ active }: { active: boolean }) => (
    <svg className={`w-3 h-3 inline ml-1 ${active ? "text-brand-primary" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
    </svg>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th
              className="text-left px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer hover:text-brand-primary"
              onClick={() => handleSort("destination")}
            >
              Destination <SortIcon active={sortKey === "destination"} />
            </th>
            <th
              className="text-right px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer hover:text-brand-primary"
              onClick={() => handleSort("low_price")}
            >
              Deals From <SortIcon active={sortKey === "low_price"} />
            </th>
            <th
              className="text-right px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer hover:text-brand-primary hidden sm:table-cell"
              onClick={() => handleSort("typical_price")}
            >
              Typical Price <SortIcon active={sortKey === "typical_price"} />
            </th>
            <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700 hidden md:table-cell">
              Best Months
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((dest, i) => {
            const destSlug = getDestSlug(dest.destination);
            const cheapMonths = getCheapestMonths(dest.monthly_typical, 2);
            return (
              <tr
                key={`${dest.origin}-${dest.destination}`}
                className={`border-b border-gray-100 hover:bg-brand-light/50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/cheap-flights-from-${metroSlug}/to-${destSlug}`}
                    className="text-brand-primary hover:underline font-medium"
                    prefetch={false}
                  >
                    {getCityName(dest.destination)}
                  </Link>
                  <span className="text-xs text-gray-400 ml-1">({dest.destination})</span>
                </td>
                <td className="text-right px-4 py-3">
                  <span className="text-brand-accent font-bold">
                    {formatPrice(dest.low_price_threshold)}
                  </span>
                </td>
                <td className="text-right px-4 py-3 text-gray-600 hidden sm:table-cell">
                  {formatPrice(dest.typical_price)}
                </td>
                <td className="text-right px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                  {cheapMonths.join(", ") || "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
