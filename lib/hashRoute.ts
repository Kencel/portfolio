import { SECTIONS, type SectionId } from './data';

export type View = 'menu' | SectionId;

export function viewToHash(view: View): string {
  return view === 'menu' ? '' : `#${view}`;
}

// Anything we don't recognise — a typo, a stale link, a section id that has
// since been removed from SECTIONS — degrades to the menu rather than
// rendering a broken panel.
export function hashToView(hash: string): View {
  const id = hash.replace(/^#/, '');
  if (!id) return 'menu';
  return SECTIONS.some(s => s.id === id) ? (id as SectionId) : 'menu';
}
