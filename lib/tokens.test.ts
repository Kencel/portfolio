import { describe, it, expect } from 'vitest';
import { COLOR, POP, FONT, SKEW } from './tokens';

describe('tokens', () => {
  it('exposes the accent color used throughout the app', () => {
    expect(COLOR.accent).toBe('#E4002B');
  });
  it('exposes the base/ink/panel/row palette', () => {
    expect(COLOR.base).toBe('#0b0a0a');
    expect(COLOR.ink).toBe('#F4F1EA');
    expect(COLOR.panel).toBe('#141212');
    expect(COLOR.row).toBe('#151313');
  });
  it('exposes the progress-bar track colors and the CF/Discord brand colors', () => {
    expect(COLOR.trackBg).toBe('#1c1a1a');
    expect(COLOR.trackBorder).toBe('#333');
    expect(COLOR.cfteal).toBe('#17A2A2');
    expect(COLOR.discord).toBe('#5865F2');
  });
  it('exposes hard-shadow pop strings', () => {
    expect(POP.black).toBe('7px 7px 0 rgba(0,0,0,.9)');
    expect(POP.accent).toBe('7px 7px 0 rgba(228,0,43,.75)');
    expect(POP.rowBase).toBe('4px 4px 0 rgba(0,0,0,.85)');
    expect(POP.rowSelected).toBe('8px 8px 0 rgba(0,0,0,.9)');
  });
  it('exposes font-role fallback chains', () => {
    expect(FONT.anton).toBe('var(--font-anton), sans-serif');
    expect(FONT.bebas).toBe('var(--font-bebas), sans-serif');
    expect(FONT.oswald).toBe('var(--font-oswald), sans-serif');
  });
  it('exposes the shared skew angles', () => {
    expect(SKEW.row).toBe(-9);
    expect(SKEW.panel).toBe(-8);
  });
});
