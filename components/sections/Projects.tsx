'use client';
import { useMemo, useState, type CSSProperties } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { COLOR, FONT } from '@/lib/tokens';
import { allTags, filterByTags, sortProjects, type Project, type SortMode } from '@/lib/projects';

const chip = (active: boolean): CSSProperties => ({
  background: active ? COLOR.accent : 'transparent',
  color: active ? COLOR.base : COLOR.ink,
  border: `1px solid ${active ? COLOR.accent : COLOR.tagBorder}`,
  fontFamily: FONT.bebas, letterSpacing: '.12em', fontSize: 15,
  padding: '4px 14px', cursor: 'pointer', transform: 'skewX(-8deg)',
});
const unskew: CSSProperties = { display: 'inline-block', transform: 'skewX(8deg)' };
const themedLine: CSSProperties = {
  fontFamily: FONT.bebas, letterSpacing: '.2em', fontSize: 22,
  color: COLOR.ink, opacity: .75, textAlign: 'center', padding: '40px 0',
};

export function Projects({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [sort, setSort] = useState<SortMode>('newest');
  const tags = useMemo(() => allTags(projects), [projects]);
  const shown = useMemo(
    () => sortProjects(filterByTags(projects, selected), sort),
    [projects, selected, sort],
  );

  if (projects.length === 0) {
    return <p style={themedLine}>TREASURE DATA UNAVAILABLE — CHECK BACK SOON</p>;
  }

  const toggleTag = (tag: string) => setSelected(prev => {
    const next = new Set(prev);
    if (next.has(tag)) next.delete(tag); else next.add(tag);
    return next;
  });

  return (
    <div style={{ maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto' }}>
      {/* filter + sort bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 26 }}>
        <div data-testid="filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button aria-pressed={selected.size === 0} onClick={() => setSelected(new Set())} style={chip(selected.size === 0)}>
            <span style={unskew}>ALL</span>
          </button>
          {tags.map(tag => (
            <button key={tag} aria-pressed={selected.has(tag)} onClick={() => toggleTag(tag)} style={chip(selected.has(tag))}>
              <span style={unskew}>{tag}</span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button aria-pressed={sort === 'newest'} onClick={() => setSort('newest')} style={chip(sort === 'newest')}>
            <span style={unskew}>NEWEST</span>
          </button>
          <button aria-pressed={sort === 'alpha'} onClick={() => setSort('alpha')} style={chip(sort === 'alpha')}>
            <span style={unskew}>A–Z</span>
          </button>
        </div>
      </div>

      {shown.length === 0 ? (
        <p style={themedLine}>NO TREASURES FOUND — TRY ANOTHER TAG</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 22 }}>
          {shown.map(p => <ProjectCard key={p.id} project={p} selectedTags={selected} />)}
        </div>
      )}
    </div>
  );
}
