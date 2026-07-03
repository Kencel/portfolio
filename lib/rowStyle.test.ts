import { describe, it, expect } from 'vitest';
import { rowStyle } from './rowStyle';

describe('rowStyle', () => {
  it('base state when nothing hovered', () => {
    const s = rowStyle(null, 0);
    expect(s.background).toBe('#151313');
    expect(s.opacity).toBe(1);
    // angular treatment: irregular silhouette + black keyline, no plain border
    expect(s.clipPath).toContain('polygon(');
    expect(s.border).toBe('none');
    expect(String(s.filter)).toContain('drop-shadow(3px 3px 0 rgba(0,0,0,.6))');
  });
  it('selected state for the hovered index', () => {
    const s = rowStyle(2, 2);
    expect(s.background).toBe('var(--accent,#E4002B)');
    expect(s.color).toBe('#0b0a0a');
    expect(String(s.transform)).toContain('translateX(30px)');
    // selected gets a bigger hard offset pop (box-shadow is clipped by clip-path, so it lives in filter)
    expect(String(s.filter)).toContain('drop-shadow(7px 7px 0 rgba(0,0,0,.7))');
  });
  it('dimmed state for non-hovered rows while another is active', () => {
    const s = rowStyle(2, 0);
    expect(s.opacity).toBe(0.5);
    expect(String(s.transform)).toContain('translateX(-6px)');
  });
  it('varies the clip-path shape by row index', () => {
    expect(rowStyle(null, 0).clipPath).not.toBe(rowStyle(null, 1).clipPath);
  });
});
