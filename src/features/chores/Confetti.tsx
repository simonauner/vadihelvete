'use client';

import { useEffect, useRef } from 'react';

const COLORS = [
  '#d92f1a',
  '#ff9f1c',
  '#ffd23f',
  '#2ec4b6',
  '#3a86ff',
  '#8338ec',
];
const DURATION_MS = 4000;
const STEP_MS = 1000 / 60;

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  spin: number;
  angle: number;
  color: string;
};

/** Bursts confetti over the page once, when it mounts. */
export const Confetti = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ratio = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.scale(ratio, ratio);

    const pieces: Piece[] = Array.from({ length: 160 }, (_, index) => {
      const fromLeft = index % 2 === 0;
      return {
        x: fromLeft ? 0 : width,
        y: height * 0.7,
        vx: (fromLeft ? 1 : -1) * (4 + Math.random() * 9),
        vy: -(10 + Math.random() * 12),
        size: 6 + Math.random() * 6,
        spin: (Math.random() - 0.5) * 0.4,
        angle: Math.random() * Math.PI,
        color: COLORS[index % COLORS.length],
      };
    });

    const step = () => {
      for (const piece of pieces) {
        piece.vy += 0.35;
        piece.vx *= 0.99;
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.angle += piece.spin;
      }
    };

    const start = performance.now();
    let stepped = 0;
    let frame = 0;

    const draw = (now: number) => {
      const elapsed = now - start;
      // Step at a fixed 60 per second so the speed does not follow the screen's refresh rate.
      const due = Math.floor(elapsed / STEP_MS);
      for (; stepped < due; stepped++) step();

      context.clearRect(0, 0, width, height);
      context.globalAlpha = Math.max(0, 1 - elapsed / DURATION_MS);

      for (const piece of pieces) {
        context.save();
        context.translate(piece.x, piece.y);
        context.rotate(piece.angle);
        context.fillStyle = piece.color;
        context.fillRect(
          -piece.size / 2,
          -piece.size / 4,
          piece.size,
          piece.size / 2
        );
        context.restore();
      }

      if (elapsed < DURATION_MS) frame = requestAnimationFrame(draw);
      else context.clearRect(0, 0, width, height);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    />
  );
};
