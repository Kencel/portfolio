'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Project } from '@/lib/projects';
import type { Competition } from '@/lib/competitions';
import type { CompprogStats } from '@/lib/compprog/types';
import { SECTIONS, isExternal } from '@/lib/data';
import { COLOR, FONT } from '@/lib/tokens';
import { wrapIndex, sectionIndexForDigit } from '@/lib/nav';
import { useSfx } from '@/lib/useSfx';
import { useIsNarrow } from '@/lib/useIsMobile';
import { SfxProvider } from '@/lib/SfxContext';
import { useHashRoute } from '@/lib/useHashRoute';
import { useProgressive } from '@/lib/useProgressive';
import type { View } from '@/lib/hashRoute';
import { Backdrop } from './Backdrop';
import { MenuView } from './MenuView';
import { SectionPanel } from './SectionPanel';
import { SplashScreen } from './SplashScreen';

export function Portfolio({ projects, competitions, compprogStages }: {
  projects: Project[];
  competitions: Competition[];
  // Streamed from the server, quick version first (see app/page.tsx).
  compprogStages: readonly Promise<CompprogStats>[];
}) {
  // Resolved here rather than in the COMP. PROG section, which mounts only when
  // opened — so the stats are usually in hand by then, and a stage landing
  // while it's open updates it in place instead of remounting (keeping its tab).
  const compprogStats = useProgressive(compprogStages);
  const [hovered, setHovered] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);
  const [menuVisit, setMenuVisit] = useState(0);
  const sfx = useSfx(muted);
  const narrow = useIsNarrow();

  // The splash plays on every load: the site has only hash routing, so a
  // reload is always a genuine re-entry. Starts true on server and client alike.
  const [splash, setSplash] = useState(true);
  const splashRef = useRef(splash);
  splashRef.current = splash;
  const splashDone = useCallback(() => { setSplash(false); }, []);

  // Every route to the menu — Esc, C, the mouse back button, the chrome arrow,
  // the mobile back-swipe — arrives here, so the sound and the menu re-entry
  // animation stay identical whichever one the visitor used.
  const onTransition = useCallback((to: View) => {
    if (!splashRef.current) {
      if (to === 'menu') sfx.back(); else sfx.confirm();
    }
    if (to === 'menu') { setHovered(null); setMenuVisit(v => v + 1); }
  }, [sfx]);

  const { view, open, goMenu } = useHashRoute(onTransition);

  const viewRef = useRef<View>(view);
  const hoveredRef = useRef<number | null>(hovered);
  viewRef.current = view; hoveredRef.current = hovered;

  const enter = useCallback((i: number) => {
    setHovered(prev => { if (prev !== i) sfx.select(); return i; });
  }, [sfx]);

  // Single entry point for every way a row can be triggered — click, Enter/Z,
  // digit shortcut. An external entry (RESUME) opens a tab and leaves the view
  // and history untouched, so the menu is still there when the visitor comes
  // back to it. Every caller is a real user gesture, so no popup blocker.
  const activate = useCallback((i: number) => {
    const entry = SECTIONS[i];
    if (isExternal(entry)) {
      sfx.confirm();
      window.open(entry.href, '_blank', 'noopener,noreferrer');
      return;
    }
    open(entry.id);
  }, [open, sfx]);
  const move = useCallback((dir: 1 | -1) => {
    setHovered(prev => { const next = wrapIndex(prev, dir, SECTIONS.length); sfx.select(); return next; });
  }, [sfx]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (splashRef.current) return;
      const v = viewRef.current;
      if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') { if (v !== 'menu') goMenu(); return; }
      if (v !== 'menu') return;
      const digit = sectionIndexForDigit(e.key);
      if (digit >= 0) { setHovered(digit); sfx.select(); activate(digit); return; }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter' || e.key === 'z' || e.key === 'Z') {
        const h = hoveredRef.current; if (h != null) activate(h);
      }
    };
    const onMove = (e: MouseEvent) => {
      if (viewRef.current !== 'menu' || hoveredRef.current == null) return;
      const t = e.target as HTMLElement | null;
      if (t && t.closest && t.closest('[data-p5row]')) return;
      setHovered(null);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousemove', onMove);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('mousemove', onMove); };
  }, [goMenu, move, activate, sfx]);

  return (
    <SfxProvider sfx={sfx}>
      <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden',
        background: COLOR.base, color: COLOR.ink, fontFamily: FONT.oswald, userSelect: 'none' }}>
        <Backdrop />
        {view === 'menu'
          ? <MenuView hovered={hovered} muted={muted} onToggleMute={() => setMuted(m => !m)}
              onEnter={enter} onOpen={activate} narrow={narrow} menuVisit={menuVisit} />
          : <SectionPanel view={view} onBack={goMenu} projects={projects} competitions={competitions} compprogStats={compprogStats} />}
        {splash && <SplashScreen onDone={splashDone} />}
      </div>
    </SfxProvider>
  );
}
