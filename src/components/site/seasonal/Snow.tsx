'use client';

import { useEffect, useRef } from 'react';

// Light snowfall over the whole page. Canvas only, ignores pointer events.
export default function Snow() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let w = 0;
    let h = 0;
    let frame = 0;
    const flakes = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), r: 1 + Math.random() * 2.5, s: 0.3 + Math.random() * 0.8, d: Math.random() * Math.PI * 2 }));
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.s / h;
        f.d += 0.01;
        if (f.y > 1.02) {
          f.y = -0.02;
          f.x = Math.random();
        }
        const x = f.x * w + Math.sin(f.d) * 12;
        ctx.beginPath();
        ctx.arc(x, f.y * h, f.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.shadowColor = 'rgba(7,26,51,0.25)';
        ctx.shadowBlur = 2;
        ctx.fill();
      }
      frame = requestAnimationFrame(tick);
    };
    resize();
    tick();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30" />;
}
