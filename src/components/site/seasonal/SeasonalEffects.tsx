'use client';

import type { Season } from '@/lib/season';
import { useMediaQuery } from '../useMediaQuery';
import Pumpkin from './Pumpkin';
import Snow from './Snow';

// Page-wide extras for the current season. Moving effects respect reduced motion.
export default function SeasonalEffects({ season }: { season: Season }) {
  const motionOk = useMediaQuery('(prefers-reduced-motion: no-preference)');
  if (season === 'christmas') return motionOk ? <Snow /> : null;
  if (season === 'halloween') {
    return (
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-between px-2 sm:px-4">
        <Pumpkin className="h-10 w-10 -rotate-6 drop-shadow sm:h-14 sm:w-14" />
        <Pumpkin className="h-8 w-8 rotate-6 drop-shadow sm:h-11 sm:w-11" />
      </div>
    );
  }
  return null;
}
