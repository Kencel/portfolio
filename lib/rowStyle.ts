import { COLOR, POP, SKEW } from '@/lib/tokens';

// Per-state pieces for a menu row. The transform (skew + hover translate/scale)
// goes on the AngularCard wrapper so the white backing sheet tracks it; the
// background/color/opacity go on the content layer that sits on the sheet.
export interface RowState {
  transform: string;
  background: string;
  color: string;
  opacity: number;
  pop: string;
}

export function rowState(hovered: number | null, i: number): RowState {
  if (hovered === i) {
    return {
      transform: `skewX(${SKEW.row}deg) translateX(30px) scale(1.03)`,
      background: COLOR.accent, color: COLOR.base, opacity: 1, pop: POP.rowSelected,
    };
  }
  const dimmed = hovered != null;
  return {
    transform: dimmed ? `skewX(${SKEW.row}deg) translateX(-6px)` : `skewX(${SKEW.row}deg) translateX(0)`,
    background: COLOR.row, color: COLOR.ink, opacity: dimmed ? 0.5 : 1, pop: POP.rowBase,
  };
}
