import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MenuView } from './MenuView';

vi.mock('@/lib/useClock', () => ({
  useClock: () => ({ time: '12:00', day: 'MON' }),
}));

const noop = () => {};

function renderRoot(narrow: boolean) {
  const { container } = render(
    <MenuView hovered={null} muted={false} onToggleMute={noop} onEnter={noop} onOpen={noop} narrow={narrow} menuVisit={0} />,
  );
  return container.firstChild as HTMLElement;
}

describe('MenuView layout', () => {
  it('wide mode lets content taller than the viewport scroll (no fixed height, no hidden overflow)', () => {
    const root = renderRoot(false);
    expect(root.style.height).not.toBe('100vh');
    expect(root.style.overflowY).not.toBe('hidden');
  });

  it('narrow mode flows from the top with dynamic height', () => {
    const root = renderRoot(true);
    expect(root.style.height).not.toBe('100vh');
    expect(root.style.overflowY).not.toBe('hidden');
  });
});
