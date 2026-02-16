import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO subscribers (email)
       VALUES ($1)
       ON CONFLICT (email) DO NOTHING`,
      [trimmed]
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Unknown error";

    // If table doesn't exist yet, still return success to the user
    if (msg.includes("subscribers") && msg.includes("does not exist")) {
      console.error("subscribers table not created yet:", msg);
      return NextResponse.json({ success: true });
    }

    console.error("Subscribe error:", msg);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
