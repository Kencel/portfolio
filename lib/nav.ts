import { SECTIONS } from './data';

export function wrapIndex(current: number | null, dir: 1 | -1, len: number): number {
  const start = current == null ? (dir > 0 ? -1 : 0) : current;
  return (start + dir + len) % len;
}

export function sectionIndexForDigit(key: string): number {
  return SECTIONS.findIndex(s => s.n === '0' + key);
}
