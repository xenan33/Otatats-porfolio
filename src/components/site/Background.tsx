'use client';

import LetterGlitch from '@/components/reactbits/LetterGlitch';
import { useMediaQuery } from './useMediaQuery';

type Props = { effect: 'letter-glitch' | 'dot-grid' | 'none'; accent: string };

// Fixed page background. The animated canvas only runs on larger screens for
// visitors who haven't asked for reduced motion; everyone else gets a static grid.
export default function Background({ effect, accent }: Props) {
  const animate = useMediaQuery('(prefers-reduced-motion: no-preference) and (min-width: 768px)');

  if (effect === 'none') return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      {effect === 'letter-glitch' && animate ? (
        <div className="absolute inset-0 opacity-15">
          <LetterGlitch
            glitchColors={['#c9d6e8', accent, '#9fb3cf']}
            lightMode
            backgroundColor="transparent"
            glitchSpeed={60}
            centerVignette={false}
            outerVignette
            smooth
            characters="01ABCDEF{}[]<>/$#@!&*=+;:"
          />
        </div>
      ) : (
        <div className="dot-grid absolute inset-0 opacity-60" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/80 to-bg" />
    </div>
  );
}
