'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SECTIONS, type SectionId } from '@/lib/data';
import { wrapIndex, sectionIndexForDigit } from '@/lib/nav';
import { useSfx } from '@/lib/useSfx';
import { Backdrop } from './Backdrop';
import { MenuView } from './MenuView';
import { SectionPanel } from './SectionPanel';

type View = 'menu' | SectionId;

export function Portfolio() {
  const [view, setView] = useState<View>('menu');
  const [hovered, setHovered] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);
  const sfx = useSfx(muted);

  const viewRef = useRef<View>(view);
  const hoveredRef = useRef<number | null>(hovered);
  viewRef.current = view; hoveredRef.current = hovered;

  const open = useCallback((id: SectionId) => { sfx.confirm(); setView(id); }, [sfx]);
  const goMenu = useCallback(() => { sfx.back(); setView('menu'); setHovered(null); }, [sfx]);
  const enter = useCallback((i: number) => {
    setHovered(prev => { if (prev !== i) sfx.select(); return i; });
  }, [sfx]);
  const clearHover = useCallback(() => setHovered(prev => (prev == null ? prev : null)), []);
  const move = useCallback((dir: 1 | -1) => {
    setHovered(prev => { const next = wrapIndex(prev, dir, SECTIONS.length); sfx.select(); return next; });
  }, [sfx]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const v = viewRef.current;
      if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') { if (v !== 'menu') goMenu(); return; }
      if (v !== 'menu') return;
      const digit = sectionIndexForDigit(e.key);
      if (digit >= 0) { setHovered(digit); sfx.select(); open(SECTIONS[digit].id); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
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
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', height: '100vh', overflow: 'hidden',
      background: '#0b0a0a', color: '#F4F1EA', fontFamily: 'var(--font-oswald), sans-serif', userSelect: 'none' }}>
      <Backdrop />
      {view === 'menu'
        ? <MenuView hovered={hovered} muted={muted} onToggleMute={() => setMuted(m => !m)}
            onEnter={enter} onOpen={open} onClearHover={clearHover} />
        : <SectionPanel view={view} onBack={goMenu} />}
    </div>
  );
}
