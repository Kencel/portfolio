import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SfxProvider, useSfxContext } from './SfxContext';
import type { Sfx } from './useSfx';

function Probe() {
  const sfx = useSfxContext();
  return <button onClick={() => sfx.tap()}>go</button>;
}

describe('SfxContext', () => {
  it('falls back to a no-op sfx without a provider', () => {
    render(<Probe />);
    fireEvent.click(screen.getByText('go')); // must not throw
  });
  it('delivers the provided sfx to descendants', () => {
    const tap = vi.fn();
    const sfx: Sfx = { select: vi.fn(), confirm: vi.fn(), back: vi.fn(), hover: vi.fn(), tap };
    render(<SfxProvider sfx={sfx}><Probe /></SfxProvider>);
    fireEvent.click(screen.getByText('go'));
    expect(tap).toHaveBeenCalledTimes(1);
  });
});
