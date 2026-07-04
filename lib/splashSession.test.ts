import { describe, it, expect, beforeEach } from 'vitest';
import { hasSeenSplash, markSplashSeen } from './splashSession';

describe('splashSession', () => {
  beforeEach(() => { window.sessionStorage.clear(); });

  it('reports not seen on a fresh session', () => {
    expect(hasSeenSplash()).toBe(false);
  });

  it('reports seen after marking', () => {
    markSplashSeen();
    expect(hasSeenSplash()).toBe(true);
    expect(window.sessionStorage.getItem('p5r-splash-seen')).toBe('1');
  });

  it('ignores foreign values under the key', () => {
    window.sessionStorage.setItem('p5r-splash-seen', 'yes');
    expect(hasSeenSplash()).toBe(false);
  });
});
