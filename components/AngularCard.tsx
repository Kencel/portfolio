import type { CSSProperties, ReactNode } from 'react';
import { BLACK_POP } from '@/lib/angular';

/**
 * White calling-card frame that fully ENCASES its content. It's a clean
 * quadrilateral (a skewed rectangle when a skew transform is passed via
 * `style`) whose white shows as a uniform border around the content, because
 * the content sits in the frame's padding box — the frame and content are
 * concentric, so the white always surrounds the content regardless of skew.
 *
 * The frame is the element's own box (no negative insets, no rotation, no
 * clip-path), so it never bleeds past its grid/flex cell into a neighbouring
 * container. Only the hard offset shadow extends outward, and it stays within
 * the layout gap.
 */
export function AngularCard({
  children,
  pop = BLACK_POP,
  frame = 12,
  style,
  onClick,
  onMouseEnter,
  rowMarker = false,
}: {
  children: ReactNode;
  pop?: string;
  frame?: number;
  style?: CSSProperties;
  onClick?: () => void;
  onMouseEnter?: () => void;
  rowMarker?: boolean;
}) {
  return (
    <div
      style={{ position: 'relative', background: '#F4F1EA', padding: frame, boxShadow: pop, ...style }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      {...(rowMarker ? { 'data-p5row': '1' } : {})}
    >
      {children}
    </div>
  );
}
