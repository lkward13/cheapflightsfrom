"use client";

import { useState } from "react";

interface EmailSignupProps {
  darkBg?: boolean;
}

export default function EmailSignup({ darkBg = false }: EmailSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
    <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
      <p className={`text-sm mb-3 font-medium drop-shadow ${darkBg ? "text-white/80" : "text-gray-600"}`}>
        Never miss a flight deal. Get free alerts in your inbox.
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 bg-white border-0 focus:ring-2 focus:ring-brand-gold outline-none shadow-lg"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-3 bg-brand-gold text-brand-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-lg disabled:opacity-60"
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
