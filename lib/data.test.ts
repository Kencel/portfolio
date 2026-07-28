import { describe, it, expect } from 'vitest';
import { SECTIONS, SKILLS, ATTRIBUTES, RESUME_URL } from './data';

describe('data', () => {
  it('has six rows in menu order', () => {
    expect(SECTIONS.map(s => s.id)).toEqual(['about','compprog','projects','skills',undefined,'contact']);
    expect(SECTIONS[0]).toMatchObject({ n: '01', label: 'ABOUT ME', sub: 'PROFILE' });
    expect(SECTIONS[5]).toMatchObject({ n: '06', label: 'CONTACT', sub: 'CONFIDANTS' });
  });
  it('numbers the rows 01..06 so the digit shortcuts line up', () => {
    expect(SECTIONS.map(s => s.n)).toEqual(['01','02','03','04','05','06']);
  });
  it('makes RESUME an external entry — an href and no id, so it never routes', () => {
    const resume = SECTIONS[4];
    expect(resume).toMatchObject({ label: 'RESUME', href: RESUME_URL });
    expect(resume.id).toBeUndefined();
    expect(RESUME_URL).toBe('https://resume.kenazc.com');
  });
  it('keeps every other row routable', () => {
    for (const s of SECTIONS) expect(s.id != null || s.href != null).toBe(true);
  });
  it('lists skills as plain names without quantification', () => {
    expect(SKILLS).toEqual([
      'C++', 'PYTHON', 'JAVA', 'DJANGO', 'NEXT.JS', 'REACT', 'NODE.JS', 'PNPM', 'GIT', 'POSTGRESQL',
    ]);
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
