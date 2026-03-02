import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { METRO_BY_SLUG } from "@/lib/metro-data";
import { sendEmail, buildWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, origin, firstName } = await req.json();

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

    // Check if subscriber already exists
    const existing = await query<{ id: number }>(
      "SELECT id FROM subscribers WHERE email = $1",
      [emailClean]
    );

    const isNewSubscriber = existing.length === 0;

    await query(
      `INSERT INTO subscribers (email, first_name, home_metro, home_airports, assignment_source, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'website', 'active', NOW(), NOW())
       ON CONFLICT (email) DO UPDATE SET
         first_name = COALESCE(EXCLUDED.first_name, subscribers.first_name),
         home_metro = EXCLUDED.home_metro,
         home_airports = EXCLUDED.home_airports,
         status = 'active',
         updated_at = NOW()`,
      [emailClean, firstName?.trim() || null, metro.name, homeAirports]
    );

    // Send welcome email only to new subscribers
    if (isNewSubscriber && process.env.SES_SMTP_USER && process.env.SES_SMTP_PASS) {
      const { subject, html, text } = buildWelcomeEmail(
        metro.displayName,
        metro.slug,
        firstName?.trim() || null
      );
      await sendEmail({ to: emailClean, subject, html, text });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/subscribe]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
