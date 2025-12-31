import { redis } from "@/lib/db";
import type { Paste } from "@/lib/types";

export default async function PastePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;   // 👈 unwrap promise

  const paste = await redis.get<Paste>(`paste:${id}`);

  if (!paste || (paste.max_views !== null && paste.views >= paste.max_views)) {
    return <div className="p-6 text-center text-red-600">Paste not found or expired.</div>;
  }

  paste.views += 1;
  await redis.set(`paste:${id}`, paste);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-2xl bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4 text-indigo-600">Paste</h1>
        <pre className="whitespace-pre-wrap text-gray-800">{paste.content}</pre>
      </div>
    </main>
  );
}
