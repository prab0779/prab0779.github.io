import React, { useRef, useEffect } from 'react';

interface ShapeGridProps {
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left';
  speed?: number;
  borderColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
  hoverTrailAmount?: number;
}

const ShapeGrid: React.FC<ShapeGridProps> = ({
  direction = 'right',
  speed = 20,
  borderColor = '#999',
  squareSize = 40,
  hoverFillColor = '#222',
  hoverTrailAmount = 0
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const gridOffset = useRef({ x: 0, y: 0 });
  const hoveredSquareRef = useRef<{ x: number; y: number } | null>(null);
  const trailCells = useRef<{ x: number; y: number }[]>([]);
  const cellOpacities = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const updateCellOpacities = () => {
      const targets = new Map<string, number>();

      if (hoveredSquareRef.current) {
        targets.set(`${hoveredSquareRef.current.x},${hoveredSquareRef.current.y}`, 1);
      }

      for (let i = 0; i < trailCells.current.length; i++) {
        const t = trailCells.current[i];
        const key = `${t.x},${t.y}`;
        targets.set(key, (trailCells.current.length - i) / (trailCells.current.length + 1));
      }

      for (const [key] of targets) {
        if (!cellOpacities.current.has(key)) {
          cellOpacities.current.set(key, 0);
        }
      }

      for (const [key, opacity] of cellOpacities.current) {
        const target = targets.get(key) || 0;
        const next = opacity + (target - opacity) * 0.15;

        if (next < 0.01) {
          cellOpacities.current.delete(key);
        } else {
          cellOpacities.current.set(key, next);
        }
      }
    };

    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / squareSize) + 2;
      const rows = Math.ceil(height / squareSize) + 2;

      const offsetX = Math.floor(gridOffset.current.x % squareSize);
      const offsetY = Math.floor(gridOffset.current.y % squareSize);

      for (let col = -1; col < cols; col++) {
        for (let row = -1; row < rows; row++) {
          const x = Math.floor(col * squareSize + offsetX);
          const y = Math.floor(row * squareSize + offsetY);

          const key = `${col},${row}`;
          const alpha = cellOpacities.current.get(key);

          if (alpha) {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(x, y, squareSize, squareSize);
            ctx.globalAlpha = 1;
          }

          ctx.strokeStyle = borderColor;
          ctx.strokeRect(x + 0.5, y + 0.5, squareSize, squareSize);
        }
      }

      // ✅ SOFT VERTICAL FADE (FIXED)
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(0.75, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(6,0,16,0.4)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    let lastTime = 0;

    const loop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      const move = speed * (delta / 16);

      switch (direction) {
        case 'right':
          gridOffset.current.x -= move;
          break;
        case 'left':
          gridOffset.current.x += move;
          break;
        case 'up':
          gridOffset.current.y += move;
          break;
        case 'down':
          gridOffset.current.y -= move;
          break;
        case 'diagonal':
          gridOffset.current.x -= move;
          gridOffset.current.y -= move;
          break;
      }

      updateCellOpacities();
      draw();

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / squareSize);
      const y = Math.floor((e.clientY - rect.top) / squareSize);

      if (!hoveredSquareRef.current || hoveredSquareRef.current.x !== x || hoveredSquareRef.current.y !== y) {
        if (hoveredSquareRef.current) {
          trailCells.current.unshift({ ...hoveredSquareRef.current });
          if (trailCells.current.length > hoverTrailAmount) {
            trailCells.current.length = hoverTrailAmount;
          }
        }
        hoveredSquareRef.current = { x, y };
      }
    };

    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseleave', () => {
      hoveredSquareRef.current = null;
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener('mousemove', handleMove);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize, hoverTrailAmount]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};

export default ShapeGrid;