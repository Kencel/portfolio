import { useEffect } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Portfolio } from './Portfolio';
import type { Project } from '@/lib/projects';
import type { Competition } from '@/lib/competitions';
import type { CpStats } from '@/lib/cp/types';

const mockNarrow = vi.hoisted(() => ({ value: false }));

const emptyProjects: Project[] = [];
const emptyCompetitions: Competition[] = [];
const emptyStats: CpStats = { cf: null, atcoder: null };

vi.mock('@/lib/useIsMobile', () => ({ useIsNarrow: () => mockNarrow.value }));
vi.mock('@/lib/useSfx', () => ({
  useSfx: () => ({ select: () => {}, confirm: () => {}, back: () => {} }),
}));
vi.mock('./Backdrop', () => ({ Backdrop: () => null }));
vi.mock('./MenuView', () => ({ MenuView: () => null }));
// Calls onDone once mounted (via an effect, not during render) so the splash
// gate clears immediately and keyboard nav in tests below isn't blocked.
vi.mock('./SplashScreen', () => ({
  SplashScreen: ({ onDone }: { onDone: () => void }) => {
    useEffect(() => { onDone(); }, []);
    return null;
  },
}));

describe('Portfolio root layout', () => {
  it('wide mode grows with content so the document can scroll (no 100vh height lock)', () => {
    mockNarrow.value = false;
    const { container } = render(
      <Portfolio projects={emptyProjects} competitions={emptyCompetitions} cpStats={emptyStats} />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.height).not.toBe('100vh');
    expect(root.style.minHeight).toBe('100vh');
  });

  it('narrow mode grows with content', () => {
    mockNarrow.value = true;
    const { container } = render(
      <Portfolio projects={emptyProjects} competitions={emptyCompetitions} cpStats={emptyStats} />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.height).not.toBe('100vh');
    expect(root.style.minHeight).toBe('100vh');
  });
});

describe('Portfolio section props', () => {
  it('navigating to COMP. PROG renders Cp with the passed-through stats/competitions', () => {
    mockNarrow.value = false;
    render(
      <Portfolio projects={emptyProjects} competitions={emptyCompetitions} cpStats={emptyStats} />
    );
    // '2' is COMP. PROG's digit shortcut (SECTIONS[1].n === '02'); Portfolio's
    // own keydown handler opens the section directly, independent of the
    // mocked-out MenuView.
    fireEvent.keyDown(window, { key: '2' });
    expect(screen.getByText(/CODEFORCES DATA UNAVAILABLE/)).toBeInTheDocument();
  });
});
