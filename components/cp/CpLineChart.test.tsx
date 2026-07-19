import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CpLineChart, yDomain, yTicks } from './CpLineChart';
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

describe('yTicks', () => {
  it('uses a 100 step for narrow domains', () => {
    expect(yTicks(1300, 1600)).toEqual([1300, 1400, 1500, 1600]);
  });
  it('widens the step to keep at most 5 ticks', () => {
    expect(yTicks(1300, 2100)).toEqual([1400, 1600, 1800, 2000]);
    expect(yTicks(0, 4000)).toEqual([0, 1000, 2000, 3000, 4000]);
  });
  it('never exceeds 5 ticks even for huge domains', () => {
    expect(yTicks(0, 100000).length).toBeLessThanOrEqual(5);
  });
});

describe('CpLineChart', () => {
  const props = {
    title: 'RATING',
    contests,
    value: (c: CpContest) => c.ratingAfter,
    detail: (c: CpContest) => (c.delta >= 0 ? `+${c.delta}` : `${c.delta}`),
  };

  it('renders one point per contest and no popup by default', () => {
    render(<CpLineChart {...props} />);
    expect(screen.getByTestId('pt-0')).toBeInTheDocument();
    expect(screen.getByTestId('pt-1')).toBeInTheDocument();
    expect(screen.queryByTestId('chart-popup')).not.toBeInTheDocument();
  });

  it('hovering a point pops up linked name, date, and detail in the accent color', () => {
    render(<CpLineChart {...props} accent="#123456" />);
    fireEvent.mouseEnter(screen.getByTestId('pt-1'));
    const popup = screen.getByTestId('chart-popup');
    const link = screen.getByRole('link', { name: /Round B/ });
    expect(link).toHaveAttribute('href', 'https://codeforces.com/contest/1901');
    expect(link).toHaveStyle({ color: '#123456' });
    expect(popup).toHaveTextContent('2025-02-01');
    expect(popup).toHaveTextContent('-15');
  });

  it('leaving the chart area closes the popup', () => {
    render(<CpLineChart {...props} />);
    fireEvent.mouseEnter(screen.getByTestId('pt-0'));
    expect(screen.getByTestId('chart-popup')).toBeInTheDocument();
    fireEvent.mouseLeave(screen.getByTestId('chart-body'));
    expect(screen.queryByTestId('chart-popup')).not.toBeInTheDocument();
  });

  it('renders nothing for an empty history', () => {
    const { container } = render(<CpLineChart {...props} contests={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders no band stripes and no dashed gridlines', () => {
    const { container } = render(<CpLineChart {...props} />);
    expect(container.querySelector('[stroke-dasharray]')).toBeNull();
    expect(container.querySelectorAll('rect')).toHaveLength(0);
  });
});
