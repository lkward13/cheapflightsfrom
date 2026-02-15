"use client";

import Link from "next/link";
import { useState } from "react";
import { METROS_BY_REGION, REGION_LABELS, type Region } from "@/lib/metro-data";

const REGIONS: Region[] = ["south", "west", "midwest", "northeast", "southeast"];

interface MegaMenuProps {
  mobile?: boolean;
  onClose: () => void;
}

export default function MegaMenu({ mobile = false, onClose }: MegaMenuProps) {
  const [openRegion, setOpenRegion] = useState<Region | null>(null);

  if (mobile) {
    return (
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wider text-gray-400 py-1">Browse by Region</p>
        {REGIONS.map((region) => (
          <div key={region}>
            <button
              className="w-full text-left py-2 flex items-center justify-between text-brand-dark hover:text-brand-primary"
              onClick={() => setOpenRegion(openRegion === region ? null : region)}
            >
              <span>{REGION_LABELS[region]}</span>
              <svg
                className={`w-4 h-4 transition-transform ${openRegion === region ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openRegion === region && (
              <div className="pl-4 pb-2 grid grid-cols-2 gap-1">
                {METROS_BY_REGION[region].map((metro) => (
                  <Link
                    key={metro.slug}
                    href={`/cheap-flights-from-${metro.slug}`}
                    className="text-sm py-1 text-gray-600 hover:text-brand-primary"
                    onClick={onClose}
                  >
                    {metro.displayName}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[700px] bg-white text-gray-800 rounded-lg shadow-xl border border-gray-100 p-6 z-50">
      <div className="grid grid-cols-5 gap-4">
        {REGIONS.map((region) => (
          <div key={region}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
              {REGION_LABELS[region]}
            </h3>
            <ul className="space-y-1">
              {METROS_BY_REGION[region].map((metro) => (
                <li key={metro.slug}>
                  <Link
                    href={`/cheap-flights-from-${metro.slug}`}
                    className="text-xs hover:text-brand-primary transition-colors"
                    onClick={onClose}
                  >
                    {metro.displayName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
