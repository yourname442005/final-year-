'use client';

import React, { useEffect, useRef } from 'react';

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  color?: string;
}

export const Particles: React.FC<ParticlesProps> = ({
  className = '',
  quantity = 40,
  staticity = 50,
  ease = 50,
  color = '#8A8A84'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<any[]>([]);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (canvasRef.current) {
      context.current = canvasRef.current.getContext('2d');
    }
    initCanvas();
    animate();
    window.addEventListener('resize', initCanvas);

    return () => {
      window.removeEventListener('resize', initCanvas);
    };
  }, []);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { clientX, clientY } = e;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      mouse.current.x = x;
      mouse.current.y = y;
    }
  };

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current = [];
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const circleParams = () => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const size = Math.floor(Math.random() * 2) + 1.5;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.4 + 0.15).toFixed(2));
    const dx = (Math.random() - 0.5) * 0.4;
    const dy = (Math.random() - 0.5) * 0.4;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism
    };
  };

  const drawParticles = () => {
    circles.current = [];
    for (let i = 0; i < quantity; i++) {
      circles.current.push(circleParams());
    }
  };

  const drawCircle = (circle: any, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(74, 74, 69, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const drawConnections = () => {
    if (!context.current) return;
    const len = circles.current.length;
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const dx = circles.current[i].x - circles.current[j].x;
        const dy = circles.current[i].y - circles.current[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.12;
          context.current.beginPath();
          context.current.moveTo(circles.current[i].x, circles.current[i].y);
          context.current.lineTo(circles.current[j].x, circles.current[j].y);
          context.current.strokeStyle = `rgba(138, 138, 132, ${alpha})`;
          context.current.lineWidth = 0.75;
          context.current.stroke();
        }
      }
    }
  };

  const animate = () => {
    if (context.current) {
      context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
    }
    circles.current.forEach((circle, i) => {
      // Fade in
      const edge = [
        circle.x < 20 ? circle.x / 20 : 1,
        canvasSize.current.w - circle.x < 20 ? (canvasSize.current.w - circle.x) / 20 : 1,
        circle.y < 20 ? circle.y / 20 : 1,
        canvasSize.current.h - circle.y < 20 ? (canvasSize.current.h - circle.y) / 20 : 1
      ];

      const minEdge = Math.min(...edge);
      if (circle.alpha < circle.targetAlpha) {
        circle.alpha += 0.01;
      }
      circle.alpha = Math.min(circle.alpha, minEdge * circle.targetAlpha);

      circle.x += circle.dx;
      circle.y += circle.dy;

      if (
        circle.x < -10 ||
        circle.x > canvasSize.current.w + 10 ||
        circle.y < -10 ||
        circle.y > canvasSize.current.h + 10
      ) {
        circles.current[i] = circleParams();
      }

      // Mouse interactive magnetism
      const dx = mouse.current.x - circle.x;
      const dy = mouse.current.y - circle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        circle.translateX += (dx / dist) * 0.5;
        circle.translateY += (dy / dist) * 0.5;
      } else {
        circle.translateX *= 0.95;
        circle.translateY *= 0.95;
      }

      drawCircle(circle, true);
    });

    drawConnections();
    requestAnimationFrame(animate);
  };

  return (
    <div
      className={`pointer-events-none ${className}`}
      ref={canvasContainerRef}
      onMouseMove={onMouseMove}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="pointer-events-none" />
    </div>
  );
};
