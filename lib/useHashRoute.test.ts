import { act, renderHook } from '@testing-library/react';
import { StrictMode } from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useHashRoute } from './useHashRoute';

// jsdom shares one history/location across tests in a file; reset so each
// test starts on a clean "/" with no hash.
beforeEach(() => { window.history.replaceState(null, '', '/'); });

// Safety net: if an assertion throws mid-test, a manual spy.mockRestore()
// below it never runs, leaking the spy (and its call history) into the next
// test. Restore unconditionally so a failing assertion can't contaminate
// tests that come after it.
afterEach(() => { vi.restoreAllMocks(); });

/** Simulate a browser history traversal landing on `hash`. */
function traverseTo(hash: string) {
  window.history.replaceState(null, '', hash || '/');
  window.dispatchEvent(new PopStateEvent('popstate'));
}

describe('useHashRoute', () => {
  it('starts on the menu with no hash', () => {
    const { result } = renderHook(() => useHashRoute());
    expect(result.current.view).toBe('menu');
  });

  it('open() sets the view and pushes a hash URL', () => {
    const { result } = renderHook(() => useHashRoute());
    act(() => { result.current.open('projects'); });
    expect(result.current.view).toBe('projects');
    expect(window.location.hash).toBe('#projects');
  });

  it('a back traversal to the menu restores the menu view', () => {
    const { result } = renderHook(() => useHashRoute());
    act(() => { result.current.open('projects'); });
    act(() => { traverseTo(''); });
    expect(result.current.view).toBe('menu');
  });

  it('a forward traversal re-opens the section', () => {
    const { result } = renderHook(() => useHashRoute());
    act(() => { result.current.open('compprog'); });
    act(() => { traverseTo(''); });
    act(() => { traverseTo('#compprog'); });
    expect(result.current.view).toBe('compprog');
  });

  it('goMenu() delegates to history.back() and never sets state itself', () => {
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {});
    const { result } = renderHook(() => useHashRoute());
    act(() => { result.current.open('about'); });
    act(() => { result.current.goMenu(); });
    expect(back).toHaveBeenCalledTimes(1);
    expect(result.current.view).toBe('about'); // unchanged until popstate arrives
    back.mockRestore();
  });

  it('fires onTransition once per change, with the destination', () => {
    const seen: string[] = [];
    const { result } = renderHook(() => useHashRoute(to => { seen.push(to); }));
    act(() => { result.current.open('skills'); });
    act(() => { traverseTo(''); });
    expect(seen).toEqual(['skills', 'menu']);
  });

  it('does not fire onTransition when the view is unchanged', () => {
    const seen: string[] = [];
    const { result } = renderHook(() => useHashRoute(to => { seen.push(to); }));
    act(() => { result.current.open('skills'); });
    act(() => { traverseTo('#skills'); }); // popstate landing on the same view
    expect(seen).toEqual(['skills']);
  });

  it('deep link opens the section and leaves a menu entry behind it', () => {
    window.history.replaceState(null, '', '#skills');
    const push = vi.spyOn(window.history, 'pushState');
    const replace = vi.spyOn(window.history, 'replaceState');
    // StrictMode double-invokes effects in dev; the mount effect must be
    // idempotent (a run-once guard) or this synthesizes a duplicate menu
    // entry, leaving [menu, menu, skills] instead of [menu, skills].
    const { result } = renderHook(() => useHashRoute(), { wrapper: StrictMode });
    expect(result.current.view).toBe('skills');
    // A menu entry was synthesised underneath, so back returns to the
    // portfolio rather than leaving the site — and only once, even under
    // StrictMode's double-invoke.
    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith({ view: 'menu' }, '', '/');
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith({ view: 'skills' }, '', '#skills');
    push.mockRestore();
    replace.mockRestore();
  });

  it('preserves the query string when resolving a deep link', () => {
    window.history.replaceState(null, '', '/?utm_source=x#skills');
    const replace = vi.spyOn(window.history, 'replaceState');
    const { result } = renderHook(() => useHashRoute());
    expect(result.current.view).toBe('skills');
    // Rebuilding the landing entry from pathname alone would drop the query
    // string; a shared link's UTM params must survive.
    expect(replace).toHaveBeenCalledWith({ view: 'menu' }, '', '/?utm_source=x');
  });

  it('a hash typed straight into the address bar updates the view via hashchange', () => {
    const { result } = renderHook(() => useHashRoute());
    act(() => {
      window.history.pushState(null, '', '#projects');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(result.current.view).toBe('projects');
  });

  it('a traversal firing both popstate and hashchange fires onTransition exactly once', () => {
    const seen: string[] = [];
    const { result } = renderHook(() => useHashRoute(to => { seen.push(to); }));
    act(() => { result.current.open('skills'); });
    act(() => {
      window.history.replaceState(null, '', '/');
      // A real back/forward traversal fires both events for the same
      // destination; without the early-return guard in `go`, onTransition
      // (and any sound it drives) would fire twice.
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(seen).toEqual(['skills', 'menu']);
  });

  it('strips an unrecognised hash and lands on the menu', () => {
    window.history.replaceState(null, '', '#nonsense');
    const { result } = renderHook(() => useHashRoute());
    expect(result.current.view).toBe('menu');
    expect(window.location.hash).toBe('');
  });

  it('strips a bogus hash typed into the address bar mid-session', () => {
    const { result } = renderHook(() => useHashRoute());
    act(() => {
      window.history.pushState(null, '', '#nonsense');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(result.current.view).toBe('menu');
    expect(window.location.hash).toBe('');
  });

  // jsdom 25's history implementation genuinely supports same-document
  // traversal (unlike the older assumption that drove the spy-based tests
  // above): a real history.back() call queues an internal task that fires
  // both `popstate` and `hashchange` asynchronously. A single microtask or a
  // single `setTimeout(0)` isn't enough to observe it — flushing the macrotask
  // queue twice is what reliably surfaces the effect in this environment.
  it('a real history.back() traversal from a section lands on the menu', async () => {
    const { result } = renderHook(() => useHashRoute());
    act(() => { result.current.open('compprog'); });
    expect(window.location.hash).toBe('#compprog');

    await act(async () => {
      window.history.back();
      // A single microtask or a single setTimeout(0) isn't enough to observe
      // jsdom's internal traversal task; flushing the macrotask queue twice
      // reliably surfaces the popstate/hashchange pair in this environment.
      await new Promise(r => setTimeout(r, 0));
      await new Promise(r => setTimeout(r, 0));
    });

    expect(result.current.view).toBe('menu');
    expect(window.location.hash).toBe('');
  });

  it('a real history.back() traversal from a resolved deep link lands on the menu', async () => {
    window.history.replaceState(null, '', '#skills');
    const { result } = renderHook(() => useHashRoute());
    expect(result.current.view).toBe('skills');

    await act(async () => {
      window.history.back();
      await new Promise(r => setTimeout(r, 0));
      await new Promise(r => setTimeout(r, 0));
    });

    expect(result.current.view).toBe('menu');
  });

  it('open() on the section already showing is a no-op (no duplicate history entry)', () => {
    const push = vi.spyOn(window.history, 'pushState');
    const { result } = renderHook(() => useHashRoute());
    act(() => { result.current.open('about'); });
    expect(push).toHaveBeenCalledTimes(1);
    act(() => { result.current.open('about'); });
    // No second pushState, so a single back() still lands on the menu instead
    // of appearing to do nothing on a duplicate entry.
    expect(push).toHaveBeenCalledTimes(1);
    expect(result.current.view).toBe('about');
    push.mockRestore();
  });

  it('two rapid goMenu() calls only traverse back once', () => {
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {});
    const { result } = renderHook(() => useHashRoute());
    act(() => { result.current.open('about'); });
    act(() => {
      result.current.goMenu();
      result.current.goMenu();
    });
    expect(back).toHaveBeenCalledTimes(1);
    back.mockRestore();
  });

  it('goMenu() works again once a traversal has landed', async () => {
    const { result } = renderHook(() => useHashRoute());
    act(() => { result.current.open('about'); });
    await act(async () => {
      result.current.goMenu();
      await new Promise(r => setTimeout(r, 0));
      await new Promise(r => setTimeout(r, 0));
    });
    expect(result.current.view).toBe('menu');

    act(() => { result.current.open('compprog'); });
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {});
    act(() => { result.current.goMenu(); });
    expect(back).toHaveBeenCalledTimes(1);
    back.mockRestore();
  });
});
