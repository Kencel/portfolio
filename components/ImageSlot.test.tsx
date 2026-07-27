import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageSlot } from './ImageSlot';

describe('ImageSlot', () => {
  it('shows the placeholder when no src', () => {
    render(<ImageSlot placeholder="DROP YOUR PHOTO" />);
    expect(screen.getByText('DROP YOUR PHOTO')).toBeInTheDocument();
  });
  it('renders an image when src is provided', () => {
    render(<ImageSlot src="/avatar.jpg" alt="me" placeholder="DROP YOUR PHOTO" />);
    expect(screen.getByAltText('me')).toBeInTheDocument();
  });
  it('falls back to placeholder if the image errors', () => {
    render(<ImageSlot src="/missing.jpg" alt="me" placeholder="DROP YOUR PHOTO" />);
    fireEvent.error(screen.getByAltText('me'));
    expect(screen.getByText('DROP YOUR PHOTO')).toBeInTheDocument();
  });
  it('renders an empty panel with no label when placeholder is omitted', () => {
    const { container } = render(<ImageSlot />);
    expect(container.textContent).toBe('');
    expect(container.firstElementChild).not.toHaveStyle({ borderStyle: 'dashed' });
  });
  it('shows no label when a missing image errors and no placeholder is set', () => {
    render(<ImageSlot src="/missing.jpg" alt="me" />);
    fireEvent.error(screen.getByAltText('me'));
    expect(screen.queryByAltText('me')).not.toBeInTheDocument();
    expect(screen.queryByText('DROP YOUR PHOTO')).not.toBeInTheDocument();
  });
});
