"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
}

export default function FAQSection({ items, title = "Frequently Asked Questions" }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              className="w-full text-left px-5 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium text-gray-900 pr-4">{item.question}</span>
              <svg
                className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="px-5 py-4 text-gray-600 leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
