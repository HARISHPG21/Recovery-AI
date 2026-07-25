import React, { useEffect, useRef } from 'react';
import { useRecovery } from '../context/RecoveryContext';

export const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isDark } = useRecovery();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width  = (canvas.width  = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = Math.floor(Math.min(width, height) / 20);
    const particles: Array<{ x: number; y: number; radius: number; vx: number; vy: number; alpha: number }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x:      Math.random() * width,
        y:      Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        vx:     (Math.random() - 0.5) * 0.4,
        vy:     (Math.random() - 0.5) * 0.4,
        alpha:  Math.random() * 0.4 + 0.1,
      });
    }

    // Derive colour from the live CSS variable at render time so theme changes are picked up
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const style = getComputedStyle(document.documentElement);
      const isLight = document.documentElement.classList.contains('light');
      const particleColor = isLight ? '99, 102, 241' : '99, 102, 241';

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width)  p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${isLight ? p.alpha * 0.35 : p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]); // re-run when theme changes to reset

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
    />
  );
};
