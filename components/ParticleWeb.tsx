'use client';

import { useEffect, useRef } from 'react';

// The purple "web" from the old site, rebuilt without particles.js: drifting dots that link up
// within 150px, scatter from the cursor, and spawn a few more where you click.
const LINK_DISTANCE = 150;
const REPULSE_DISTANCE = 110;
const SPEED = 0.55;

type Dot = { x: number; y: number; vx: number; vy: number; r: number };

export default function ParticleWeb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let dots: Dot[] = [];
    let rgb = '176, 75, 196';
    let frame = 0;
    const mouse = { x: -9999, y: -9999 };

    const readColour = () => {
      rgb = getComputedStyle(document.documentElement).getPropertyValue('--web-rgb').trim() || rgb;
    };

    const spawn = (x = Math.random() * w, y = Math.random() * h): Dot => {
      const angle = Math.random() * Math.PI * 2;
      const speed = SPEED * (0.4 + Math.random() * 0.8);
      return { x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r: 1 + Math.random() * 2.6 };
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.max(36, Math.min(140, Math.round((w * h) / 9500)));
      while (dots.length < target) dots.push(spawn());
      dots.length = target;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DISTANCE * LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(${rgb}, ${0.4 * (1 - Math.sqrt(d2) / LINK_DISTANCE)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.fillStyle = `rgba(${rgb}, 0.55)`;
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < REPULSE_DISTANCE && dist > 0) {
          const push = (1 - dist / REPULSE_DISTANCE) * 5;
          d.x += (dx / dist) * push;
          d.y += (dy / dist) * push;
        }
        if (d.x < -10) d.x = w + 10;
        if (d.x > w + 10) d.x = -10;
        if (d.y < -10) d.y = h + 10;
        if (d.y > h + 10) d.y = -10;
      }
      draw();
      frame = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 4; i++) dots.push(spawn(e.clientX, e.clientY));
      if (dots.length > 220) dots.splice(0, dots.length - 220);
    };
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden && !reduced) frame = requestAnimationFrame(step);
    };
    const themeObserver = new MutationObserver(() => {
      readColour();
      if (reduced) draw();
    });

    readColour();
    resize();
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('resize', resize);
    if (reduced) {
      draw();
    } else {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
      window.addEventListener('click', onClick);
      document.addEventListener('visibilitychange', onVisibility);
      frame = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}
    />
  );
}
