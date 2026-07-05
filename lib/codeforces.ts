'use client';
import { useEffect, useState } from 'react';
import { CF_DEFAULTS, CF_HANDLE } from './data';

export type CfStats = { rating: number; maxRating: number; rank: string };

function titleCase(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
}

export function mapCfResponse(json: unknown, fallback: CfStats): CfStats {
  const j = json as { status?: string; result?: Array<{ rating?: unknown; maxRating?: unknown; rank?: unknown }> };
  const u = j && j.status === 'OK' && Array.isArray(j.result) ? j.result[0] : undefined;
  if (!u || typeof u.rating !== 'number' || typeof u.maxRating !== 'number') return fallback;
  return {
    rating: u.rating,
    maxRating: u.maxRating,
    rank: typeof u.rank === 'string' ? titleCase(u.rank) : fallback.rank,
  };
}

export function cmProgressPct(rating: number): number {
  return Math.max(0, Math.min(100, Math.round(((rating - 800) / (1900 - 800)) * 100)));
}

export function useCodeforces(): CfStats {
  const [stats, setStats] = useState<CfStats>(CF_DEFAULTS);
  useEffect(() => {
    let live = true;
    fetch(`https://codeforces.com/api/user.info?handles=${CF_HANDLE}`)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('cf http ' + r.status))))
      .then(json => { if (live) setStats(mapCfResponse(json, CF_DEFAULTS)); })
      .catch(() => { /* keep defaults */ });
    return () => { live = false; };
  }, []);
  return stats;
}
