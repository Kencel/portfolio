import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Portfolio } from './Portfolio';

const mockNarrow = vi.hoisted(() => ({ value: false }));

vi.mock('@/lib/useIsMobile', () => ({ useIsNarrow: () => mockNarrow.value }));
vi.mock('@/lib/useSfx', () => ({
  useSfx: () => ({ select: () => {}, confirm: () => {}, back: () => {} }),
}));
vi.mock('./Backdrop', () => ({ Backdrop: () => null }));
vi.mock('./MenuView', () => ({ MenuView: () => null }));
vi.mock('./SplashScreen', () => ({ SplashScreen: () => null }));

describe('Portfolio root layout', () => {
  it('wide mode grows with content so the document can scroll (no 100vh height lock)', () => {
    mockNarrow.value = false;
    const { container } = render(<Portfolio />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.height).not.toBe('100vh');
    expect(root.style.minHeight).toBe('100vh');
  });

  it('narrow mode grows with content', () => {
    mockNarrow.value = true;
    const { container } = render(<Portfolio />);
    const root = container.firstChild as HTMLElement;
    expect(root.style.height).not.toBe('100vh');
    expect(root.style.minHeight).toBe('100vh');
  });
});
