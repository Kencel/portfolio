import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HalftoneLayer } from './HalftoneLayer';

describe('HalftoneLayer', () => {
  it('renders a radial-gradient dot texture with the given color, size and opacity', () => {
    const { container } = render(<HalftoneLayer color="#E4002B" dotRadius={1.3} gap={15} opacity={0.16} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundImage).toBe('radial-gradient(#E4002B 1.3px, transparent 1.4px)');
    expect(el.style.backgroundSize).toBe('15px 15px');
    expect(el.style.opacity).toBe('0.16');
  });

  it('applies an optional clip-path', () => {
    const { container } = render(<HalftoneLayer color="#0b0a0a" clipPath="polygon(0 0, 100% 0, 62% 100%, 0% 100%)" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.clipPath).toBe('polygon(0 0, 100% 0, 62% 100%, 0% 100%)');
  });

  it('defaults to full-bleed absolute positioning with pointer-events disabled', () => {
    const { container } = render(<HalftoneLayer color="#E4002B" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.position).toBe('absolute');
    expect(el.style.inset).toBe('0px');
    expect(el.style.pointerEvents).toBe('none');
  });
});
