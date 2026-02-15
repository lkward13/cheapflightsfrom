"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import MegaMenu from "./MegaMenu";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  return (
    <header className="bg-brand-dark text-white sticky top-0 z-50 shadow-md">
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
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-brand-sky transition-colors">
              Home
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button className="hover:text-brand-sky transition-colors flex items-center gap-1">
                Flights
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
            <Link href="/about" className="hover:text-brand-sky transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-brand-sky transition-colors">
              Contact
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
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
        <div className="md:hidden border-t border-white/10 bg-brand-dark">
          <div className="px-4 py-3 space-y-2">
            <Link href="/" className="block py-2 hover:text-brand-sky" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link href="/about" className="block py-2 hover:text-brand-sky" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="block py-2 hover:text-brand-sky" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
            <MegaMenu mobile onClose={() => setMenuOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
