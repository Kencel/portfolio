import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { SkewBox } from './SkewBox';

describe('SkewBox', () => {
  it('skews the outer wrapper and counter-skews the inner wrapper', () => {
    const { container } = render(<SkewBox deg={-9}><span>hi</span></SkewBox>);
    const outer = container.firstChild as HTMLElement;
    const inner = outer.firstChild as HTMLElement;
    expect(outer.style.transform).toBe('skewX(-9deg)');
    expect(inner.style.transform).toBe('skewX(9deg)');
  });

  it('renders children inside the counter-skewed inner wrapper', () => {
    const { getByText } = render(<SkewBox deg={-8}><span>BACK</span></SkewBox>);
    expect(getByText('BACK')).toBeInTheDocument();
  });

  it('forwards onClick to the outer wrapper', () => {
    const onClick = vi.fn();
    const { container } = render(<SkewBox deg={-8} onClick={onClick}><span>BACK</span></SkewBox>);
    fireEvent.click(container.firstChild as HTMLElement);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
