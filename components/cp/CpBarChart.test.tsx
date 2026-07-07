import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CpBarChart } from './CpBarChart';
import { ATCODER_BANDS } from '@/lib/cp/bands';

const buckets = [
  { lo: 0, count: 12 },
  { lo: 400, count: 0 },
  { lo: 800, count: 5 },
];

describe('CpBarChart', () => {
  it('renders a bar per bucket with count and lo labels', () => {
    render(<CpBarChart title="SOLVED BY DIFFICULTY" buckets={buckets} bands={ATCODER_BANDS} />);
    expect(screen.getAllByTestId(/^bar-/)).toHaveLength(3);
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('800')).toBeInTheDocument();
  });
  it('colors bars by band', () => {
    render(<CpBarChart title="T" buckets={buckets} bands={ATCODER_BANDS} />);
    expect(screen.getByTestId('bar-0')).toHaveAttribute('fill', '#808080');   // gray band
    expect(screen.getByTestId('bar-800')).toHaveAttribute('fill', '#008000'); // green band
  });
  it('renders nothing for empty buckets', () => {
    const { container } = render(<CpBarChart title="T" buckets={[]} bands={ATCODER_BANDS} />);
    expect(container).toBeEmptyDOMElement();
  });
});
