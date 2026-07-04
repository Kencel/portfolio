import type { CSSProperties, ReactNode } from 'react';

/**
 * Horizontally-centered max-width wrapper. X-axis centering ONLY — auto left/right
 * margins with a capped width. Never centers vertically; height stays dynamic and
 * flows from the top. Shared by the menu landing and section panels.
 */
export function CenterFrame({
  children,
  maxWidth = 1180,
  style,
}: {
  children: ReactNode;
  maxWidth?: number;
  style?: CSSProperties;
}) {
  return (
    <div style={{ width: '100%', maxWidth, marginLeft: 'auto', marginRight: 'auto', ...style }}>
      {children}
    </div>
  );
}
