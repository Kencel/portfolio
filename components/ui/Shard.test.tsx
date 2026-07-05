import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Shard } from './Shard';

describe('Shard', () => {
  it('renders a filled clipped shape', () => {
    const { container } = render(
      <Shard
        clipPath="polygon(0 0, 100% 0, 62% 100%, 0% 100%)"
        fill="#E4002B"
        opacity={0.9}
        style={{ top: '-14%', left: '-8%', width: '52%', height: '130%' }}
      />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.background).toBe('rgb(228, 0, 43)');
    expect(el.style.clipPath).toBe('polygon(0 0, 100% 0, 62% 100%, 0% 100%)');
    expect(el.style.opacity).toBe('0.9');
    expect(el.style.top).toBe('-14%');
  });

  it('renders an outlined shard with a border and transparent fill when no fill is given', () => {
    const { container } = render(
      <Shard clipPath="polygon(18% 0, 100% 12%, 84% 100%, 0 82%)" border="3px solid #E4002B" opacity={0.35} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.background).toBe('transparent');
    expect(el.style.border).toBe('3px solid rgb(228, 0, 43)');
  });

  it('renders a companion dot overlay when dots is provided', () => {
    const { container } = render(
      <Shard clipPath="polygon(0 0, 100% 0, 62% 100%, 0% 100%)" fill="#E4002B" dots={{}} />
    );
    expect(container.children.length).toBe(2);
  });

  it('omits the dot overlay when dots is not provided', () => {
    const { container } = render(
      <Shard clipPath="polygon(18% 0, 100% 12%, 84% 100%, 0 82%)" border="3px solid #E4002B" />
    );
    expect(container.children.length).toBe(1);
  });
});
