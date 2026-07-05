import { SKILLS } from '@/lib/data';
import { COLOR, FONT, POP, SKEW } from '@/lib/tokens';
import type { IconType } from 'react-icons';
import {
  SiCplusplus, SiPython, SiDjango, SiNextdotjs, SiReact,
  SiNodedotjs, SiPnpm, SiGit, SiPostgresql,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';

// simple-icons dropped the Java mark, so it comes from Font Awesome instead
const ICONS: Record<string, IconType> = {
  'C++': SiCplusplus,
  'PYTHON': SiPython,
  'JAVA': FaJava,
  'DJANGO': SiDjango,
  'NEXT.JS': SiNextdotjs,
  'REACT': SiReact,
  'NODE.JS': SiNodedotjs,
  'PNPM': SiPnpm,
  'GIT': SiGit,
  'POSTGRESQL': SiPostgresql,
};

export function Skills() {
  return (
    <div style={{ maxWidth: 1150, marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexWrap: 'wrap', gap: 'clamp(12px,1.8vw,22px)' }}>
      {SKILLS.map((name, i) => {
        const Icon = ICONS[name];
        return (
          <div
            key={name}
            style={{
              transform: `skewX(${SKEW.row}deg)`,
              background: COLOR.row,
              border: `2px solid ${COLOR.tagBorder}`,
              boxShadow: POP.rowBase,
              padding: '14px 30px',
              display: 'flex',
              alignItems: 'center',
              gap: 15,
            }}
          >
            <span style={{ transform: `skewX(${-SKEW.row}deg)`, fontFamily: FONT.bebas, letterSpacing: '.18em', fontSize: 13, opacity: .55 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span style={{ transform: `skewX(${-SKEW.row}deg)`, display: 'inline-flex', alignItems: 'center', gap: 11, fontSize: 'clamp(19px,2vw,28px)' }}>
              {Icon && <Icon aria-hidden style={{ opacity: .9, flexShrink: 0 }} />}
              <span style={{ fontFamily: FONT.anton, textTransform: 'uppercase' }}>{name}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
