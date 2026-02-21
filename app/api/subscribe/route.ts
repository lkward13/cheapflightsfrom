import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { METRO_BY_SLUG } from "@/lib/metro-data";

export async function POST(req: NextRequest) {
  try {
    const { email, origin } = await req.json();

    if (!email || !origin) {
      return NextResponse.json(
        { error: "Email and city are required." },
        { status: 400 }
      );
    }

    const emailClean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const metro = METRO_BY_SLUG[origin];
    if (!metro) {
      return NextResponse.json(
        { error: "Please select a valid city." },
        { status: 400 }
      );
    }

    const homeAirports = metro.airports.join(",");

    await query(
      `INSERT INTO subscribers (email, home_metro, home_airports, assignment_source, status, created_at, updated_at)
       VALUES ($1, $2, $3, 'website', 'active', NOW(), NOW())
       ON CONFLICT (email) DO UPDATE SET
         home_metro = EXCLUDED.home_metro,
         home_airports = EXCLUDED.home_airports,
         status = 'active',
         updated_at = NOW()`,
      [emailClean, metro.name, homeAirports]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/subscribe]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
