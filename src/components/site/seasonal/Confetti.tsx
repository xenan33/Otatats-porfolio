'use client';

import { useEffect, useRef } from 'react';

// Slow confetti falling over the whole page, in the given colours.
export default function Confetti({ colors }: { colors: string[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let frame = 0;
    const bits = Array.from({ length: 60 }, () => ({
      x: Math.random(),
      y: Math.random(),
      s: 0.4 + Math.random() * 0.9,
      r: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.12,
      d: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    const tick = () => {
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      for (const b of bits) {
        b.y += b.s / h;
        b.r += b.spin;
        b.d += 0.02;
        if (b.y > 1.03) {
          b.y = -0.03;
          b.x = Math.random();
        }
        ctx.save();
        ctx.translate(b.x * w + Math.sin(b.d) * 10, b.y * h);
        ctx.rotate(b.r);
        ctx.scale(1, Math.cos(b.d * 2));
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = b.color;
        ctx.fillRect(-3, -5, 6, 10);
        ctx.restore();
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
  }, [colors]);
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30" />;
}
