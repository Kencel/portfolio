'use client';
import { useEffect, useState } from 'react';

// Latest value from a sequence of increasingly complete versions of the same
// data, e.g. [quick, refined]: null until the first lands, then each later
// stage replaces it. A stage that settles after a later one is ignored, and a
// rejected stage leaves the last good value in place. Lets the page render
// before slow server data arrives without ever showing an older version.
export function useProgressive<T>(stages: readonly Promise<T>[]): T | null {
  const [value, setValue] = useState<T | null>(null);
  useEffect(() => {
    let live = true;
    let best = -1;
    stages.forEach((stage, i) => {
      stage.then(v => {
        if (!live || i <= best) return;
        best = i;
        setValue(() => v);
      }, () => {});
    });
    return () => { live = false; };
  }, [stages]);
  return value;
}
