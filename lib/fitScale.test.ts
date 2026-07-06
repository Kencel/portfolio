import { describe, it, expect } from 'vitest';
import { fitScale } from './fitScale';

describe('fitScale', () => {
  it('returns 1 when content fits the available height', () => {
    expect(fitScale(800, 900)).toBe(1);
    expect(fitScale(900, 900)).toBe(1);
  });

  it('scales down proportionally when content overflows', () => {
    expect(fitScale(1000, 800)).toBe(0.8);
    expect(fitScale(900, 600)).toBeCloseTo(2 / 3);
  });

  it('never scales up', () => {
    expect(fitScale(300, 1200)).toBe(1);
  });

  it('bails out to 1 on degenerate measurements', () => {
    expect(fitScale(0, 900)).toBe(1);
    expect(fitScale(-5, 900)).toBe(1);
    expect(fitScale(800, 0)).toBe(1);
    expect(fitScale(800, -10)).toBe(1);
  });
});
