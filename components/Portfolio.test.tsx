import { useEffect } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Portfolio } from './Portfolio';
import type { Project } from '@/lib/projects';
import type { Competition } from '@/lib/competitions';
import type { CompprogStats } from '@/lib/compprog/types';
import { RESUME_URL } from '@/lib/data';

const mockNarrow = vi.hoisted(() => ({ value: false }));
// Controls the SplashScreen mock below: true (default) auto-clears the splash
// on mount so keyboard nav in most tests isn't blocked; a test that needs to
// assert on behavior *while the splash is up* sets this false first.
const mockSplashAutoDone = vi.hoisted(() => ({ value: true }));
const mockSfx = vi.hoisted(() => ({
  select: vi.fn(), confirm: vi.fn(), back: vi.fn(), hover: vi.fn(), tap: vi.fn(),
}));

const emptyProjects: Project[] = [];
const emptyCompetitions: Competition[] = [];
const emptyStages = [Promise.resolve<CompprogStats>({ cf: null, atcoder: null })];

vi.mock('@/lib/useIsMobile', () => ({ useIsNarrow: () => mockNarrow.value }));
vi.mock('@/lib/useSfx', () => ({
  NOOP_SFX: { select: () => {}, confirm: () => {}, back: () => {}, hover: () => {}, tap: () => {} },
  useSfx: () => mockSfx,
}));
vi.mock('./Backdrop', () => ({ Backdrop: () => null }));
vi.mock('./MenuView', () => ({ MenuView: () => null }));
// Calls onDone once mounted (via an effect, not during render) so the splash
// gate clears immediately and keyboard nav in tests below isn't blocked —
// unless mockSplashAutoDone is set false, in which case the splash stays up.
vi.mock('./SplashScreen', () => ({
  SplashScreen: ({ onDone }: { onDone: () => void }) => {
    useEffect(() => { if (mockSplashAutoDone.value) onDone(); }, []);
    return null;
  },
}));

// jsdom shares history across tests in a file; without this, a test that
// opens a section leaves '#compprog' in the URL and the next mount deep-links
// into it instead of starting on the menu.
beforeEach(() => {
  window.history.replaceState(null, '', '/');
  mockSplashAutoDone.value = true;
  mockSfx.select.mockClear();
  mockSfx.confirm.mockClear();
  mockSfx.back.mockClear();
});

describe('Portfolio root layout', () => {
  it('wide mode grows with content so the document can scroll (no 100vh height lock)', () => {
    mockNarrow.value = false;
    const { container } = render(
      <Portfolio projects={emptyProjects} competitions={emptyCompetitions} compprogStages={emptyStages} />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.height).not.toBe('100vh');
    expect(root.style.minHeight).toBe('100vh');
  });

  it('narrow mode grows with content', () => {
    mockNarrow.value = true;
    const { container } = render(
      <Portfolio projects={emptyProjects} competitions={emptyCompetitions} compprogStages={emptyStages} />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.height).not.toBe('100vh');
    expect(root.style.minHeight).toBe('100vh');
  });
});

describe('Portfolio section props', () => {
  it('navigating to COMP. PROG renders Compprog with the passed-through stats/competitions', async () => {
    mockNarrow.value = false;
    render(
      <Portfolio projects={emptyProjects} competitions={emptyCompetitions} compprogStages={emptyStages} />
    );
    // '2' is COMP. PROG's digit shortcut (SECTIONS[1].n === '02'); Portfolio's
    // own keydown handler opens the section directly, independent of the
    // mocked-out MenuView.
    fireEvent.keyDown(window, { key: '2' });
    expect(await screen.findByText(/CODEFORCES DATA UNAVAILABLE/)).toBeInTheDocument();
  });
});

describe('Portfolio external menu entry', () => {
  // '5' is RESUME's digit shortcut (SECTIONS[4].n === '05'). It has no panel
  // and no hash, so the menu must be untouched underneath the new tab.
  it('opens the resume in a new tab and leaves the view and history alone', () => {
    mockNarrow.value = false;
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
    render(
      <Portfolio projects={emptyProjects} competitions={emptyCompetitions} compprogStages={emptyStages} />
    );

    fireEvent.keyDown(window, { key: '5' });

    expect(openSpy).toHaveBeenCalledWith(RESUME_URL, '_blank', 'noopener,noreferrer');
    expect(window.location.hash).toBe('');
    expect(screen.queryByText('◄ BACK')).not.toBeInTheDocument();
    openSpy.mockRestore();
  });
});

describe('Portfolio history integration', () => {
  it('opening a section pushes a hash entry', () => {
    mockNarrow.value = false;
    render(
      <Portfolio projects={emptyProjects} competitions={emptyCompetitions} compprogStages={emptyStages} />
    );
    fireEvent.keyDown(window, { key: '2' });
    expect(window.location.hash).toBe('#compprog');
  });

  it('a browser back traversal returns to the menu', async () => {
    mockNarrow.value = false;
    render(
      <Portfolio projects={emptyProjects} competitions={emptyCompetitions} compprogStages={emptyStages} />
    );
    fireEvent.keyDown(window, { key: '2' });
    expect(await screen.findByText(/CODEFORCES DATA UNAVAILABLE/)).toBeInTheDocument();

    // Simulate the mouse back button / chrome arrow: the browser moves first,
    // then fires popstate.
    window.history.replaceState(null, '', '/');
    fireEvent.popState(window);

    expect(screen.queryByText(/CODEFORCES DATA UNAVAILABLE/)).not.toBeInTheDocument();
  });

  it('a deep link opens that section on mount', async () => {
    mockNarrow.value = false;
    window.history.replaceState(null, '', '#compprog');
    render(
      <Portfolio projects={emptyProjects} competitions={emptyCompetitions} compprogStages={emptyStages} />
    );
    expect(await screen.findByText(/CODEFORCES DATA UNAVAILABLE/)).toBeInTheDocument();
  });

  it('a deep-linked mount does not play a sound behind the splash', async () => {
    mockNarrow.value = false;
    mockSplashAutoDone.value = false; // keep the splash up for this test
    window.history.replaceState(null, '', '#compprog');
    render(
      <Portfolio projects={emptyProjects} competitions={emptyCompetitions} compprogStages={emptyStages} />
    );
    // The section panel is already open underneath the (still-up) splash...
    expect(await screen.findByText(/CODEFORCES DATA UNAVAILABLE/)).toBeInTheDocument();
    // ...but a deep-linked visitor should not hear a blip before it lifts.
    expect(mockSfx.confirm).not.toHaveBeenCalled();
    expect(mockSfx.back).not.toHaveBeenCalled();
  });
});
