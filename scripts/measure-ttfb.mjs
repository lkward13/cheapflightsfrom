#!/usr/bin/env node

import { performance } from "node:perf_hooks";

function percentile(sortedValues, p) {
  if (sortedValues.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sortedValues.length) - 1;
  return sortedValues[Math.max(0, idx)];
}

async function measureOne(url) {
  const startedAt = performance.now();
  const response = await fetch(url, { cache: "no-store" });
  const firstByteAt = performance.now();

  // Drain body so each request is complete and comparable.
  await response.arrayBuffer();

  return {
    status: response.status,
    ttfbMs: firstByteAt - startedAt,
  };
}

async function main() {
  const baseUrl = process.env.SITE_URL || "https://cheapflightsfrom.us";
  const runs = Number(process.env.TTFB_RUNS || "8");

  const paths = [
    "/",
    "/cheap-flights-from-atlanta",
    "/cheap-flights-from-atlanta/to-cancun",
  ];

  for (const path of paths) {
    const url = `${baseUrl}${path}`;
    const samples = [];
    let status = 0;

    for (let i = 0; i < runs; i++) {
      const result = await measureOne(url);
      samples.push(result.ttfbMs);
      status = result.status;
    }

    const sorted = [...samples].sort((a, b) => a - b);
    const avg = sorted.reduce((sum, value) => sum + value, 0) / sorted.length;
    const p50 = percentile(sorted, 50);
    const p95 = percentile(sorted, 95);

    console.log(`\n${url}`);
    console.log(`status=${status} runs=${runs}`);
    console.log(`avg=${avg.toFixed(1)}ms p50=${p50.toFixed(1)}ms p95=${p95.toFixed(1)}ms`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
