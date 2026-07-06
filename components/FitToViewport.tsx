'use client';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { fitScale } from '@/lib/fitScale';

/**
 * Shrinks its content (never enlarges) so it fits the viewport height exactly,
 * minus the vertical padding of the padded ancestor it sits in (its parent's
 * parent — the MenuView root). Keeps the desktop menu a zero-scroll HUD on
 * short screens; on viewports where the content already fits it renders
 * completely untouched.
 */
export function FitToViewport({ children }: { children: ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ scale: number; height?: number }>({ scale: 1 });

  useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    const update = () => {
      // offsetHeight is layout height, unaffected by the scale transform,
      // so re-running this never feeds back into itself.
      const natural = inner.offsetHeight;
      const padded = inner.parentElement?.parentElement;
      const cs = padded ? getComputedStyle(padded) : null;
      const pad = cs ? parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) : 0;
      const scale = fitScale(natural, window.innerHeight - pad);
      setFit(scale < 1 ? { scale, height: natural * scale } : { scale: 1 });
    };
    update();
    window.addEventListener('resize', update);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    ro?.observe(inner); // catches late layout shifts (font loads, data fills)
    return () => { window.removeEventListener('resize', update); ro?.disconnect(); };
  }, []);

  return (
    <div style={{ height: fit.height }}>
      <div ref={innerRef} style={fit.scale < 1
        ? { transform: `scale(${fit.scale})`, transformOrigin: 'top center' }
        : undefined}>
        {children}
      </div>
    </div>
  );
}
