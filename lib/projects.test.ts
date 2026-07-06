import { describe, it, expect } from 'vitest';
import { mapRow, allTags, filterByTags, sortProjects, type Project } from './projects';

const p = (over: Partial<Project>): Project => ({
  id: 1, title: 'A', description: 'd', imageUrl: null, linkUrl: null, year: 2025, tags: [], ...over,
});

describe('mapRow', () => {
  it('maps a full row', () => {
    expect(mapRow({
      id: 7, title: 'PROJECT SINAG', description: 'desc', image_url: '/sinag.jpg',
      link_url: 'https://x.dev/', year: 2025, tags: ['NEXT.JS', 'HACKATHON'],
    })).toEqual({
      id: 7, title: 'PROJECT SINAG', description: 'desc', imageUrl: '/sinag.jpg',
      linkUrl: 'https://x.dev/', year: 2025, tags: ['NEXT.JS', 'HACKATHON'],
    });
  });
  it('nulls empty/missing image and link', () => {
    const m = mapRow({ id: 1, title: 'T', description: 'd', image_url: '', link_url: null, year: 2024, tags: [] })!;
    expect(m.imageUrl).toBeNull();
    expect(m.linkUrl).toBeNull();
  });
  it('coerces a stringy year and rejects a non-numeric one', () => {
    expect(mapRow({ id: 1, title: 'T', description: 'd', year: '2023', tags: [] })!.year).toBe(2023);
    expect(mapRow({ id: 1, title: 'T', description: 'd', year: 'nope', tags: [] })).toBeNull();
  });
  it('rejects rows without title or description', () => {
    expect(mapRow({ id: 1, description: 'd', year: 2024, tags: [] })).toBeNull();
    expect(mapRow({ id: 1, title: 'T', year: 2024, tags: [] })).toBeNull();
  });
  it('defaults malformed tags to [] and drops non-string entries', () => {
    expect(mapRow({ id: 1, title: 'T', description: 'd', year: 2024, tags: 'oops' })!.tags).toEqual([]);
    expect(mapRow({ id: 1, title: 'T', description: 'd', year: 2024, tags: ['A', 3, 'B'] })!.tags).toEqual(['A', 'B']);
  });
});

describe('allTags', () => {
  it('returns the sorted union without duplicates', () => {
    expect(allTags([p({ tags: ['B', 'A'] }), p({ id: 2, tags: ['A', 'C'] })])).toEqual(['A', 'B', 'C']);
  });
});

describe('filterByTags', () => {
  const list = [p({ id: 1, tags: ['NEXT.JS'] }), p({ id: 2, tags: ['HACKATHON'] }), p({ id: 3, tags: [] })];
  it('empty selection returns everything', () => {
    expect(filterByTags(list, new Set())).toHaveLength(3);
  });
  it('OR semantics across selected tags', () => {
    expect(filterByTags(list, new Set(['NEXT.JS', 'HACKATHON'])).map(x => x.id)).toEqual([1, 2]);
  });
  it('no matches returns empty', () => {
    expect(filterByTags(list, new Set(['RUST']))).toEqual([]);
  });
});

describe('sortProjects', () => {
  const list = [
    p({ id: 1, title: 'BRAVO', year: 2024 }),
    p({ id: 2, title: 'ALPHA', year: 2025 }),
    p({ id: 3, title: 'CHARLIE', year: 2025 }),
  ];
  it('newest: year desc, title asc tie-break', () => {
    expect(sortProjects(list, 'newest').map(x => x.title)).toEqual(['ALPHA', 'CHARLIE', 'BRAVO']);
  });
  it('alpha: title asc', () => {
    expect(sortProjects(list, 'alpha').map(x => x.title)).toEqual(['ALPHA', 'BRAVO', 'CHARLIE']);
  });
  it('does not mutate the input', () => {
    const copy = [...list];
    sortProjects(list, 'alpha');
    expect(list).toEqual(copy);
  });
});
