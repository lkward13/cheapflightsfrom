import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const emailClean = email.trim().toLowerCase();

    const rows = await query(
      `UPDATE subscribers SET status = 'unsubscribed', updated_at = NOW()
       WHERE email = $1 AND status = 'active'
       RETURNING email`,
      [emailClean]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "That email was not found or is already unsubscribed." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/unsubscribe]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
