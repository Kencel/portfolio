import { describe, it, expect } from 'vitest';
import { rowStyle } from './rowStyle';

describe('rowStyle', () => {
  it('base state when nothing hovered', () => {
    const s = rowStyle(null, 0);
    expect(s.background).toBe('#151313');
    expect(s.opacity).toBe(1);
    // thick white torn-edged border + irregular silhouette + hard offset pop
    expect(s.border).toBe('5px solid #F4F1EA');
    expect(s.clipPath).toContain('polygon(');
    expect(String(s.filter)).toContain('drop-shadow(4px 4px 0 rgba(0,0,0,.85))');
  });
  it('selected state for the hovered index', () => {
    const s = rowStyle(2, 2);
    expect(s.background).toBe('var(--accent,#E4002B)');
    expect(s.color).toBe('#0b0a0a');
    expect(String(s.transform)).toContain('translateX(30px)');
    // selected gets a bigger hard offset pop (lives in filter, since box-shadow is clipped)
    expect(String(s.filter)).toContain('drop-shadow(8px 8px 0 rgba(0,0,0,.9))');
  });
  it('dimmed state for non-hovered rows while another is active', () => {
    const s = rowStyle(2, 0);
    expect(s.opacity).toBe(0.5);
    expect(String(s.transform)).toContain('translateX(-6px)');
  });
  it('varies the clip-path silhouette by row index', () => {
    expect(rowStyle(null, 0).clipPath).not.toBe(rowStyle(null, 1).clipPath);
  });
});
