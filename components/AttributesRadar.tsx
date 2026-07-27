import { ATTRIBUTES } from '@/lib/data';
import { COLOR, FONT } from '@/lib/tokens';

const CX = 150;
const CY = 150;
const MAX_R = 110;
const ACCENT = COLOR.accent;
// Spokes divide the circle evenly, so ATTRIBUTES can gain or lose an axis
// without breaking the geometry.
const STEP = 360 / ATTRIBUTES.length;

function pt(i: number, f: number): [number, number] {
  const ang = (-90 + i * STEP) * (Math.PI / 180);
  return [CX + Math.cos(ang) * MAX_R * f, CY + Math.sin(ang) * MAX_R * f];
}

function ringPoints(f: number): string {
  return ATTRIBUTES.map((_, i) => pt(i, f).join(',')).join(' ');
}

export function AttributesRadar() {
  const statPoints = ATTRIBUTES.map((a, i) => pt(i, a.value / 100).join(',')).join(' ');
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox="-24 0 348 300" width="100%" role="img" aria-label="Attributes radar" style={{ maxWidth: 340, display: 'block', margin: '0 auto' }}>
      {/* grid rings */}
      {rings.map(f => (
        <polygon key={f} points={ringPoints(f)} fill="none" stroke="rgba(244,241,234,.18)" strokeWidth={1} />
      ))}
      {/* spokes */}
      {ATTRIBUTES.map((_, i) => {
        const [x, y] = pt(i, 1);
        return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="rgba(244,241,234,.18)" strokeWidth={1} />;
      })}
      {/* stat polygon */}
      <polygon points={statPoints} fill={ACCENT} fillOpacity={0.32} stroke={ACCENT} strokeWidth={2.5} strokeLinejoin="miter" />
      {/* vertex dots */}
      {ATTRIBUTES.map((a, i) => {
        const [x, y] = pt(i, a.value / 100);
        return <circle key={i} cx={x} cy={y} r={3} fill={ACCENT} />;
      })}
      {/* labels */}
      {ATTRIBUTES.map((a, i) => {
        const [x, y] = pt(i, 1.18);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={COLOR.ink}
            style={{ fontFamily: FONT.bebas, fontSize: 13, letterSpacing: '.12em' }}
          >
            {a.axis}<tspan dx={4} fill={ACCENT}>{a.value}</tspan>
          </text>
        );
      })}
    </svg>
  );
}
