import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/db";
import type { Paste } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const paste = await redis.get<Paste>(`paste:${id}`);

  if (!paste) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return NextResponse.json({ error: "Max views exceeded" }, { status: 404 });
  }

  paste.views += 1;
  await redis.set(`paste:${id}`, paste);

  return NextResponse.json({ content: paste.content });
}
