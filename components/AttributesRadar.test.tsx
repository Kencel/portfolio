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
});
