"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function UnsubscribeForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("done");
        setMessage("You've been unsubscribed. You won't receive any more deal emails.");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-5">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Unsubscribed</h2>
        <p className="text-gray-500 mb-8">{message}</p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-brand-primary px-6 py-3 text-sm font-semibold text-white hover:bg-brand-primary/90 transition-colors"
        >
          Back to Homepage
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
      <p className="text-gray-500 mb-6 text-center">
        Enter your email below and we&apos;ll remove you from all deal alerts.
      </p>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none mb-4"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Processing..." : "Unsubscribe"}
      </button>
      {status === "error" && (
        <p className="text-red-500 text-sm mt-3 text-center">{message}</p>
      )}
    </form>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        Unsubscribe
      </h1>
      <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
        <UnsubscribeForm />
      </Suspense>
    </div>
  );
}
