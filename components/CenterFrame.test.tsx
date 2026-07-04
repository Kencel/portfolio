import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CenterFrame } from './CenterFrame';

describe('CenterFrame', () => {
  it('centers on the x-axis: auto horizontal margins + default max width', () => {
    render(<CenterFrame><span>hi</span></CenterFrame>);
    const frame = screen.getByText('hi').parentElement!;
    expect(frame.style.marginLeft).toBe('auto');
    expect(frame.style.marginRight).toBe('auto');
    expect(frame.style.maxWidth).toBe('1180px');
    expect(frame.style.width).toBe('100%');
  });

  it('does NOT center vertically (no auto vertical margins, no flex centering)', () => {
    render(<CenterFrame><span>hi</span></CenterFrame>);
    const frame = screen.getByText('hi').parentElement!;
    expect(frame.style.marginTop).toBe('');
    expect(frame.style.marginBottom).toBe('');
    expect(frame.style.alignItems).toBe('');
  });

  it('respects a custom maxWidth and merges extra style', () => {
    render(<CenterFrame maxWidth={900} style={{ padding: '10px' }}><span>hi</span></CenterFrame>);
    const frame = screen.getByText('hi').parentElement!;
    expect(frame.style.maxWidth).toBe('900px');
    expect(frame.style.padding).toBe('10px');
  });
});
