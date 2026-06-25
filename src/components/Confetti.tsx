/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  shape: 'circle' | 'square' | 'heart';
  velocityX: number;
  velocityY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

const COLORS = [
  '#f43f5e', // rose
  '#ec4899', // pink
  '#a855f7', // purple
  '#3b82f6', // blue
  '#10b981', // green
  '#eab308', // yellow
  '#f97316', // orange
];

export const Confetti: React.FC<ConfettiProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create particles
    const particles: Particle[] = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * 100,
        y: height / 2 + (Math.random() - 0.5) * 100,
        size: Math.random() * 12 + 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: ['circle', 'square', 'heart'][Math.floor(Math.random() * 3)] as any,
        velocityX: (Math.random() - 0.5) * 15,
        velocityY: -Math.random() * 15 - 5, // shoot up
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        opacity: 1,
      });
    }

    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      c.beginPath();
      c.moveTo(x, y + size / 4);
      c.quadraticCurveTo(x, y, x + size / 2, y);
      c.quadraticCurveTo(x + size, y, x + size, y + size / 3);
      c.quadraticCurveTo(x + size, y + (size * 2) / 3, x + size / 2, y + size);
      c.quadraticCurveTo(x, y + (size * 2) / 3, x, y + size / 3);
      c.quadraticCurveTo(x, y, x, y + size / 4);
      c.closePath();
      c.fill();
    };

    const update = () => {
      ctx.clearRect(0, 0, width, height);

      let alive = false;

      particles.forEach((p) => {
        if (p.opacity <= 0) return;

        alive = true;
        // Gravity and physics
        p.x += p.velocityX;
        p.y += p.velocityY;
        p.velocityY += 0.3; // gravity
        p.velocityX *= 0.98; // resistance
        p.rotation += p.rotationSpeed;

        // Fade out as it hits screen bottom or after a short delay
        if (p.y > height * 0.75) {
          p.opacity -= 0.02;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'square') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else if (p.shape === 'heart') {
          drawHeart(ctx, -p.size / 2, -p.size / 2, p.size);
        }

        ctx.restore();
      });

      if (alive) {
        animationId = requestAnimationFrame(update);
      }
    };

    update();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  return (
    <canvas
      id="confetti-canvas"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
