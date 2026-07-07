import type { RatingBand } from './types';

// Official Codeforces rank bands (colors from the CF profile rating graph).
export const CF_BANDS: RatingBand[] = [
  { lo: 0,    hi: 1200, color: '#808080', label: 'Newbie' },
  { lo: 1200, hi: 1400, color: '#008000', label: 'Pupil' },
  { lo: 1400, hi: 1600, color: '#03A89E', label: 'Specialist' },
  { lo: 1600, hi: 1900, color: '#0000FF', label: 'Expert' },
  { lo: 1900, hi: 2100, color: '#AA00AA', label: 'Candidate Master' },
  { lo: 2100, hi: 2300, color: '#FF8C00', label: 'Master' },
  { lo: 2300, hi: 2400, color: '#FF8C00', label: 'International Master' },
  { lo: 2400, hi: 2600, color: '#FF0000', label: 'Grandmaster' },
  { lo: 2600, hi: 3000, color: '#FF0000', label: 'International Grandmaster' },
  { lo: 3000, hi: 4500, color: '#AA0000', label: 'Legendary Grandmaster' },
];

// AtCoder color bands.
export const ATCODER_BANDS: RatingBand[] = [
  { lo: 0,    hi: 400,  color: '#808080', label: 'Gray' },
  { lo: 400,  hi: 800,  color: '#804000', label: 'Brown' },
  { lo: 800,  hi: 1200, color: '#008000', label: 'Green' },
  { lo: 1200, hi: 1600, color: '#00C0C0', label: 'Cyan' },
  { lo: 1600, hi: 2000, color: '#0000FF', label: 'Blue' },
  { lo: 2000, hi: 2400, color: '#C0C000', label: 'Yellow' },
  { lo: 2400, hi: 2800, color: '#FF8000', label: 'Orange' },
  { lo: 2800, hi: 4400, color: '#FF0000', label: 'Red' },
];

// Band containing value ([lo, hi) semantics), clamped to the table's ends.
export function bandFor(bands: RatingBand[], value: number): RatingBand {
  if (value < bands[0].lo) return bands[0];
  for (const b of bands) if (value >= b.lo && value < b.hi) return b;
  return bands[bands.length - 1];
}
