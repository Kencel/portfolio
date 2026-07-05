import type { CSSProperties, ReactNode } from 'react';

export function SkewBox({
  deg,
  children,
  style,
  innerStyle,
  onClick,
}: {
  deg: number;
  children: ReactNode;
  style?: CSSProperties;
  innerStyle?: CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div style={{ transform: `skewX(${deg}deg)`, ...style }} onClick={onClick}>
      <div style={{ transform: `skewX(${-deg}deg)`, ...innerStyle }}>
        {children}
      </div>
    </div>
  );
}
