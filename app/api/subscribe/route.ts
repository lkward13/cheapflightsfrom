import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

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

    await query(
      `INSERT INTO subscribers (email, origin)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET origin = $2`,
      [trimmedEmail, origin.trim()]
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Unknown error";

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
