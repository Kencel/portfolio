import { describe, it, expect } from 'vitest';
import { wrapIndex, sectionIndexForDigit } from './nav';

describe('wrapIndex', () => {
  it('starts at 0 when moving down from null', () => expect(wrapIndex(null, 1, 6)).toBe(0));
  it('starts at last when moving up from null', () => expect(wrapIndex(null, -1, 6)).toBe(5));
  it('wraps forward past the end', () => expect(wrapIndex(5, 1, 6)).toBe(0));
  it('wraps backward past the start', () => expect(wrapIndex(0, -1, 6)).toBe(5));
  it('moves normally in the middle', () => expect(wrapIndex(2, 1, 6)).toBe(3));
});

describe('sectionIndexForDigit', () => {
  it('maps "1" to index 0 and "6" to index 5', () => {
    expect(sectionIndexForDigit('1')).toBe(0);
    expect(sectionIndexForDigit('6')).toBe(5);
  });
  it('returns -1 for out-of-range keys', () => {
    expect(sectionIndexForDigit('7')).toBe(-1);
    expect(sectionIndexForDigit('a')).toBe(-1);
  });
});
