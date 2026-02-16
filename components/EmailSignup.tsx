"use client";

import { useState } from "react";
import { METROS } from "@/lib/metro-data";

const SORTED_METROS = [...METROS].sort((a, b) =>
  a.displayName.localeCompare(b.displayName)
);

interface EmailSignupProps {
  darkBg?: boolean;
  defaultOrigin?: string;
}

export default function EmailSignup({ darkBg = false, defaultOrigin }: EmailSignupProps) {
  const [email, setEmail] = useState("");
  const [origin, setOrigin] = useState(defaultOrigin || "");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !origin) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, origin }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("You're in! We'll send you deals soon.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={`mt-8 text-center ${darkBg ? "text-white" : "text-gray-900"}`}>
        <p className="text-lg font-semibold drop-shadow">
          {message}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 lg:mt-10 max-w-2xl mx-auto">
      <p className={`text-base lg:text-lg mb-4 font-medium drop-shadow ${darkBg ? "text-white/80" : "text-gray-600"}`}>
        Never miss a flight deal. Get free alerts from your city.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          required
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="px-4 py-3.5 lg:py-4 rounded-lg text-gray-900 bg-white border-0 focus:ring-2 focus:ring-brand-gold outline-none shadow-lg sm:w-48 lg:w-52 appearance-none text-base"
        >
          <option value="" disabled>
            Your city
          </option>
          {SORTED_METROS.map((metro) => (
            <option key={metro.slug} value={metro.slug}>
              {metro.displayName}
            </option>
          ))}
        </select>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-3.5 lg:py-4 rounded-lg text-gray-900 placeholder-gray-400 bg-white border-0 focus:ring-2 focus:ring-brand-gold outline-none shadow-lg text-base"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-8 py-3.5 lg:py-4 bg-brand-gold text-brand-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-lg disabled:opacity-60 whitespace-nowrap text-base lg:text-lg"
        >
          {status === "loading" ? "..." : "Sign Up"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-red-300 text-sm mt-2 drop-shadow">{message}</p>
      )}
    </form>
  );
}
