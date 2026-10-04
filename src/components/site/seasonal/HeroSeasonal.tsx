'use client';

import type { Season } from '@/lib/season';
import { useMediaQuery } from '../useMediaQuery';
import Bats from './Bats';
import Fireworks from './Fireworks';
import Pumpkin from './Pumpkin';

// Seasonal layer inside the navy hero, above the glow and below the content.
export default function HeroSeasonal({ season }: { season: Season }) {
  const motionOk = useMediaQuery('(prefers-reduced-motion: no-preference)');
  if (season === 'newyear') return motionOk ? <Fireworks /> : null;
  if (season === 'halloween') {
    return (
      <>
        {motionOk && <Bats />}
        <div aria-hidden="true" className="pointer-events-none absolute bottom-3 right-4 flex items-end gap-1 sm:right-8">
          <Pumpkin className="h-12 w-12 sm:h-16 sm:w-16" />
          <Pumpkin className="h-8 w-8 sm:h-10 sm:w-10" />
        </div>
      </>
    );
  }
  return null;
}
