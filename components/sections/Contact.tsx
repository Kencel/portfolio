import { Fragment, type CSSProperties } from 'react';
import { AngularCard } from '@/components/AngularCard';
import { HoverQuad } from '@/components/ui/HoverQuad';
import { COLOR, FONT } from '@/lib/tokens';

// PROTOTYPE lines 272-287
const CONTACTS: {
  seed: number; label: string; labelStyle: CSSProperties; handle: string; href?: string;
}[] = [
  { seed: 31, label: 'CODEFORCES', labelStyle: { color: COLOR.cfteal }, handle: '@RamenNagi ►', href: 'https://codeforces.com/profile/RamenNagi' },
  { seed: 32, label: 'ATCODER', labelStyle: { color: COLOR.accent }, handle: '@RamenNagi ►', href: 'https://atcoder.jp/users/RamenNagi' },
  { seed: 33, label: 'GITHUB', labelStyle: { opacity: .8 }, handle: '@Kencel ►', href: 'https://github.com/Kencel' },
  { seed: 34, label: 'DISCORD', labelStyle: { color: COLOR.discord }, handle: 'ramen.nagi' },
];

export function Contact() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16, maxWidth: 1000, marginLeft: 'auto', marginRight: 'auto' }}>
      {CONTACTS.map(c => {
        const inner = (
          <div style={{ transform: 'skewX(4deg)' }}>
            <div style={{ fontFamily: FONT.bebas, letterSpacing: '.2em', fontSize: 15, ...c.labelStyle }}>{c.label}</div>
            <div style={{ fontFamily: FONT.anton, fontSize: 'clamp(24px,2.4vw,32px)' }}>{c.handle}</div>
          </div>
        );
        const card = (
          <AngularCard seed={c.seed} style={{ transform: 'skewX(-4deg)' }}>
            {c.href ? (
              <a href={c.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: COLOR.ink, background: COLOR.panel, padding: '22px 24px', display: 'block' }}>
                {inner}
              </a>
            ) : (
              <div style={{ color: COLOR.ink, background: COLOR.panel, padding: '22px 24px' }}>
                {inner}
              </div>
            )}
          </AngularCard>
        );
        return c.href
          ? <HoverQuad key={c.label} seed={c.seed}>{card}</HoverQuad>
          : <Fragment key={c.label}>{card}</Fragment>;
      })}
    </div>
  );
}
