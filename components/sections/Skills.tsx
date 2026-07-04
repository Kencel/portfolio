import { SKILLS } from '@/lib/data';

// PROTOTYPE lines 233-245
export function Skills() {
  return (
    <div style={{ maxWidth: 1150, marginLeft: 'auto', marginRight: 'auto' }}>
      {SKILLS.map((sk) => (
        <div key={sk.name} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 11, transform: 'skewX(-6deg)' }}>
          <span style={{ transform: 'skewX(6deg)', fontFamily: "var(--font-anton), sans-serif", fontSize: 'clamp(17px,1.7vw,23px)', minWidth: 'min(240px,34vw)' }}>{sk.name}</span>
          <div style={{ flex: 1, height: 18, background: '#1c1a1a', border: '1px solid #333', position: 'relative', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--accent,#E4002B)', width: sk.w }} />
          </div>
          <span style={{ transform: 'skewX(6deg)', fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.14em', fontSize: 14, opacity: .75, minWidth: 60 }}>{sk.tag}</span>
        </div>
      ))}
    </div>
  );
}
