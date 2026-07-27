import { SECTIONS, type SectionId } from './data';

export type View = 'menu' | SectionId;

// Section ids double as URL fragments, so a future SectionId must never
// collide with a DOM element id anywhere on the page — the browser will
// scroll-to-fragment on a matching id instead of leaving navigation to us.
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
