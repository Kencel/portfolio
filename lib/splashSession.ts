const KEY = 'p5r-splash-seen';

// try/catch: sessionStorage access can throw (privacy modes, sandboxed
// iframes). Failing open means the splash just plays again — harmless.
export function hasSeenSplash(): boolean {
  try { return window.sessionStorage.getItem(KEY) === '1'; } catch { return false; }
}

export function markSplashSeen(): void {
  try { window.sessionStorage.setItem(KEY, '1'); } catch { /* non-fatal */ }
}
