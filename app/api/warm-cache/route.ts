import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WARM_PATHS = [
  "/",
  "/cheap-flights-from-atlanta",
  "/cheap-flights-from-dallas",
  "/cheap-flights-from-oklahoma-city",
  "/cheap-flights-from-boston",
  "/cheap-flights-from-miami",
  "/cheap-flights-from-atlanta/to-cancun",
  "/cheap-flights-from-dallas/to-cancun",
  "/cheap-flights-from-miami/to-cancun",
  "/cheap-flights-from-boston/to-london",
  "/cheap-flights-from-new-york-city/to-paris",
];

function getBaseUrl(request: NextRequest): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (configured) {
    const withProtocol = configured.startsWith("http")
      ? configured
      : `https://${configured}`;
    return withProtocol.replace(/\/+$/, "");
  }

  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;

  const authHeader = request.headers.get("authorization") || "";
  return authHeader === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl = getBaseUrl(request);
  const startedAt = Date.now();
  const results: Array<{ path: string; status?: number; ok: boolean; ms: number }> = [];

  for (const path of WARM_PATHS) {
    const pathStartedAt = Date.now();
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        cache: "no-store",
        headers: {
          "user-agent": "cheapflightsfrom-cache-warmer/1.0",
        },
      });
      results.push({
        path,
        status: response.status,
        ok: response.ok,
        ms: Date.now() - pathStartedAt,
      });
    } catch {
      results.push({
        path,
        ok: false,
        ms: Date.now() - pathStartedAt,
      });
    }
  }

  const successCount = results.filter((result) => result.ok).length;
  return NextResponse.json({
    warmed: successCount,
    total: results.length,
    duration_ms: Date.now() - startedAt,
    results,
  });
}
