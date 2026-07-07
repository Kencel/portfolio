import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Cp } from './Cp';
import type { CpStats } from '@/lib/cp/types';
import type { Competition } from '@/lib/competitions';

const cf = {
  rating: 1445, peakRating: 1452, rankLabel: 'Specialist', solved: 472,
  contests: [
    { name: 'Round A', url: 'https://codeforces.com/contest/1900', date: '2025-01-01', ratingAfter: 1445, delta: 45, performance: 1490, rank: 1543 },
    { name: 'Round B', url: 'https://codeforces.com/contest/1901', date: '2025-02-01', ratingAfter: 1430, delta: -15, performance: 1415, rank: 800 },
  ],
  buckets: [{ lo: 800, count: 3 }],
};
const atcoder = {
  rating: 120, peakRating: 250, rankLabel: 'Gray', solved: 30,
  contests: [
    { name: 'ABC 300', url: 'https://atcoder.jp/contests/abc300', date: '2023-04-30', ratingAfter: 120, delta: 120, performance: 400, rank: 512 },
  ],
  buckets: [{ lo: 0, count: 10 }],
};
const stats: CpStats = { cf, atcoder };

const competitions: Competition[] = [
  { id: 1, name: 'UP ACM Algolympics 2026', eventDate: '2026-05-01', team: 'Team KMP', result: 'Finalist', placement: 'Finalist', note: null, certImageUrl: '/algolympics2026_cert.jpg' },
  { id: 2, name: 'Canadian Computing Competition 2023', eventDate: '2023-02-01', team: null, result: '60 points', placement: 'Top 25%', note: 'Certificate of Distinction, Junior Division', certImageUrl: null },
];

describe('Cp tabs', () => {
  it('shows the Codeforces tab by default with big numbers and highlights', () => {
    render(<Cp stats={stats} competitions={competitions} />);
    const panel = screen.getByTestId('platform-panel');
    expect(within(panel).getByText('1445')).toBeInTheDocument();
    expect(within(panel).getByText(/1452/)).toBeInTheDocument();
    expect(within(panel).getByText('472')).toBeInTheDocument();
    expect(within(panel).getByText(/BEST RANK/)).toBeInTheDocument();
    expect(within(panel).getByText(/#800/)).toBeInTheDocument();     // min rank
    expect(within(panel).getByText(/\+45/)).toBeInTheDocument();     // biggest gain
    expect(screen.getByText('RATING')).toBeInTheDocument();
    expect(screen.getByText(/PERFORMANCE.*APPROX/)).toBeInTheDocument(); // CF perf is approximated
  });

  it('switches to AtCoder (official performance — no APPROX)', () => {
    render(<Cp stats={stats} competitions={competitions} />);
    fireEvent.click(screen.getByRole('button', { name: 'ATCODER' }));
    const panel = screen.getByTestId('platform-panel');
    expect(within(panel).getByText('120')).toBeInTheDocument();
    expect(screen.getByText('PERFORMANCE')).toBeInTheDocument();
    expect(screen.queryByText(/APPROX/)).not.toBeInTheDocument();
  });

  it('switches to Competitions, newest first, with team chips, notes, and cert link', () => {
    render(<Cp stats={stats} competitions={competitions} />);
    fireEvent.click(screen.getByRole('button', { name: 'COMPETITIONS' }));
    const names = screen.getAllByTestId('competition-name').map(el => el.textContent);
    expect(names).toEqual(['UP ACM Algolympics 2026', 'Canadian Computing Competition 2023']);
    expect(screen.getByText('MAY 2026')).toBeInTheDocument();
    expect(screen.getByText('Team KMP')).toBeInTheDocument();
    expect(screen.getByText(/Certificate of Distinction/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /CERTIFICATE/ })).toHaveAttribute('href', '/algolympics2026_cert.jpg');
  });

  it('shows a themed fallback when a platform is null', () => {
    render(<Cp stats={{ cf: null, atcoder }} competitions={competitions} />);
    expect(screen.getByText(/CODEFORCES DATA UNAVAILABLE/)).toBeInTheDocument();
  });

  it('shows a themed empty state when there are no competitions', () => {
    render(<Cp stats={stats} competitions={[]} />);
    fireEvent.click(screen.getByRole('button', { name: 'COMPETITIONS' }));
    expect(screen.getByText(/NO BATTLE RECORDS/)).toBeInTheDocument();
  });
});
