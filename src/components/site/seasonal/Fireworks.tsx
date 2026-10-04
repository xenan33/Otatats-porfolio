'use client';

import { useEffect, useRef } from 'react';

const COLORS = ['#facc15', '#f472b6', '#3b82f6', '#10b981', '#f97316', '#a855f7'];

// Fireworks bursting across the visible page. Canvas only, ignores pointer events.
export default function Fireworks() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    type Spark = { x: number; y: number; vx: number; vy: number; life: number; color: string };
    let sparks: Spark[] = [];
    let frame = 0;
    let next = 0;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    const burst = () => {
      const x = canvas.width * (0.15 + Math.random() * 0.7);
      const y = canvas.height * (0.1 + Math.random() * 0.5);
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      for (let i = 0; i < 60; i++) {
        const a = (Math.PI * 2 * i) / 60;
        const speed = 1.5 + Math.random() * 2.5;
        sparks.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, life: 1, color });
      }
    };
    const tick = (t: number) => {
      if (t > next) {
        burst();
        next = t + 1200 + Math.random() * 1400;
      }
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
      sparks = sparks.filter((s) => s.life > 0);
      for (const s of sparks) {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.035;
        s.vx *= 0.985;
        s.life -= 0.012;
        ctx.globalAlpha = Math.max(s.life, 0);
        ctx.fillStyle = s.color;
        ctx.fillRect(s.x, s.y, 2.5, 2.5);
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(tick);
    };
    resize();
    frame = requestAnimationFrame(tick);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30" />;
}
