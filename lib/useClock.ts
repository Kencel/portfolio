'use client';
import { useEffect, useState } from 'react';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function formatClock(now: Date): { time: string; day: string } {
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return { time: `${hh}:${mm}`, day: DAYS[now.getDay()] };
}

export function useClock(): { time: string; day: string } {
  // Seed null so the server prerender and the first client render agree (a
  // real Date would differ between build time and load time → hydration
  // mismatch). The real time is filled in after mount.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(id);
  }, []);
  return now ? formatClock(now) : { time: '--:--', day: '' };
}
