import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CpLineChart, yDomain } from './CpLineChart';
import { CF_BANDS } from '@/lib/cp/bands';
import type { CpContest } from '@/lib/cp/types';

const contests: CpContest[] = [
  { name: 'Round A', url: 'https://codeforces.com/contest/1900', date: '2025-01-01', ratingAfter: 1445, delta: 45, performance: 1490, rank: 1543 },
  { name: 'Round B', url: 'https://codeforces.com/contest/1901', date: '2025-02-01', ratingAfter: 1430, delta: -15, performance: 1415, rank: 800 },
];

describe('yDomain', () => {
  it('pads and rounds to 100s', () => {
    expect(yDomain([1430, 1445])).toEqual({ lo: 1300, hi: 1600 });
  });
  it('never goes below 0', () => {
    expect(yDomain([10, 50]).lo).toBe(0);
  });
});

describe('CpLineChart', () => {
  const props = {
    title: 'RATING',
    contests,
    value: (c: CpContest) => c.ratingAfter,
    detail: (c: CpContest) => (c.delta >= 0 ? `+${c.delta}` : `${c.delta}`),
    bands: CF_BANDS,
  };

  it('renders one point per contest and the default caption', () => {
    render(<CpLineChart {...props} />);
    expect(screen.getByTestId('pt-0')).toBeInTheDocument();
    expect(screen.getByTestId('pt-1')).toBeInTheDocument();
    expect(screen.getByTestId('chart-caption')).toHaveTextContent(/HOVER A POINT/);
  });

  it('hovering a point shows linked name, date, and detail', () => {
    render(<CpLineChart {...props} />);
    fireEvent.mouseEnter(screen.getByTestId('pt-1'));
    const caption = screen.getByTestId('chart-caption');
    const link = screen.getByRole('link', { name: 'Round B' });
    expect(link).toHaveAttribute('href', 'https://codeforces.com/contest/1901');
    expect(caption).toHaveTextContent('2025-02-01');
    expect(caption).toHaveTextContent('-15');
  });

  it('renders nothing for an empty history', () => {
    const { container } = render(<CpLineChart {...props} contests={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
