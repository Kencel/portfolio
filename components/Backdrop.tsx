import { MARQUEE } from '@/lib/data';
import { COLOR, FONT } from '@/lib/tokens';
import { HalftoneLayer } from './ui/HalftoneLayer';
import { Shard } from './ui/Shard';

export function Backdrop() {
  return (
    <>
      {/* halftone dots — PROTOTYPE line 33 */}
      <HalftoneLayer color={COLOR.accent} dotRadius={1.3} gap={15} opacity={.16} />
      {/* diagonal hatch — line 34 */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(112deg, transparent 0 9px, rgba(228,0,43,.05) 9px 10px)', pointerEvents: 'none' }} />
      {/* red shard + its dots — line 35-36 */}
      <Shard
        clipPath="polygon(0 0, 100% 0, 62% 100%, 0% 100%)"
        fill={COLOR.accent}
        opacity={.9}
        style={{ top: '-14%', left: '-8%', width: '52%', height: '130%' }}
        dots={{ color: COLOR.base, radius: 1.6, gap: 12, opacity: .22 }}
      />
      {/* outlined shard — line 37 */}
      <Shard
        clipPath="polygon(18% 0, 100% 12%, 84% 100%, 0 82%)"
        border={`3px solid ${COLOR.accent}`}
        opacity={.35}
        style={{ bottom: '-30%', right: '-6%', width: '46%', height: '80%', transform: 'rotate(-4deg)' }}
      />
      {/* marquee band — lines 40–45.
          Two identical groups + a -50% translate = seamless loop. Each group must
          be at least as wide as the band (130vw) or a blank gap scrolls through on
          wide screens; MARQUEE is ~1000px, so 6 copies (~6000px) covers past 4K.
          Duration scales with copy count to keep velocity constant: 34s was tuned
          for 2 copies, so 6 copies → 102s. Change both together. */}
      <div style={{ position: 'absolute', bottom: '6%', left: '-10%', width: '130%', transform: 'rotate(-4deg)', overflow: 'hidden', pointerEvents: 'none', opacity: .9, zIndex: 1 }}>
        <div style={{ display: 'flex', width: 'max-content', whiteSpace: 'nowrap', animation: 'p5marquee 102s linear infinite', background: COLOR.base, borderTop: `2px solid ${COLOR.accent}`, borderBottom: `2px solid ${COLOR.accent}` }}>
          <span style={{ fontFamily: `'Anton', ${FONT.anton}`, fontSize: 16, letterSpacing: '.32em', color: COLOR.accent, padding: '5px 0' }}>{MARQUEE.repeat(6)}</span>
          <span aria-hidden style={{ fontFamily: `'Anton', ${FONT.anton}`, fontSize: 16, letterSpacing: '.32em', color: COLOR.accent, padding: '5px 0' }}>{MARQUEE.repeat(6)}</span>
        </div>
      </div>
    </>
  );
}
