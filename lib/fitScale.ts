/**
 * Scale factor that shrinks content of `naturalHeight` to fit `availableHeight`.
 * Never scales up; returns 1 for degenerate (non-positive) measurements so the
 * caller falls back to unscaled layout.
 */
export function fitScale(naturalHeight: number, availableHeight: number): number {
  if (naturalHeight <= 0 || availableHeight <= 0) return 1;
  return Math.min(1, availableHeight / naturalHeight);
}
