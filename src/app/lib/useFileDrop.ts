import { useEffect, useRef, useState } from 'react';

/**
 * Drag and drop handled at the window, not on a card.
 *
 * Two reasons it lives up here. A 300px dashed box is a small thing to aim a
 * file at, and the whole page is an easier target. And the browser's own
 * response to a dropped file is to navigate away and show it -- so the drop
 * has to be cancelled somewhere whatever we do with it.
 *
 * `zoneOf` names the part of the screen the pointer is over, so one drag can
 * mean two things: the same file let go over the document or over the sidebar.
 */
export function useFileDrop<Z extends string>(
  onFile: (file: File, zone: Z) => void,
  zoneOf: (e: DragEvent) => Z,
  enabled = true,
) {
  const [zone, setZone] = useState<Z | null>(null);

  // The callbacks are rebuilt on every render; the listeners should not be.
  const latest = useRef({ onFile, zoneOf });
  latest.current = { onFile, zoneOf };

  useEffect(() => {
    if (!enabled) {
      setZone(null);
      return;
    }

    // dragenter and dragleave fire again for every element the pointer crosses
    // on its way in, so a plain boolean flickers. Counting depth does not.
    let depth = 0;
    const isFile = (e: DragEvent) => e.dataTransfer?.types.includes('Files') ?? false;

    const enter = (e: DragEvent) => {
      if (!isFile(e)) return;
      e.preventDefault();
      depth += 1;
      setZone(latest.current.zoneOf(e));
    };

    // dragover fires every few milliseconds; setting the same zone again is a
    // no-op for React, so this only re-renders when the pointer crosses over.
    const over = (e: DragEvent) => {
      if (!isFile(e)) return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
      setZone(latest.current.zoneOf(e));
    };

    const leave = (e: DragEvent) => {
      if (!isFile(e)) return;
      depth = Math.max(0, depth - 1);
      if (depth === 0) setZone(null);
    };

    const drop = (e: DragEvent) => {
      if (!isFile(e)) return;
      e.preventDefault();
      depth = 0;
      setZone(null);
      const file = e.dataTransfer?.files?.[0];
      if (file) latest.current.onFile(file, latest.current.zoneOf(e));
    };

    window.addEventListener('dragenter', enter);
    window.addEventListener('dragover', over);
    window.addEventListener('dragleave', leave);
    window.addEventListener('drop', drop);

    return () => {
      window.removeEventListener('dragenter', enter);
      window.removeEventListener('dragover', over);
      window.removeEventListener('dragleave', leave);
      window.removeEventListener('drop', drop);
    };
  }, [enabled]);

  return zone;
}
