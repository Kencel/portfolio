import { describe, it, expect } from 'vitest';
import { SECTIONS, SKILLS, CF_DEFAULTS, SOLVED } from './data';

describe('data', () => {
  it('has six sections in menu order', () => {
    expect(SECTIONS.map(s => s.id)).toEqual(['about','cp','projects','skills','education','contact']);
    expect(SECTIONS[0]).toMatchObject({ n: '01', label: 'ABOUT ME', sub: 'PROFILE' });
    expect(SECTIONS[5]).toMatchObject({ n: '06', label: 'CONTACT', sub: 'CONFIDANTS' });
  });
  it('has eight skills with percentage widths', () => {
    expect(SKILLS).toHaveLength(8);
    expect(SKILLS[0]).toEqual({ name: 'C++ / ALGORITHMS', w: '92%', tag: 'MAIN' });
    SKILLS.forEach(s => expect(s.w).toMatch(/^\d{1,3}%$/));
  });
  it('exposes CF defaults and manual solved count', () => {
    expect(CF_DEFAULTS).toEqual({ rating: 1445, maxRating: 1452, rank: 'Specialist' });
    expect(SOLVED).toBe(472);
  });
});
