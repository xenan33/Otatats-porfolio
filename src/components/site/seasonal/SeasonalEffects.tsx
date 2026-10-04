'use client';

import type { Season } from '@/lib/season';
import { useMediaQuery } from '../useMediaQuery';
import Bats from './Bats';
import Confetti from './Confetti';
import Fireworks from './Fireworks';
import Hearts from './Hearts';
import Pumpkin from './Pumpkin';
import Snow from './Snow';

const FIESTA = ['#facc15', '#ef4444', '#f97316', '#a855f7', '#22c55e', '#38bdf8'];
const FLAG = ['#0038a8', '#ce1126', '#fcd116'];
const TECH = ['#0a68e6', '#3f8dff', '#10b981', '#8cc2ff'];

// Page-wide effects for the current season. Anything that moves is skipped for reduced motion.
export default function SeasonalEffects({ season }: { season: Season }) {
  const motionOk = useMediaQuery('(prefers-reduced-motion: no-preference)');
  if (season === 'halloween') {
    return (
      <>
        {motionOk && <Bats />}
        <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-between px-2 sm:px-4">
          <Pumpkin className="h-10 w-10 -rotate-6 drop-shadow sm:h-14 sm:w-14" />
          <Pumpkin className="h-8 w-8 rotate-6 drop-shadow sm:h-11 sm:w-11" />
        </div>
      </>
    );
  }
  if (!motionOk) return null;
  switch (season) {
    case 'christmas':
      return <Snow />;
    case 'newyear':
      return <Fireworks />;
    case 'sinulog':
      return <Confetti colors={FIESTA} />;
    case 'independence':
      return <Confetti colors={FLAG} />;
    case 'sysadmin':
      return <Confetti colors={TECH} />;
    case 'valentines':
      return <Hearts />;
    default:
      return null;
  }
}
