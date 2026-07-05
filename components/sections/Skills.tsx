import { SKILLS } from '@/lib/data';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { FONT } from '@/lib/tokens';

// PROTOTYPE lines 233-245
export function Skills() {
  return (
    <div style={{ maxWidth: 1150, marginLeft: 'auto', marginRight: 'auto' }}>
      {SKILLS.map((sk) => (
        <div key={sk.name} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 11, transform: 'skewX(-6deg)' }}>
          <span style={{ transform: 'skewX(6deg)', fontFamily: FONT.anton, fontSize: 'clamp(17px,1.7vw,23px)', minWidth: 'min(240px,34vw)' }}>{sk.name}</span>
          <ProgressBar pct={sk.w} style={{ flex: 1 }} />
          <span style={{ transform: 'skewX(6deg)', fontFamily: FONT.bebas, letterSpacing: '.14em', fontSize: 14, opacity: .75, minWidth: 60 }}>{sk.tag}</span>
        </div>
      ))}
    </div>
  );
}
