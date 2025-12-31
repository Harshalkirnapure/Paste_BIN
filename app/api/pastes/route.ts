import { NextResponse } from "next/server";
import { redis } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const { content, ttl_seconds, max_views } = await req.json();

  if (!content || typeof content !== "string") {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }

  const id = nanoid();
  const paste = {
    content,
    ttl_seconds: ttl_seconds || null,
    max_views: max_views || null,
    created_at: Date.now(),
    views: 0,
  };  

  await redis.set(`paste:${id}`, paste);
  if (ttl_seconds) await redis.expire(`paste:${id}`, ttl_seconds);

  return NextResponse.json({ id, url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`, content});
}
