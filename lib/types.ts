// lib/types.ts
export interface Paste {
  content: string;
  ttl_seconds: number | null;
  max_views: number | null;
  created_at: number;
  views: number;
}
