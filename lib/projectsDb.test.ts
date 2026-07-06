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

  it('returns [] when the query throws', async () => {
    vi.stubEnv('DATABASE_URL', 'postgres://fake');
    queryMock.mockRejectedValue(new Error('boom'));
    const { getProjects } = await import('./projectsDb');
    expect(await getProjects()).toEqual([]);
  });
});
