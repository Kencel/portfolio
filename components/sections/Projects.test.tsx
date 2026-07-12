import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Projects } from './Projects';
import type { Project } from '@/lib/projects';

const fixtures: Project[] = [
  { id: 1, title: 'BRAVO', description: 'b', imageUrl: null, linkUrl: null, year: 2024, tags: ['C++'] },
  { id: 2, title: 'ALPHA', description: 'a', imageUrl: null, linkUrl: null, year: 2025, tags: ['NEXT.JS'] },
  { id: 3, title: 'CHARLIE', description: 'c', imageUrl: null, linkUrl: null, year: 2025, tags: ['NEXT.JS', 'C++'] },
];

const headings = () => screen.getAllByTestId('project-title').map(el => el.textContent);

describe('Projects', () => {
  it('renders all projects newest-first by default', () => {
    render(<Projects projects={fixtures} />);
    expect(headings()).toEqual(['ALPHA', 'CHARLIE', 'BRAVO']);
  });
  it('derives one filter chip per distinct tag plus ALL', () => {
    render(<Projects projects={fixtures} />);
    const bar = screen.getByTestId('filter-bar');
    expect(within(bar).getByRole('button', { name: 'ALL' })).toBeInTheDocument();
    expect(within(bar).getByRole('button', { name: 'C++' })).toBeInTheDocument();
    expect(within(bar).getByRole('button', { name: 'NEXT.JS' })).toBeInTheDocument();
  });
  it('filters with OR semantics and toggles off', () => {
    render(<Projects projects={fixtures} />);
    const bar = screen.getByTestId('filter-bar');
    fireEvent.click(within(bar).getByRole('button', { name: 'C++' }));
    expect(headings()).toEqual(['CHARLIE', 'BRAVO']);
    fireEvent.click(within(bar).getByRole('button', { name: 'NEXT.JS' }));
    expect(headings()).toEqual(['ALPHA', 'CHARLIE', 'BRAVO']); // OR: has C++ or NEXT.JS
    fireEvent.click(within(bar).getByRole('button', { name: 'C++' }));
    fireEvent.click(within(bar).getByRole('button', { name: 'NEXT.JS' }));
    expect(headings()).toEqual(['ALPHA', 'CHARLIE', 'BRAVO']); // all deselected = ALL
  });
  it('ALL chip clears active filters', () => {
    render(<Projects projects={fixtures} />);
    const bar = screen.getByTestId('filter-bar');
    fireEvent.click(within(bar).getByRole('button', { name: 'C++' }));
    fireEvent.click(within(bar).getByRole('button', { name: 'ALL' }));
    expect(headings()).toEqual(['ALPHA', 'CHARLIE', 'BRAVO']);
  });
  it('sorts A–Z when toggled', () => {
    render(<Projects projects={fixtures} />);
    fireEvent.click(screen.getByRole('button', { name: 'A–Z' }));
    expect(headings()).toEqual(['ALPHA', 'BRAVO', 'CHARLIE']);
    fireEvent.click(screen.getByRole('button', { name: 'NEWEST' }));
    expect(headings()).toEqual(['ALPHA', 'CHARLIE', 'BRAVO']);
  });
  it('shows the empty-data state when there are no projects', () => {
    render(<Projects projects={[]} />);
    expect(screen.getByText(/TREASURE DATA UNAVAILABLE/i)).toBeInTheDocument();
    expect(screen.queryByTestId('filter-bar')).not.toBeInTheDocument();
  });
  it('shows a hover quad on a filter chip on mouse enter', () => {
    render(<Projects projects={fixtures} />);
    const all = screen.getByRole('button', { name: 'ALL' });
    fireEvent.mouseEnter(all.parentElement!.parentElement!);
    expect(screen.getByTestId('hover-quad')).toBeInTheDocument();
  });
});
