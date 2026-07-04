import { render, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SplashScreen, SPIN_MS, REVEAL_MS, FADE_MS } from './SplashScreen';

function phaseOf(container: HTMLElement): string | null {
  const root = container.querySelector('[data-splash-phase]');
  return root ? root.getAttribute('data-splash-phase') : null;
}

describe('SplashScreen', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

  it('starts in the spin phase with the bowl and TAKE YOUR TIME text', () => {
    const { container } = render(<SplashScreen onDone={() => {}} />);
    expect(phaseOf(container)).toBe('spin');
    // RansomText renders one span per character; spaces are empty spacer spans.
    expect(container.textContent).toContain('TAKEYOURTIME');
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('is monochrome: no crimson in the rendered markup', () => {
    const { container } = render(<SplashScreen onDone={() => {}} />);
    // Inline styles serialize hex to rgb() in jsdom; check both spellings.
    expect(container.innerHTML).not.toMatch(/#E4002B/i);
    expect(container.innerHTML).not.toMatch(/228,\s*0,\s*43/);
  });

  it('advances spin -> reveal -> onDone on the timer', () => {
    const onDone = vi.fn();
    const { container } = render(<SplashScreen onDone={onDone} />);
    act(() => { vi.advanceTimersByTime(SPIN_MS); });
    expect(phaseOf(container)).toBe('reveal');
    expect(onDone).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(REVEAL_MS); });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('skips to reveal on keydown during the spin', () => {
    const onDone = vi.fn();
    const { container } = render(<SplashScreen onDone={onDone} />);
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(phaseOf(container)).toBe('reveal');
    expect(onDone).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(REVEAL_MS); });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('skips to reveal on pointerdown during the spin', () => {
    const { container } = render(<SplashScreen onDone={() => {}} />);
    fireEvent.pointerDown(window);
    expect(phaseOf(container)).toBe('reveal');
  });

  it('a skip input during the reveal does not restart or double-finish', () => {
    const onDone = vi.fn();
    const { container } = render(<SplashScreen onDone={onDone} />);
    fireEvent.keyDown(window, { key: 'Enter' });
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(phaseOf(container)).toBe('reveal');
    act(() => { vi.advanceTimersByTime(REVEAL_MS + SPIN_MS); });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('uses a plain fade when prefers-reduced-motion is set', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
    const onDone = vi.fn();
    const { container } = render(<SplashScreen onDone={onDone} />);
    expect(phaseOf(container)).toBe('fade');
    act(() => { vi.advanceTimersByTime(FADE_MS); });
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
