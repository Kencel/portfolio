'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Project } from '@/lib/projects';
import type { Competition } from '@/lib/competitions';
import type { CpStats } from '@/lib/cp/types';
import { SECTIONS, type SectionId } from '@/lib/data';
import { wrapIndex, sectionIndexForDigit } from '@/lib/nav';
import { useSfx } from '@/lib/useSfx';
import { useIsNarrow } from '@/lib/useIsMobile';
import { SfxProvider } from '@/lib/SfxContext';
import { Backdrop } from './Backdrop';
import { MenuView } from './MenuView';
import { SectionPanel } from './SectionPanel';
import { SplashScreen } from './SplashScreen';

type View = 'menu' | SectionId;

export function Portfolio({ projects, competitions, cpStats }: {
  projects: Project[];
  competitions: Competition[];
  cpStats: CpStats;
}) {
  const [view, setView] = useState<View>('menu');
  const [hovered, setHovered] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);
  const [menuVisit, setMenuVisit] = useState(0);
  const sfx = useSfx(muted);
  const narrow = useIsNarrow();

  // The splash plays on every load: the site has no routing, so a reload is
  // always a genuine re-entry. Starts true on server and client alike.
  const [splash, setSplash] = useState(true);
  const splashRef = useRef(splash);
  splashRef.current = splash;
  const splashDone = useCallback(() => { setSplash(false); }, []);

  const viewRef = useRef<View>(view);
  const hoveredRef = useRef<number | null>(hovered);
  viewRef.current = view; hoveredRef.current = hovered;

  const open = useCallback((id: SectionId) => { sfx.confirm(); setView(id); }, [sfx]);
  const goMenu = useCallback(() => { sfx.back(); setView('menu'); setHovered(null); setMenuVisit(v => v + 1); }, [sfx]);
  const enter = useCallback((i: number) => {
    setHovered(prev => { if (prev !== i) sfx.select(); return i; });
  }, [sfx]);
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
      if (digit >= 0) { setHovered(digit); sfx.select(); open(SECTIONS[digit].id); return; }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter' || e.key === 'z' || e.key === 'Z') {
        const h = hoveredRef.current; if (h != null) open(SECTIONS[h].id);
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
  }, [goMenu, move, open, sfx]);

  return (
    <SfxProvider sfx={sfx}>
      <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden',
        background: '#0b0a0a', color: '#F4F1EA', fontFamily: 'var(--font-oswald), sans-serif', userSelect: 'none' }}>
        <Backdrop />
        {view === 'menu'
          ? <MenuView hovered={hovered} muted={muted} onToggleMute={() => setMuted(m => !m)}
              onEnter={enter} onOpen={open} narrow={narrow} menuVisit={menuVisit} />
          : <SectionPanel view={view} onBack={goMenu} projects={projects} competitions={competitions} cpStats={cpStats} />}
        {splash && <SplashScreen onDone={splashDone} />}
      </div>
    </SfxProvider>
  );
}
