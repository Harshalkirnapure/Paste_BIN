"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ttl_seconds: ttl ? parseInt(ttl) : undefined,
        max_views: maxViews ? parseInt(maxViews) : undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.error);
    setResult(data.url);
    setContent("");
    setTtl("");
    setMaxViews("");
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-600">Pastebin-Lite</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full border rounded p-2"
            placeholder="Paste content..."
            required
          />
          <input
            type="number"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
            placeholder="TTL (seconds)"
            className="w-full border rounded p-2"
          />
          <input
            type="number"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
            placeholder="Max views"
            className="w-full border rounded p-2"
          />
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
            Create Paste
          </button>
        </form>
        {error && <p className="text-red-600 mt-4">{error}</p>}
        {result && (
          <div className="mt-4 text-center">
            <p className="text-green-600">Paste created!</p>
            <a href={result} className="text-indigo-600 underline break-all">{result}</a>
          </div>
        )}
      </div>
    </main>
  );
}
