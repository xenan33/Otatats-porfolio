import type { Season } from '@/lib/season';
import Lanterns from './Lanterns';
import Parol from './Parol';
import PhStars from './PhStars';
import PhSun from './PhSun';
import Pumpkin from './Pumpkin';

// Still decorations inside the navy hero, above the glow and below the content.
// Moving effects that cover the whole page live in SeasonalEffects.
export default function HeroSeasonal({ season }: { season: Season }) {
  switch (season) {
    case 'lunarnewyear':
      return <Lanterns />;
    case 'independence':
    case 'kagitingan':
    case 'heroes':
    case 'bonifacio':
      return (
        <>
          <PhSun />
          <PhStars />
        </>
      );
    case 'bermonths':
      return <Parol className="right-[8%]" />;
    case 'christmas':
      return (
        <>
          <Parol className="right-[6%]" />
          <Parol className="right-[20%] scale-75" />
        </>
      );
    case 'halloween':
      return (
        <div aria-hidden="true" className="pointer-events-none absolute bottom-3 right-4 flex items-end gap-1 sm:right-8">
          <Pumpkin className="h-12 w-12 sm:h-16 sm:w-16" />
          <Pumpkin className="h-8 w-8 sm:h-10 sm:w-10" />
        </div>
      );
    default:
      return null;
  }
}
