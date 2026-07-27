import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useHashRoute } from './useHashRoute';

// jsdom shares one history/location across tests in a file; reset so each
// test starts on a clean "/" with no hash.
beforeEach(() => { window.history.replaceState(null, '', '/'); });

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
    act(() => { result.current.open('cp'); });
    act(() => { traverseTo(''); });
    act(() => { traverseTo('#cp'); });
    expect(result.current.view).toBe('cp');
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
    window.history.replaceState(null, '', '#education');
    const push = vi.spyOn(window.history, 'pushState');
    const { result } = renderHook(() => useHashRoute());
    expect(result.current.view).toBe('education');
    // A menu entry was synthesised underneath, so back returns to the
    // portfolio rather than leaving the site.
    expect(push).toHaveBeenCalledWith({ view: 'education' }, '', '#education');
    push.mockRestore();
  });

  it('strips an unrecognised hash and lands on the menu', () => {
    window.history.replaceState(null, '', '#nonsense');
    const { result } = renderHook(() => useHashRoute());
    expect(result.current.view).toBe('menu');
    expect(window.location.hash).toBe('');
  });
});
