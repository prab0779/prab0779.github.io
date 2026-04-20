import { useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'motion/react';

const PRESETS = {
  gold: [
    "#c6a44b",
    "#f5d97a",
    "#fff3b0",
    "#f5d97a",
    "#c6a44b"
  ],
  silver: [
    "#9a9a9a",
    "#d1d5db",
    "#ffffff",
    "#d1d5db",
    "#9a9a9a"
  ]
};

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  variant?: 'gold' | 'silver';
  animationSpeed?: number;
  showBorder?: boolean;
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  pauseOnHover?: boolean;
  yoyo?: boolean;
}

export default function GradientText({
  children,
  className = '',
  colors,
  variant = 'gold',
  animationSpeed = 15,
  showBorder = false,
  direction = 'horizontal',
  pauseOnHover = false,
  yoyo = true
}: GradientTextProps) {
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const resolvedColors = colors || PRESETS[variant];
  const animationDuration = animationSpeed * 1000;

  useAnimationFrame(time => {
    if (isPaused) {
      lastTimeRef.current = null;
      return;
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += deltaTime;

    if (yoyo) {
      const fullCycle = animationDuration * 2;
      const cycleTime = elapsedRef.current % fullCycle;

      if (cycleTime < animationDuration) {
        progress.set((cycleTime / animationDuration) * 100);
      } else {
        progress.set(100 - ((cycleTime - animationDuration) / animationDuration) * 100);
      }
    } else {
      progress.set((elapsedRef.current / animationDuration) * 100);
    }
  });

  useEffect(() => {
    elapsedRef.current = 0;
    progress.set(0);
  }, [animationSpeed, yoyo]);

  const backgroundPosition = useTransform(progress, p => {
    if (direction === 'horizontal') return `${p}% 50%`;
    if (direction === 'vertical') return `50% ${p}%`;
    return `${p}% 50%`;
  });

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  const gradientAngle =
    direction === 'horizontal'
      ? 'to right'
      : direction === 'vertical'
      ? 'to bottom'
      : 'to bottom right';

  const gradientColors = [...resolvedColors, resolvedColors[0]].join(', ');

  const gradientStyle = {
    backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
    backgroundSize:
      direction === 'horizontal'
        ? '300% 100%'
        : direction === 'vertical'
        ? '100% 300%'
        : '300% 300%',
    backgroundRepeat: 'repeat'
  };

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showBorder && (
        <motion.span
          className="absolute inset-0 z-0 pointer-events-none rounded-xl"
          style={{ ...gradientStyle, backgroundPosition }}
        >
          <span
            className="absolute bg-black rounded-xl z-[-1]"
            style={{
              width: 'calc(100% - 2px)',
              height: 'calc(100% - 2px)',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </motion.span>
      )}

      <motion.span
        className="inline-block text-transparent bg-clip-text"
        style={{
          ...gradientStyle,
          backgroundPosition,
          WebkitBackgroundClip: 'text'
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}