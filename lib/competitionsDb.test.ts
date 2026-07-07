import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const queryMock = vi.fn();
vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => queryMock),
}));

describe('getCompetitions', () => {
  beforeEach(() => { vi.resetModules(); queryMock.mockReset(); });
  afterEach(() => { vi.unstubAllEnvs(); });

  it('returns [] when DATABASE_URL is not set', async () => {
    vi.stubEnv('DATABASE_URL', '');
    const { getCompetitions } = await import('./competitionsDb');
    expect(await getCompetitions()).toEqual([]);
  });

  it('maps rows and drops malformed ones', async () => {
    vi.stubEnv('DATABASE_URL', 'postgres://fake');
    queryMock.mockResolvedValue([
      { id: 1, name: 'Algolympics 2026', event_date: '2026-05-01', team: 'Team KMP', result: 'Finalist', placement: 'Finalist', note: null, cert_image_url: null },
      { id: 2, event_date: '2023-02-01', result: 'no name' },
    ]);
    const { getCompetitions } = await import('./competitionsDb');
    const out = await getCompetitions();
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ name: 'Algolympics 2026', eventDate: '2026-05-01' });
  });

  it('retries once and returns rows when the first attempt fails', async () => {
    vi.useFakeTimers();
    try {
      vi.stubEnv('DATABASE_URL', 'postgres://fake');
      queryMock
        .mockRejectedValueOnce(new Error('cold start timeout'))
        .mockResolvedValueOnce([
          { id: 1, name: 'CCC 2023', event_date: '2023-02-01', team: null, result: '60 points', placement: 'Top 25%', note: null, cert_image_url: null },
        ]);
      const { getCompetitions } = await import('./competitionsDb');
      const pending = getCompetitions();
      await vi.advanceTimersByTimeAsync(2000);
      const out = await pending;
      expect(out).toHaveLength(1);
      expect(queryMock).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it('returns [] when both attempts throw', async () => {
    vi.useFakeTimers();
    try {
      vi.stubEnv('DATABASE_URL', 'postgres://fake');
      queryMock.mockRejectedValue(new Error('boom'));
      const { getCompetitions } = await import('./competitionsDb');
      const pending = getCompetitions();
      await vi.advanceTimersByTimeAsync(2000);
      expect(await pending).toEqual([]);
      expect(queryMock).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });
});
