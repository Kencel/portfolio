import { describe, it, expect, vi } from 'vitest';
import { createSfx } from './useSfx';

function fakeAudioCtx() {
  const osc = { type: '', frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn(), start: vi.fn(), stop: vi.fn() };
  const gain = { gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn() };
  const ctx = { currentTime: 0, state: 'running', resume: vi.fn(), createOscillator: vi.fn(() => osc), createGain: vi.fn(() => gain), destination: {} };
  // regular function, not arrow: vitest 4 mocks use real `new` semantics
  const Ctor = vi.fn(function () { return ctx; }) as unknown as typeof AudioContext;
  return { Ctor, ctx, osc };
}

describe('createSfx', () => {
  it('creates an oscillator when not muted', () => {
    const { Ctor, ctx } = fakeAudioCtx();
    const sfx = createSfx(() => false, Ctor);
    sfx.select();
    expect(ctx.createOscillator).toHaveBeenCalledTimes(1);
  });
  it('creates no oscillator when muted', () => {
    const { Ctor, ctx } = fakeAudioCtx();
    const sfx = createSfx(() => true, Ctor);
    sfx.select(); sfx.confirm(); sfx.back();
    expect(ctx.createOscillator).not.toHaveBeenCalled();
  });
  it('hover and tap create oscillators when not muted', () => {
    const { Ctor, ctx } = fakeAudioCtx();
    const sfx = createSfx(() => false, Ctor);
    sfx.hover(); sfx.tap();
    expect(ctx.createOscillator).toHaveBeenCalledTimes(2);
  });
  it('hover and tap are silent when muted', () => {
    const { Ctor, ctx } = fakeAudioCtx();
    const sfx = createSfx(() => true, Ctor);
    sfx.hover(); sfx.tap();
    expect(ctx.createOscillator).not.toHaveBeenCalled();
  });
});
