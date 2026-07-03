'use client';
import { useState, type CSSProperties } from 'react';

export function ImageSlot({ src, alt = '', placeholder, mask, className, style }: {
  src?: string; alt?: string; placeholder: string; mask?: string; className?: string; style?: CSSProperties;
}) {
  const [errored, setErrored] = useState(false);
  const showImg = !!src && !errored;
  const base: CSSProperties = { position: 'relative', overflow: 'hidden', clipPath: mask, ...style };
  if (showImg) {
    return (
      <div className={className} style={base}>
        <img src={src} alt={alt} onError={() => setErrored(true)}
             style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    );
  }
  return (
    <div className={className} style={{ ...base, background: 'rgba(244,241,234,.04)', border: '2px dashed rgba(244,241,234,.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 12 }}>
      <span style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: '.16em', fontSize: 14,
        color: 'rgba(244,241,234,.7)' }}>{placeholder}</span>
    </div>
  );
}
