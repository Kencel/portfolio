import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CpBarChart } from './CpBarChart';

const buckets = [
  { lo: 0, count: 12 },
  { lo: 400, count: 0 },
  { lo: 800, count: 5 },
];

describe('CpBarChart', () => {
  it('renders a bar per bucket with count and lo labels', () => {
    render(<CpBarChart title="SOLVED BY DIFFICULTY" buckets={buckets} accent="#E4002B" />);
    expect(screen.getAllByTestId(/^bar-/)).toHaveLength(3);
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('800')).toBeInTheDocument();
  });
  it('fills every bar with the accent, ramping opacity by difficulty', () => {
    render(<CpBarChart title="T" buckets={buckets} accent="#E4002B" />);
    expect(screen.getByTestId('bar-0')).toHaveAttribute('fill', '#E4002B');
    expect(screen.getByTestId('bar-800')).toHaveAttribute('fill', '#E4002B');
    expect(screen.getByTestId('bar-0')).toHaveAttribute('opacity', '0.4');
    expect(screen.getByTestId('bar-400')).toHaveAttribute('opacity', '0.7');
    expect(screen.getByTestId('bar-800')).toHaveAttribute('opacity', '1');
  });
  it('renders nothing for empty buckets', () => {
    const { container } = render(<CpBarChart title="T" buckets={[]} accent="#E4002B" />);
    expect(container).toBeEmptyDOMElement();
  });
});
