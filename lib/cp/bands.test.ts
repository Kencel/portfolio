import { describe, it, expect } from 'vitest';
import { CF_BANDS, ATCODER_BANDS, bandFor } from './bands';

describe('bands', () => {
  it('band edges are contiguous and ascending', () => {
    for (const bands of [CF_BANDS, ATCODER_BANDS]) {
      for (let i = 1; i < bands.length; i++) expect(bands[i].lo).toBe(bands[i - 1].hi);
    }
  });
  it('bandFor picks the band containing the value', () => {
    expect(bandFor(CF_BANDS, 1445).label).toBe('Specialist');
    expect(bandFor(CF_BANDS, 1200).label).toBe('Pupil');   // lo inclusive
    expect(bandFor(CF_BANDS, 1199).label).toBe('Newbie');  // hi exclusive
    expect(bandFor(ATCODER_BANDS, 450).label).toBe('Brown');
  });
  it('bandFor clamps below and above the table', () => {
    expect(bandFor(ATCODER_BANDS, -50).label).toBe('Gray');
    expect(bandFor(CF_BANDS, 9999).label).toBe('Legendary Grandmaster');
  });
});
