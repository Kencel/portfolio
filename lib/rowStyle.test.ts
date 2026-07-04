import { describe, it, expect } from 'vitest';
import { rowStyle } from './rowStyle';

describe('rowStyle', () => {
  it('base state when nothing hovered', () => {
    const s = rowStyle(null, 0);
    expect(s.background).toBe('#151313');
    expect(s.opacity).toBe(1);
    // clean skewed quad — no jagged clip-path — with a hard offset pop shadow
    expect(s.clipPath).toBeUndefined();
    expect(s.boxShadow).toBe('5px 5px 0 rgba(0,0,0,.85)');
  });
  it('selected state for the hovered index', () => {
    const s = rowStyle(2, 2);
    expect(s.background).toBe('var(--accent,#E4002B)');
    expect(s.color).toBe('#0b0a0a');
    expect(String(s.transform)).toContain('translateX(30px)');
    expect(s.border).toBe('2px solid #F4F1EA');
    expect(s.boxShadow).toBe('9px 9px 0 rgba(0,0,0,.9)');
  });
  it('dimmed state for non-hovered rows while another is active', () => {
    const s = rowStyle(2, 0);
    expect(s.opacity).toBe(0.5);
    expect(String(s.transform)).toContain('translateX(-6px)');
  });
});
