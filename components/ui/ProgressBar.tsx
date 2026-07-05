import type { CSSProperties } from 'react';
import { COLOR } from '@/lib/tokens';

export function ProgressBar({
  pct,
  fill = COLOR.accent,
  height = 18,
  style,
}: {
  pct: string;
  fill?: string;
  height?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        height,
        background: COLOR.trackBg,
        border: `1px solid ${COLOR.trackBorder}`,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ height: '100%', width: pct, background: fill }} />
    </div>
  );
}
