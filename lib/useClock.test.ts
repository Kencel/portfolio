import { describe, it, expect } from 'vitest';
import { formatClock } from './useClock';

describe('formatClock', () => {
  it('zero-pads hours and minutes', () => {
    const d = new Date(2026, 6, 3, 9, 5); // Fri
    expect(formatClock(d)).toEqual({ time: '09:05', day: 'FRI' });
  });
  it('handles midnight and Sunday', () => {
    const d = new Date(2026, 6, 5, 0, 0); // Sun
    expect(formatClock(d)).toEqual({ time: '00:00', day: 'SUN' });
  });
});
