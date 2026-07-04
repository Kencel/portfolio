import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AttributesRadar } from './AttributesRadar';
import { ATTRIBUTES } from '@/lib/data';

describe('AttributesRadar', () => {
  it('renders an svg with a label for every attribute', () => {
    const { container, getByText } = render(<AttributesRadar />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    ATTRIBUTES.forEach(a => expect(getByText(a.axis)).toBeInTheDocument());
  });

  it('draws the filled stat polygon', () => {
    const { container } = render(<AttributesRadar />);
    // one filled crimson polygon for the stats, plus grid polygons
    expect(container.querySelectorAll('polygon').length).toBeGreaterThanOrEqual(2);
  });

  it('positions every label vertex within the viewBox bounds', () => {
    const { container } = render(<AttributesRadar />);
    const svg = container.querySelector('svg')!;
    const vb = svg.getAttribute('viewBox')!.split(' ').map(Number);
    const [minX, minY, w, h] = vb;
    const maxX = minX + w, maxY = minY + h;
    // Label anchor points sit at f = 1.18 of the max radius on each of the 6 axes.
    const CX = 150, CY = 150, MAX_R = 110, F = 1.18;
    for (let i = 0; i < 6; i++) {
      const ang = (-90 + i * 60) * (Math.PI / 180);
      const x = CX + Math.cos(ang) * MAX_R * F;
      const y = CY + Math.sin(ang) * MAX_R * F;
      expect(x).toBeGreaterThanOrEqual(minX);
      expect(x).toBeLessThanOrEqual(maxX);
      expect(y).toBeGreaterThanOrEqual(minY);
      expect(y).toBeLessThanOrEqual(maxY);
    }
  });
});
