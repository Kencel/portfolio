'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { SectionId } from './data';
import { hashToView, viewToHash, type View } from './hashRoute';

/**
 * Keeps the current view in lockstep with browser history.
 *
 * The app has no router, so without this the mouse's back button (and Alt+left,
 * the chrome arrows, and the mobile back-swipe) navigate away from the site
 * entirely. Pushing a hash entry per section makes the browser's own
 * back/forward do section navigation for us — no mouse-event handling needed.
 */
export function useHashRoute(onTransition?: (to: View) => void) {
  const [view, setView] = useState<View>('menu');

  const viewRef = useRef<View>(view);
  viewRef.current = view;

  const cbRef = useRef(onTransition);
  cbRef.current = onTransition;

  const go = useCallback((next: View) => {
    const from = viewRef.current;
    if (next === from) return;
    viewRef.current = next;
    setView(next);
    cbRef.current?.(next);
  }, []);

  // In-flight guard for goMenu's traversal — see below.
  const navigatingRef = useRef(false);

  const open = useCallback((id: SectionId) => {
    // Calling open() on the section already showing (e.g. a redundant digit
    // press) would otherwise push a duplicate entry and then early-return in
    // go(), so one back press would appear to do nothing.
    if (id === viewRef.current) return;
    try {
      window.history.pushState({ view: id }, '', viewToHash(id));
    } catch {
      // Safari throttles pushState (~100 calls / 30s) and throws SecurityError
      // past the limit. A wrong URL beats a frozen UI, so fall through to the
      // view change regardless — practically unreachable here, but matches
      // this repo's graceful-degradation-at-every-external-boundary invariant.
    }
    go(id);
  }, [go]);

  // Delegates rather than setting state, so Esc/C and the browser's own back
  // control take the identical path and the stack never drifts from the UI.
  //
  // Guarded against a double-pop: two Esc presses inside the ~one-frame window
  // before popstate arrives would otherwise both pass Portfolio's `view !==
  // 'menu'` guard (viewRef doesn't update until popstate lands) and queue two
  // real back() traversals — in an actual browser both are honored and the
  // second one leaves the site. `navigatingRef` makes goMenu a no-op while a
  // traversal is already in flight; `sync` clears it once popstate/hashchange
  // land.
  const goMenu = useCallback(() => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    window.history.back();
  }, []);

  // Resolve an incoming deep link once, after mount. The server always renders
  // the menu and initial client state is 'menu', so there's no hydration
  // mismatch; the splash covers this, so there's no flash of menu either.
  //
  // Guarded by a run-once ref: React Strict Mode double-invokes mount effects
  // in dev (no cleanup here to make that idempotent on its own), and without
  // the guard a recognized deep-link hash gets its replaceState+pushState
  // pair re-run on the second invocation, leaving a redundant duplicate menu
  // entry in history. Mirrors the `if (!ref.current)` pattern in useSfx.
  const deepLinkResolvedRef = useRef(false);
  useEffect(() => {
    if (deepLinkResolvedRef.current) return;
    deepLinkResolvedRef.current = true;
    const landingUrl = window.location.pathname + window.location.search;
    const initial = hashToView(window.location.hash);
    if (initial === 'menu') {
      if (window.location.hash) {
        window.history.replaceState({ view: 'menu' }, '', landingUrl);
      }
      return;
    }
    // Rewrite the landing entry as the menu, then push the section on top, so
    // back from a deep link returns to the portfolio instead of leaving it.
    window.history.replaceState({ view: 'menu' }, '', landingUrl);
    try {
      window.history.pushState({ view: initial }, '', viewToHash(initial));
    } catch {
      // See the try/catch in `open` above — a wrong URL beats a stuck splash.
    }
    go(initial);
  }, [go]);

  // popstate covers history traversal; hashchange covers a hash typed straight
  // into the address bar, which pushes an entry without firing popstate.
  // Traversal fires both, so `go` early-returns when the view is unchanged.
  useEffect(() => {
    const sync = () => {
      const next = hashToView(window.location.hash);
      // A legitimate traversal landing on the menu always carries an empty
      // hash (the mount effect never leaves a menu entry with one); a
      // non-empty hash here means a bogus/removed-section hash was typed or
      // edited mid-session, so strip it rather than leaving junk in the bar.
      if (next === 'menu' && window.location.hash) {
        window.history.replaceState({ view: 'menu' }, '', window.location.pathname + window.location.search);
      }
      navigatingRef.current = false;
      go(next);
    };
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, [go]);

  return { view, open, goMenu };
}
