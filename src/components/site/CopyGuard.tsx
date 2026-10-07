'use client';

import { useEffect } from 'react';

// Places where visitors still need to select, copy and paste: form fields and
// anything marked data-allow-copy (the contact details).
const ALLOWED = 'input, textarea, select, [contenteditable="true"], [data-allow-copy]';

function allowed(target: EventTarget | null) {
  return target instanceof Element && target.closest(ALLOWED) !== null;
}

// Discourages casual copying of the public pages: blocks copy, cut and image
// dragging outside form fields. Anyone determined can still read the page source,
// so this is a deterrent, not protection.
export default function CopyGuard() {
  useEffect(() => {
    const block = (e: Event) => {
      if (allowed(e.target)) return;
      // A selection that starts in an allowed field reports that field as the target.
      const anchor = document.getSelection()?.anchorNode;
      if (anchor && allowed(anchor instanceof Element ? anchor : anchor.parentElement)) return;
      e.preventDefault();
    };
    const blockDrag = (e: DragEvent) => {
      if (e.target instanceof HTMLImageElement || !allowed(e.target)) e.preventDefault();
    };
    document.addEventListener('copy', block);
    document.addEventListener('cut', block);
    document.addEventListener('dragstart', blockDrag);
    document.documentElement.classList.add('no-copy');
    return () => {
      document.removeEventListener('copy', block);
      document.removeEventListener('cut', block);
      document.removeEventListener('dragstart', blockDrag);
      document.documentElement.classList.remove('no-copy');
    };
  }, []);
  return null;
}
