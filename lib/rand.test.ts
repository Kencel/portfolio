import { describe, it, expect } from 'vitest';
import { rand } from './rand';

describe('rand', () => {
  it('is deterministic for a given seed', () => {
    expect(rand(7)).toBe(rand(7));
    expect(rand(0)).toBe(rand(0));
  });
  it('stays in [0, 1)', () => {
    for (let seed = -50; seed <= 50; seed++) {
      const v = rand(seed);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
  it('varies across nearby seeds', () => {
    const values = new Set([1, 2, 3, 4, 5].map(rand));
    expect(values.size).toBe(5);
  });
});
