import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useProgressive } from './useProgressive';

function deferred<T>() {
  let resolve!: (v: T) => void, reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

describe('useProgressive', () => {
  it('is null until the first stage lands, then advances stage by stage', async () => {
    const base = deferred<string>(), full = deferred<string>();
    const stages = [base.promise, full.promise];
    const { result } = renderHook(() => useProgressive(stages));
    expect(result.current).toBeNull();
    await act(async () => base.resolve('base'));
    expect(result.current).toBe('base');
    await act(async () => full.resolve('full'));
    expect(result.current).toBe('full');
  });

  it('never steps back to an earlier stage that settles late', async () => {
    const base = deferred<string>(), full = deferred<string>();
    const stages = [base.promise, full.promise];
    const { result } = renderHook(() => useProgressive(stages));
    await act(async () => full.resolve('full'));
    await act(async () => base.resolve('base'));
    expect(result.current).toBe('full');
  });

  it('keeps the last good value when a later stage rejects', async () => {
    const base = deferred<string>(), full = deferred<string>();
    const stages = [base.promise, full.promise];
    const { result } = renderHook(() => useProgressive(stages));
    await act(async () => base.resolve('base'));
    await act(async () => full.reject(new Error('boom')));
    expect(result.current).toBe('base');
  });
});
