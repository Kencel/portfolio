import { MARQUEE } from '@/lib/data';

export function Backdrop() {
  return (
    <>
      {/* halftone dots — PROTOTYPE line 33 */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(var(--accent,#E4002B) 1.3px, transparent 1.4px)', backgroundSize: '15px 15px', opacity: .16, pointerEvents: 'none' }} />
      {/* diagonal hatch — line 34 */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(112deg, transparent 0 9px, rgba(228,0,43,.05) 9px 10px)', pointerEvents: 'none' }} />
      {/* red shard — line 35 */}
      <div style={{ position: 'absolute', top: '-14%', left: '-8%', width: '52%', height: '130%', background: 'var(--accent,#E4002B)', opacity: .9, clipPath: 'polygon(0 0, 100% 0, 62% 100%, 0% 100%)', pointerEvents: 'none' }} />
      {/* red shard dots — line 36 */}
      <div style={{ position: 'absolute', top: '-14%', left: '-8%', width: '52%', height: '130%', backgroundImage: 'radial-gradient(#0b0a0a 1.6px, transparent 1.7px)', backgroundSize: '12px 12px', opacity: .22, clipPath: 'polygon(0 0, 100% 0, 62% 100%, 0% 100%)', pointerEvents: 'none' }} />
      {/* outlined shard — line 37 */}
      <div style={{ position: 'absolute', bottom: '-30%', right: '-6%', width: '46%', height: '80%', background: 'transparent', border: '3px solid var(--accent,#E4002B)', opacity: .35, clipPath: 'polygon(18% 0, 100% 12%, 84% 100%, 0 82%)', pointerEvents: 'none', transform: 'rotate(-4deg)' }} />
      {/* marquee band — lines 40–45 */}
      <div style={{ position: 'absolute', bottom: '6%', left: '-10%', width: '130%', transform: 'rotate(-4deg)', overflow: 'hidden', pointerEvents: 'none', opacity: .9, zIndex: 1 }}>
        <div style={{ display: 'flex', width: 'max-content', whiteSpace: 'nowrap', animation: 'p5marquee 34s linear infinite', background: '#0b0a0a', borderTop: '2px solid var(--accent,#E4002B)', borderBottom: '2px solid var(--accent,#E4002B)' }}>
          <span style={{ fontFamily: "'Anton', var(--font-anton), sans-serif", fontSize: 16, letterSpacing: '.32em', color: 'var(--accent,#E4002B)', padding: '5px 0' }}>{MARQUEE}{MARQUEE}</span>
          <span aria-hidden style={{ fontFamily: "'Anton', var(--font-anton), sans-serif", fontSize: 16, letterSpacing: '.32em', color: 'var(--accent,#E4002B)', padding: '5px 0' }}>{MARQUEE}{MARQUEE}</span>
        </div>
      </div>
    </>
  );
}
