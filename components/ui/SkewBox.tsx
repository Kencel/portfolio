import type { CSSProperties, ReactNode } from 'react';

export function SkewBox({
  deg,
  children,
  style,
  onClick,
}: {
  deg: number;
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div style={{ transform: `skewX(${deg}deg)`, ...style }} onClick={onClick}>
      <div style={{ transform: `skewX(${-deg}deg)` }}>
        {children}
      </div>
    </div>
  );
}
