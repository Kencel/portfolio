// Deterministic pseudo-random in [0,1) from an integer seed. Stable across
// SSR and client render (no Math.random / Date), so seeded visuals (ransom
// tiles, card clip-paths) never cause a hydration mismatch — the same seed
// always gets the same treatment.
export function rand(seed: number): number {
  const x = Math.sin(seed * 99991.7) * 10000;
  return x - Math.floor(x);
}
