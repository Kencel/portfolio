import { describe, it, expect } from 'vitest';
import { SECTIONS } from './data';
import { viewToHash, hashToView } from './hashRoute';

describe('viewToHash', () => {
  it('maps the menu to an empty hash', () => expect(viewToHash('menu')).toBe(''));
  it('maps a section to its id with a leading #', () => expect(viewToHash('projects')).toBe('#projects'));
});

describe('hashToView', () => {
  it('round-trips every routable section in SECTIONS', () => {
    for (const s of SECTIONS) {
      if (!s.id) continue;
      expect(hashToView(viewToHash(s.id))).toBe(s.id);
    }
  });
  it('falls back to the menu for an external entry that has no view', () => {
    expect(hashToView('#resume')).toBe('menu');
  });
  it('falls back to the menu for the retired education section', () => {
    expect(hashToView('#education')).toBe('menu');
  });
  it('treats an empty hash as the menu', () => expect(hashToView('')).toBe('menu'));
  it('treats a bare # as the menu', () => expect(hashToView('#')).toBe('menu'));
  it('tolerates a missing leading #', () => expect(hashToView('compprog')).toBe('compprog'));
  it('falls back to the menu for an unknown hash', () => expect(hashToView('#nonsense')).toBe('menu'));
  it('falls back to the menu for a removed section id', () => expect(hashToView('#battle-record')).toBe('menu'));
});
