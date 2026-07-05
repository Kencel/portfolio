import { describe, it, expect } from 'vitest';
import { SECTIONS, SKILLS, CF_DEFAULTS, SOLVED, ATTRIBUTES } from './data';

describe('data', () => {
  it('has six sections in menu order', () => {
    expect(SECTIONS.map(s => s.id)).toEqual(['about','cp','projects','skills','education','contact']);
    expect(SECTIONS[0]).toMatchObject({ n: '01', label: 'ABOUT ME', sub: 'PROFILE' });
    expect(SECTIONS[5]).toMatchObject({ n: '06', label: 'CONTACT', sub: 'CONFIDANTS' });
  });
  it('lists skills as plain names without quantification', () => {
    expect(SKILLS).toEqual([
      'C++', 'PYTHON', 'JAVA', 'DJANGO', 'NEXT.JS', 'REACT', 'NODE.JS', 'PNPM', 'GIT', 'POSTGRESQL',
    ]);
  });
  it('exposes CF defaults and manual solved count', () => {
    expect(CF_DEFAULTS).toEqual({ rating: 1445, maxRating: 1452, rank: 'Specialist' });
    expect(SOLVED).toBe(472);
  });
  it('has six attributes with 0-100 values', () => {
    expect(ATTRIBUTES).toHaveLength(6);
    expect(ATTRIBUTES.map(a => a.axis)).toEqual([
      'KNOWLEDGE', 'PROFICIENCY', 'GUTS', 'DILIGENCE', 'INGENUITY', 'ADAPTABILITY',
    ]);
    ATTRIBUTES.forEach(a => {
      expect(a.value).toBeGreaterThanOrEqual(0);
      expect(a.value).toBeLessThanOrEqual(100);
    });
  });
});
