'use client';
import { useMemo, useState, type CSSProperties } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { COLOR, FONT } from '@/lib/tokens';
import { allTags, filterByTags, sortProjects, type Project, type SortMode } from '@/lib/projects';
import { chip, unskew } from '@/lib/chipStyle';
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
        {/* single row; overflowing chips scroll horizontally instead of wrapping.
            minWidth: 0 lets the flex child shrink below its content width so the
            overflow happens here, not on the page. */}
        <div data-testid="filter-bar" style={{ display: 'flex', flexWrap: 'nowrap', gap: 8, flex: '1 1 auto', minWidth: 0, overflowX: 'auto', scrollbarWidth: 'thin', padding: '2px 0 6px' }}>
          <button aria-pressed={selected.size === 0} onClick={() => setSelected(new Set())} style={{ ...chip(selected.size === 0), flexShrink: 0 }}>
            <span style={unskew}>ALL</span>
          </button>
          {tags.map(tag => (
            <button key={tag} aria-pressed={selected.has(tag)} onClick={() => toggleTag(tag)} style={{ ...chip(selected.has(tag)), flexShrink: 0 }}>
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
