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

  it('styles the profile link as a platform-accent chip', () => {
    render(<Cp stats={stats} competitions={competitions} />);
    const profile = screen.getByRole('link', { name: /@RamenNagi/ });
    expect(profile).toHaveAttribute('href', 'https://codeforces.com/profile/RamenNagi');
    expect(profile).toHaveStyle({ backgroundColor: '#17A2A2' }); // cfteal on the CF tab
    fireEvent.click(screen.getByRole('button', { name: 'ATCODER' }));
    expect(screen.getByRole('link', { name: /@RamenNagi/ })).toHaveStyle({ backgroundColor: '#C0C0C0' });
  });

  it('switches to AtCoder (official performance — no APPROX)', () => {
    render(<Cp stats={stats} competitions={competitions} />);
    fireEvent.click(screen.getByRole('button', { name: 'ATCODER' }));
    const panel = screen.getByTestId('platform-panel');
    expect(within(panel).getByText('120')).toBeInTheDocument();
    expect(screen.getByText('PERFORMANCE')).toBeInTheDocument();
    expect(screen.queryByText(/APPROX/)).not.toBeInTheDocument();
  });

  it('switches to Competitions, newest first, with team chips, notes, and cert button', () => {
    render(<Cp stats={stats} competitions={competitions} />);
    fireEvent.click(screen.getByRole('button', { name: 'COMPETITIONS' }));
    const names = screen.getAllByTestId('competition-name').map(el => el.textContent);
    expect(names).toEqual(['UP ACM Algolympics 2026', 'Canadian Computing Competition 2023']);
    expect(screen.getByText('MAY 2026')).toBeInTheDocument();
    expect(screen.getByText('Team KMP')).toBeInTheDocument();
    expect(screen.getByText(/Certificate of Distinction/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /VIEW CERTIFICATE/ })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the certificate in a modal and closes via the close button', () => {
    render(<Cp stats={stats} competitions={competitions} />);
    fireEvent.click(screen.getByRole('button', { name: 'COMPETITIONS' }));
    fireEvent.click(screen.getByRole('button', { name: /VIEW CERTIFICATE/ }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('img', { name: /certificate/i })).toHaveAttribute('src', '/algolympics2026_cert.jpg');
    fireEvent.click(screen.getByRole('button', { name: 'CLOSE' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the certificate modal on backdrop click', () => {
    render(<Cp stats={stats} competitions={competitions} />);
    fireEvent.click(screen.getByRole('button', { name: 'COMPETITIONS' }));
    fireEvent.click(screen.getByRole('button', { name: /VIEW CERTIFICATE/ }));
    fireEvent.click(screen.getByTestId('cert-backdrop'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
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
  it('shows a hover quad on a platform tab on mouse enter', () => {
    render(<Cp stats={stats} competitions={competitions} />);
    const tab = screen.getByRole('button', { name: 'ATCODER' });
    fireEvent.mouseEnter(tab.parentElement!.parentElement!);
    expect(screen.getByTestId('hover-quad')).toBeInTheDocument();
  });
});
