import { useEffect, useRef, useState } from 'react';

/**
 * Drag and drop handled at the window, not on a card.
 *
 * Two reasons it lives up here. A 300px dashed box is a small thing to aim a
 * file at, and the whole page is an easier target. And the browser's own
 * response to a dropped file is to navigate away and show it -- so the drop
 * has to be cancelled somewhere whatever we do with it.
 */
export function useFileDrop(onFile: (file: File) => void, enabled = true) {
  const [over, setOver] = useState(false);

  // The callback is rebuilt on every render; the listeners should not be.
  const latest = useRef(onFile);
  latest.current = onFile;

  useEffect(() => {
    if (!enabled) {
      setOver(false);
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
      setOver(true);
    };

    const over_ = (e: DragEvent) => {
      if (!isFile(e)) return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    };

    const leave = (e: DragEvent) => {
      if (!isFile(e)) return;
      depth = Math.max(0, depth - 1);
      if (depth === 0) setOver(false);
    };

    const drop = (e: DragEvent) => {
      if (!isFile(e)) return;
      e.preventDefault();
      depth = 0;
      setOver(false);
      const file = e.dataTransfer?.files?.[0];
      if (file) latest.current(file);
    };

    window.addEventListener('dragenter', enter);
    window.addEventListener('dragover', over_);
    window.addEventListener('dragleave', leave);
    window.addEventListener('drop', drop);

    return () => {
      window.removeEventListener('dragenter', enter);
      window.removeEventListener('dragover', over_);
      window.removeEventListener('dragleave', leave);
      window.removeEventListener('drop', drop);
    };
  }, [enabled]);

  return over;
}
