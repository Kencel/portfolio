import { describe, it, expect } from 'vitest';
import { ATCODER_BANDS, bandFor } from './bands';

describe('bands', () => {
  it('band edges are contiguous and ascending', () => {
    for (let i = 1; i < ATCODER_BANDS.length; i++) {
      expect(ATCODER_BANDS[i].lo).toBe(ATCODER_BANDS[i - 1].hi);
    }
  });
  it('bandFor picks the band containing the value', () => {
    expect(bandFor(ATCODER_BANDS, 450).label).toBe('Brown');
    expect(bandFor(ATCODER_BANDS, 400).label).toBe('Brown'); // lo inclusive
    expect(bandFor(ATCODER_BANDS, 399).label).toBe('Gray');  // hi exclusive
  });
  it('bandFor clamps below and above the table', () => {
    expect(bandFor(ATCODER_BANDS, -50).label).toBe('Gray');
    expect(bandFor(ATCODER_BANDS, 9999).label).toBe('Red');
  });
});
