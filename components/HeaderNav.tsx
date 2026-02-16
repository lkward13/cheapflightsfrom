"use client";

import Link from "next/link";
import { useState } from "react";
import MegaMenu from "./MegaMenu";

export default function HeaderNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  return (
    <div className="relative">
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white absolute top-full inset-x-0">
          <div className="px-4 py-3 space-y-2">
            <Link
              href="/"
              className="block py-2 text-brand-dark hover:text-brand-primary"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block py-2 text-brand-dark hover:text-brand-primary"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-brand-dark hover:text-brand-primary"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
            <MegaMenu mobile onClose={() => setMenuOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
