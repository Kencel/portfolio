import { describe, it, expect } from 'vitest';
import { rowState } from './rowStyle';

describe('rowState', () => {
  it('base state when nothing hovered', () => {
    const s = rowState(null, 0);
    expect(s.background).toBe('#151313');
    expect(s.color).toBe('#F4F1EA');
    expect(s.opacity).toBe(1);
    expect(s.transform).toContain('translateX(0)');
    expect(s.pop).toBe('4px 4px 0 rgba(0,0,0,.85)');
  });
  it('selected state for the hovered index', () => {
    const s = rowState(2, 2);
    expect(s.background).toBe('#E4002B');
    expect(s.color).toBe('#0b0a0a');
    expect(s.transform).toContain('translateX(30px)');
    expect(s.pop).toBe('8px 8px 0 rgba(0,0,0,.9)'); // bigger pop when selected
  });
  it('dimmed state for non-hovered rows while another is active', () => {
    const s = rowState(2, 0);
    expect(s.opacity).toBe(0.5);
    expect(s.transform).toContain('translateX(-6px)');
  });
});
