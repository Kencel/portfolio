import type { RatingBand } from './types';

// Official Codeforces rank thresholds (labels only — the site renders charts
// in theme colors, not CF's).
export const CF_BANDS: RatingBand[] = [
  { lo: 0,    hi: 1200, label: 'Newbie' },
  { lo: 1200, hi: 1400, label: 'Pupil' },
  { lo: 1400, hi: 1600, label: 'Specialist' },
  { lo: 1600, hi: 1900, label: 'Expert' },
  { lo: 1900, hi: 2100, label: 'Candidate Master' },
  { lo: 2100, hi: 2300, label: 'Master' },
  { lo: 2300, hi: 2400, label: 'International Master' },
  { lo: 2400, hi: 2600, label: 'Grandmaster' },
  { lo: 2600, hi: 3000, label: 'International Grandmaster' },
  { lo: 3000, hi: 4500, label: 'Legendary Grandmaster' },
];

// AtCoder rating thresholds.
export const ATCODER_BANDS: RatingBand[] = [
  { lo: 0,    hi: 400,  label: 'Gray' },
  { lo: 400,  hi: 800,  label: 'Brown' },
  { lo: 800,  hi: 1200, label: 'Green' },
  { lo: 1200, hi: 1600, label: 'Cyan' },
  { lo: 1600, hi: 2000, label: 'Blue' },
  { lo: 2000, hi: 2400, label: 'Yellow' },
  { lo: 2400, hi: 2800, label: 'Orange' },
  { lo: 2800, hi: 4400, label: 'Red' },
];

// Band containing value ([lo, hi) semantics), clamped to the table's ends.
export function bandFor(bands: RatingBand[], value: number): RatingBand {
  if (value < bands[0].lo) return bands[0];
  for (const b of bands) if (value >= b.lo && value < b.hi) return b;
  return bands[bands.length - 1];
}
