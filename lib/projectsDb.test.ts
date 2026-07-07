import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const queryMock = vi.fn();
vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => queryMock),
}));

describe('getProjects', () => {
  beforeEach(() => { vi.resetModules(); queryMock.mockReset(); });
  afterEach(() => { vi.unstubAllEnvs(); });

  it('returns [] when DATABASE_URL is not set', async () => {
    vi.stubEnv('DATABASE_URL', '');
    const { getProjects } = await import('./projectsDb');
    expect(await getProjects()).toEqual([]);
  });

  it('maps rows and drops malformed ones', async () => {
    vi.stubEnv('DATABASE_URL', 'postgres://fake');
    queryMock.mockResolvedValue([
      { id: 1, title: 'T', description: 'd', image_url: null, link_url: null, year: 2025, tags: ['A'] },
      { id: 2, description: 'no title', year: 2024, tags: [] },
    ]);
    const { getProjects } = await import('./projectsDb');
    const out = await getProjects();
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ title: 'T', year: 2025, tags: ['A'] });
  });

  it('retries once and returns rows when the first attempt fails', async () => {
    vi.useFakeTimers();
    try {
      vi.stubEnv('DATABASE_URL', 'postgres://fake');
      queryMock
        .mockRejectedValueOnce(new Error('cold start timeout'))
        .mockResolvedValueOnce([
          { id: 1, title: 'T', description: 'd', image_url: null, link_url: null, year: 2025, tags: ['A'] },
        ]);
      const { getProjects } = await import('./projectsDb');
      const pending = getProjects();
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
      const { getProjects } = await import('./projectsDb');
      const pending = getProjects();
      await vi.advanceTimersByTimeAsync(2000);
      expect(await pending).toEqual([]);
      expect(queryMock).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });
});
