import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { METRO_BY_SLUG } from "@/lib/metro-data";

export async function POST(request: NextRequest) {
  try {
    const { email, origin } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!origin || typeof origin !== "string") {
      return NextResponse.json(
        { error: "Please select your city" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const metro = METRO_BY_SLUG[origin.trim()];
    if (!metro) {
      return NextResponse.json(
        { error: "Invalid city selection" },
        { status: 400 }
      );
    }

    const homeAirports = metro.airports.join(",");

    await query(
      `INSERT INTO subscribers (email, home_metro, home_airports, assignment_source)
       VALUES ($1, $2, $3, 'website')
       ON CONFLICT (email) DO UPDATE
         SET home_metro = $2,
             home_airports = $3,
             updated_at = NOW()`,
      [trimmedEmail, metro.slug, homeAirports]
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Subscribe error:", msg);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
