'use client';

import Aurora from '@/components/reactbits/Aurora';
import { useMediaQuery } from './useMediaQuery';

// Soft aurora behind the navy hero. Static glow for phones and reduced motion.
export default function HeroBackdrop({ animated, colors }: { animated: boolean; colors?: [string, string, string] }) {
  const motionOk = useMediaQuery('(prefers-reduced-motion: no-preference) and (min-width: 768px)');
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {animated && motionOk ? (
        <div className="absolute inset-x-0 top-0 h-[70%] opacity-60">
          <Aurora colorStops={colors ?? ['#0b3b7a', '#0a68e6', '#3f8dff']} amplitude={0.8} blend={0.55} speed={0.6} />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_0%,rgba(10,111,240,0.35),transparent)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy/40 to-navy" />
    </div>
  );
}
