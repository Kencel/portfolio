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

const BASE_POP = '4px 4px 0 rgba(0,0,0,.85)';
const SELECTED_POP = '8px 8px 0 rgba(0,0,0,.9)';

export function rowState(hovered: number | null, i: number): RowState {
  if (hovered === i) {
    return {
      transform: 'skewX(-9deg) translateX(30px) scale(1.03)',
      background: 'var(--accent,#E4002B)', color: '#0b0a0a', opacity: 1, pop: SELECTED_POP,
    };
  }
  const dimmed = hovered != null;
  return {
    transform: dimmed ? 'skewX(-9deg) translateX(-6px)' : 'skewX(-9deg) translateX(0)',
    background: '#151313', color: '#F4F1EA', opacity: dimmed ? 0.5 : 1, pop: BASE_POP,
  };
}
