// components/ui/ProgressBar.test.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('renders a track with a fill sized to pct', () => {
    const { container } = render(<ProgressBar pct="92%" />);
    const track = container.firstChild as HTMLElement;
    const fillEl = track.firstChild as HTMLElement;
    expect(fillEl.style.width).toBe('92%');
  });

  it('uses the given fill color and height', () => {
    const { container } = render(<ProgressBar pct="48%" fill="linear-gradient(90deg,#808080,#17A2A2)" height={16} />);
    const track = container.firstChild as HTMLElement;
    const fillEl = track.firstChild as HTMLElement;
    expect(track.style.height).toBe('16px');
    expect(fillEl.style.background).toBe('linear-gradient(90deg,#808080,#17A2A2)');
  });

  it('defaults to the accent fill color and the token track colors', () => {
    const { container } = render(<ProgressBar pct="72%" />);
    const track = container.firstChild as HTMLElement;
    const fillEl = track.firstChild as HTMLElement;
    expect(track.style.background).toBe('rgb(28, 26, 26)');
    expect(track.style.border).toBe('1px solid rgb(51, 51, 51)');
    expect(fillEl.style.background).toBe('rgb(228, 0, 43)');
  });

  it('merges an optional style override onto the track (e.g. flex: 1 for inline layouts)', () => {
    const { container } = render(<ProgressBar pct="80%" style={{ flex: 1 }} />);
    const track = container.firstChild as HTMLElement;
    expect(track.style.flex).toBe('1 1 0%');
  });
});
