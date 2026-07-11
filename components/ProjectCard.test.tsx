import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';
import type { Project } from '@/lib/projects';

const full: Project = {
  id: 1, title: 'PROJECT SINAG', description: 'Built at Blue Hacks 2025.',
  imageUrl: '/sinag.jpg', linkUrl: 'https://project-sinag.cjuy.dev/', year: 2025,
  tags: ['HACKATHON', 'NEXT.JS'],
};
const bare: Project = {
  id: 2, title: 'SIDE QUEST', description: 'No image, no link.',
  imageUrl: null, linkUrl: null, year: 2024, tags: ['C++'],
};

describe('ProjectCard', () => {
  it('renders title, year, description, tags and image', () => {
    render(<ProjectCard project={full} selectedTags={new Set()} />);
    expect(screen.getByText('PROJECT SINAG')).toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
    expect(screen.getByText('Built at Blue Hacks 2025.')).toBeInTheDocument();
    expect(screen.getByText('HACKATHON')).toBeInTheDocument();
    expect(screen.getByText('NEXT.JS')).toBeInTheDocument();
    expect(screen.getByAltText('PROJECT SINAG')).toBeInTheDocument();
  });
  it('shows a VISIT SITE link only when linkUrl exists', () => {
    render(<ProjectCard project={full} selectedTags={new Set()} />);
    expect(screen.getByRole('link', { name: /visit site/i })).toHaveAttribute('href', 'https://project-sinag.cjuy.dev/');
  });
  it('renders placeholder art and no link when imageUrl/linkUrl are null', () => {
    render(<ProjectCard project={bare} selectedTags={new Set()} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getAllByText('SIDE QUEST').length).toBeGreaterThanOrEqual(1); // placeholder carries the title
  });
  it('highlights selected tags with the accent color', () => {
    render(<ProjectCard project={full} selectedTags={new Set(['HACKATHON'])} />);
    expect(screen.getByText('HACKATHON')).toHaveStyle({ color: '#E4002B' });
    expect(screen.getByText('NEXT.JS')).not.toHaveStyle({ color: '#E4002B' });
  });
  it('shows a hover quad on the visit link on mouse enter', () => {
    render(<ProjectCard project={full} selectedTags={new Set()} />);
    const link = screen.getByRole('link', { name: /VISIT SITE/ });
    fireEvent.mouseEnter(link.parentElement!.parentElement!);
    expect(screen.getByTestId('hover-quad')).toBeInTheDocument();
  });
});
