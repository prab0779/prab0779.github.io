import { useState, useCallback, useEffect, useRef, useMemo, ReactNode } from 'react';
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'motion/react';

const PRESETS = {
  gold:   ["#c6a44b", "#f5d97a", "#fff3b0", "#f5d97a", "#c6a44b"],
  silver: ["#9a9a9a", "#d1d5db", "#ffffff", "#d1d5db", "#9a9a9a"],
  green:  ["#3b6d11", "#639922", "#c0dd97", "#639922", "#3b6d11"],
  blue:   ["#185fa5", "#378add", "#b5d4f4", "#378add", "#185fa5"],
  red:    ["#a32d2d", "#e24b4a", "#f7c1c1", "#e24b4a", "#a32d2d"],
  purple: ["#534ab7", "#7f77dd", "#cecbf6", "#7f77dd", "#534ab7"],
  yellow: ["#a86e00", "#e89c00", "#ffd95c", "#e89c00", "#a86e00"],
} as const;

type Variant = keyof typeof PRESETS;

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  animationSpeed?: number;
  showBorder?: boolean;
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  pauseOnHover?: boolean;
  yoyo?: boolean;
}

export default function GradientText({
  children,
  className = '',
  variant = 'gold',
  animationSpeed = 15,
  showBorder = false,
  direction = 'horizontal',
  pauseOnHover = false,
  yoyo = true,
}: GradientTextProps) {
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  // Keep mutable config in refs so the animation frame callback never needs
  // to be recreated — avoids re-registering on every prop change.
  const isPausedRef = useRef(isPaused);
  const yoyoRef = useRef(yoyo);
  const durationRef = useRef(animationSpeed * 1000);

  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { yoyoRef.current = yoyo; }, [yoyo]);
  useEffect(() => { durationRef.current = animationSpeed * 1000; }, [animationSpeed]);

  // Reset playhead when speed or yoyo mode changes.
  useEffect(() => {
    elapsedRef.current = 0;
    lastTimeRef.current = null;
    progress.set(0);
  }, [animationSpeed, yoyo, progress]);

  // Stable callback — reads all config from refs, never recreated.
  useAnimationFrame((time) => {
    if (isPausedRef.current) {
      lastTimeRef.current = null;
      return;
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    elapsedRef.current += time - lastTimeRef.current;
    lastTimeRef.current = time;

    const duration = durationRef.current;

    if (yoyoRef.current) {
      const cycleTime = elapsedRef.current % (duration * 2);
      progress.set(
        cycleTime < duration
          ? (cycleTime / duration) * 100
          : 100 - ((cycleTime - duration) / duration) * 100
      );
    } else {
      progress.set((elapsedRef.current / duration) * 100);
    }
  });

  // Derive gradient strings once — only recompute when variant/direction changes.
  const { gradientStyle } = useMemo(() => {
    const colors = PRESETS[variant];
    const angle =
      direction === 'horizontal' ? 'to right' :
      direction === 'vertical'   ? 'to bottom' :
                                   'to bottom right';
    const size =
      direction === 'horizontal' ? '300% 100%' :
      direction === 'vertical'   ? '100% 300%' :
                                   '300% 300%';

    return {
      gradientStyle: {
        backgroundImage: `linear-gradient(${angle}, ${[...colors, colors[0]].join(', ')})`,
        backgroundSize: size,
        backgroundRepeat: 'repeat' as const,
      },
    };
  }, [variant, direction]);

  // useTransform is already stable across renders — no change needed here.
  const backgroundPosition = useTransform(progress, (p) =>
    direction === 'vertical' ? `50% ${p}%` : `${p}% 50%`
  );

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

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
              transform: 'translate(-50%, -50%)',
            }}
          />
        </motion.span>
      )}

      <motion.span
        className="inline-block text-transparent bg-clip-text"
        style={{ ...gradientStyle, backgroundPosition, WebkitBackgroundClip: 'text' }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
