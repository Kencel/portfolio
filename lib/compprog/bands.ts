import type { RatingBand } from './types';

// AtCoder rating thresholds. (Codeforces needs no table — its rank label
// comes straight from the user.info API.)
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
