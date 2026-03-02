import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-revalidate-secret");
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { tag, tags, paths } = body as {
      tag?: string;
      tags?: string[];
      paths?: string[];
    };

    const revalidated: string[] = [];

    if (tag) {
      revalidateTag(tag, "max");
      revalidated.push(`tag:${tag}`);
    }

    if (tags) {
      for (const t of tags) {
        revalidateTag(t, "max");
        revalidated.push(`tag:${t}`);
      }
    }

    if (paths) {
      for (const p of paths) {
        revalidatePath(p);
        revalidated.push(`path:${p}`);
      }
    }

    return NextResponse.json({ revalidated, now: Date.now() });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
