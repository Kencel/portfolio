import type { CSSProperties } from 'react';
import { HalftoneLayer } from './HalftoneLayer';
import { COLOR } from '@/lib/tokens';

export function Shard({
  clipPath,
  fill,
  opacity = 1,
  border,
  dots,
  style,
}: {
  clipPath: string;
  fill?: string;
  opacity?: number;
  border?: string;
  dots?: { color?: string; radius?: number; gap?: number; opacity?: number };
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        background: fill ?? 'transparent',
        opacity,
        clipPath,
        ...(border ? { border } : {}),
        ...style,
      }}
    >
      {dots && (
        <HalftoneLayer
          color={dots.color ?? COLOR.base}
          dotRadius={dots.radius ?? 1.6}
          gap={dots.gap ?? 12}
          opacity={dots.opacity ?? 0.22}
        />
      )}
    </div>
  );
}
