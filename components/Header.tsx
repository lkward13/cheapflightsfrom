"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import MegaMenu from "./MegaMenu";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  return (
    <>
      {/* Top info bar */}
      <div className="bg-brand-red text-white text-xs py-1.5 text-center">
        <a href="mailto:info@cheapflightsfrom.us" className="hover:underline">
          info@cheapflightsfrom.us
        </a>
      </div>

      <header className="bg-white text-brand-dark sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Cheap Flights From"
                width={160}
                height={40}
                className="h-8 w-auto"
                priority
              />
              <span className="hidden sm:inline font-bold text-brand-primary text-lg">
                Cheap Flights From
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/" className="text-brand-dark hover:text-brand-primary transition-colors">
                Home
              </Link>
              <div
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <button className="text-brand-primary font-semibold hover:text-brand-dark transition-colors flex items-center gap-1">
                  Flight Deals
                  <svg
                    className={`w-4 h-4 transition-transform ${megaOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {megaOpen && <MegaMenu onClose={() => setMegaOpen(false)} />}
              </div>
              <Link href="/about" className="text-brand-dark hover:text-brand-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-brand-dark hover:text-brand-primary transition-colors">
                Contact
              </Link>
            </nav>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-brand-dark"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-2">
              <Link href="/" className="block py-2 text-brand-dark hover:text-brand-primary" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link href="/about" className="block py-2 text-brand-dark hover:text-brand-primary" onClick={() => setMenuOpen(false)}>
                About
              </Link>
              <Link href="/contact" className="block py-2 text-brand-dark hover:text-brand-primary" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
              <MegaMenu mobile onClose={() => setMenuOpen(false)} />
            </div>
          </div>
        )}
      </header>
    </>
  );
}
