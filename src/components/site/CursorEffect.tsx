'use client';

import TargetCursor from '@/components/reactbits/TargetCursor';
import { useMediaQuery } from './useMediaQuery';

// Crosshair cursor that locks on to `.cursor-target` elements. Desktop mouse only.
export default function CursorEffect({ color }: { color: string }) {
  const enabled = useMediaQuery('(pointer: fine) and (prefers-reduced-motion: no-preference)');
  if (!enabled) return null;
  return <TargetCursor spinDuration={2.5} hideDefaultCursor={false} cursorColor={color} />;
}
