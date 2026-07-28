import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { About } from './About';

describe('About', () => {
  // Education used to be its own menu section; it lives here now, so these
  // assertions are what stops the move from silently dropping the content.
  it('renders the schools alongside the attributes radar', () => {
    render(<About />);
    expect(screen.getByText('ATTRIBUTES')).toBeInTheDocument();
    expect(screen.getByText('EDUCATION')).toBeInTheDocument();
    expect(screen.getByText('ATENEO DE MANILA UNIVERSITY')).toBeInTheDocument();
    expect(screen.getByText('BS COMPUTER SCIENCE')).toBeInTheDocument();
    expect(screen.getByText('PHILIPPINE SCIENCE HS — MAIN CAMPUS')).toBeInTheDocument();
    expect(screen.getByText(/Trainer for Learn-2-Dev 2026/)).toBeInTheDocument();
    expect(screen.getByText(/Data Structures & Algorithms/)).toBeInTheDocument();
  });

  it('puts the radar and education in one grid row so neither is full-bleed', () => {
    const { container } = render(<About />);
    const row = container.querySelector('[data-testid="about-stats-row"]') as HTMLElement;
    expect(row.style.display).toBe('grid');
    expect(row.children).toHaveLength(2);
  });
});
