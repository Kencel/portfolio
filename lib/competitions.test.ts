import { describe, it, expect } from 'vitest';
import { mapCompetitionRow, formatMonthYear } from './competitions';

const row = {
  id: 1, name: 'UP ACM Algolympics 2026', event_date: '2026-05-01', team: 'Team KMP',
  result: 'Finalist', placement: 'Finalist', note: null, cert_image_url: '/algolympics2026_cert.jpg',
};

describe('mapCompetitionRow', () => {
  it('maps a full row', () => {
    expect(mapCompetitionRow(row)).toEqual({
      id: 1, name: 'UP ACM Algolympics 2026', eventDate: '2026-05-01', team: 'Team KMP',
      result: 'Finalist', placement: 'Finalist', note: null, certImageUrl: '/algolympics2026_cert.jpg',
    });
  });
  it('accepts a Date object for event_date (driver-dependent)', () => {
    const out = mapCompetitionRow({ ...row, event_date: new Date('2026-05-01T00:00:00Z') });
    expect(out?.eventDate).toBe('2026-05-01');
  });
  it('treats driver Date objects as local dates (Neon parses date columns to local midnight)', () => {
    const out = mapCompetitionRow({ ...row, event_date: new Date(2026, 4, 1) }); // local midnight May 1
    expect(out?.eventDate).toBe('2026-05-01');
  });
  it('nulls optional fields that are missing or non-string', () => {
    const out = mapCompetitionRow({ id: 2, name: 'CCC 2023', event_date: '2023-02-01', result: '60 points', team: 7 });
    expect(out).toMatchObject({ team: null, placement: null, note: null, certImageUrl: null });
  });
  it('rejects rows missing required fields or with unusable dates', () => {
    expect(mapCompetitionRow({ id: 3, event_date: '2023-02-01', result: 'x' })).toBeNull();       // no name
    expect(mapCompetitionRow({ id: 3, name: 'X', event_date: 'soon', result: 'x' })).toBeNull();  // bad date
    expect(mapCompetitionRow({ id: 'x', name: 'X', event_date: '2023-02-01', result: 'x' })).toBeNull();
  });
  it('sanitizes cert_image_url like project images', () => {
    expect(mapCompetitionRow({ ...row, cert_image_url: 'javascript:alert(1)' })?.certImageUrl).toBeNull();
  });
});

describe('formatMonthYear', () => {
  it('renders SHORT-MONTH YEAR in caps', () => {
    expect(formatMonthYear('2026-05-01')).toBe('MAY 2026');
    expect(formatMonthYear('2026-03-01')).toBe('MAR 2026');
    expect(formatMonthYear('2023-02-01')).toBe('FEB 2023');
  });
});
