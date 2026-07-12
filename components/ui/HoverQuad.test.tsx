import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HoverQuad } from './HoverQuad';
import { SfxProvider } from '@/lib/SfxContext';
import type { Sfx } from '@/lib/useSfx';

function mockSfx(): Sfx {
  return { select: vi.fn(), confirm: vi.fn(), back: vi.fn(), hover: vi.fn(), tap: vi.fn() };
}

// SfxProvider renders no DOM, so container.firstChild is the HoverQuad wrapper.
function renderQuad(sfx: Sfx, props: { seed: number; clickSound?: 'tap' | 'none' }) {
  const { container } = render(
    <SfxProvider sfx={sfx}>
      <HoverQuad {...props}><button>HI</button></HoverQuad>
    </SfxProvider>,
  );
  return container.firstChild as HTMLElement;
}

describe('HoverQuad', () => {
  it('renders children with no quad before hover', () => {
    renderQuad(mockSfx(), { seed: 1 });
    expect(screen.getByText('HI')).toBeInTheDocument();
    expect(screen.queryByTestId('hover-quad')).toBeNull();
  });

  it('shows the quad and plays hover on mouse enter; hides it on leave', () => {
    const sfx = mockSfx();
    const wrapper = renderQuad(sfx, { seed: 1 });
    fireEvent.mouseEnter(wrapper);
    expect(screen.getByTestId('hover-quad')).toBeInTheDocument();
    expect(sfx.hover).toHaveBeenCalledTimes(1);
    fireEvent.mouseLeave(wrapper);
    expect(screen.queryByTestId('hover-quad')).toBeNull();
  });

  it('plays tap on click by default', () => {
    const sfx = mockSfx();
    renderQuad(sfx, { seed: 1 });
    fireEvent.click(screen.getByText('HI'));
    expect(sfx.tap).toHaveBeenCalledTimes(1);
  });

  it('clickSound="none" suppresses tap but not the child onClick', () => {
    const sfx = mockSfx();
    const onChild = vi.fn();
    const { container } = render(
      <SfxProvider sfx={sfx}>
        <HoverQuad seed={1} clickSound="none"><button onClick={onChild}>HI</button></HoverQuad>
      </SfxProvider>,
    );
    fireEvent.click(screen.getByText('HI'));
    expect(onChild).toHaveBeenCalledTimes(1);
    expect(sfx.tap).not.toHaveBeenCalled();
    expect(container).toBeTruthy();
  });

  it('seed picks the animation variant and phase deterministically', () => {
    const w1 = renderQuad(mockSfx(), { seed: 1 }); // 1 % 3 = variant B, -(1 % 7)*0.2 = -0.2s
    fireEvent.mouseEnter(w1);
    const quads = screen.getAllByTestId('hover-quad');
    expect(quads[0].style.animation).toContain('p5quadJitterB');
    expect(quads[0].style.animationDelay).toBe('-0.2s');
  });

  it('a different seed picks a different variant', () => {
    const w = renderQuad(mockSfx(), { seed: 3 }); // 3 % 3 = variant A, -0.6s
    fireEvent.mouseEnter(w);
    const quad = screen.getByTestId('hover-quad');
    expect(quad.style.animation).toContain('p5quadJitterA');
    expect(quad.style.animationDelay).toBe('-0.6s');
  });
});
