'use client';
import { createContext, useContext, type ReactNode } from 'react';
import type { Sfx } from './useSfx';

// Default is a no-op so components (and their tests) render without a provider.
const NOOP_SFX: Sfx = { select() {}, confirm() {}, back() {}, hover() {}, tap() {} };

const SfxContext = createContext<Sfx>(NOOP_SFX);

export function SfxProvider({ sfx, children }: { sfx: Sfx; children: ReactNode }) {
  return <SfxContext.Provider value={sfx}>{children}</SfxContext.Provider>;
}

export function useSfxContext(): Sfx {
  return useContext(SfxContext);
}
