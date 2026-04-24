import { MotionValue, motion, useSpring, useTransform } from 'motion/react';
import React, { useEffect, useMemo } from 'react';

type PlaceValue = number | '.';

interface NumberProps {
  mv: MotionValue<number>;
  number: number;
  height: number;
}

// Only render nearby digits instead of all 10
const DIGIT_RANGE = [-2, -1, 0, 1, 2];

const Number = React.memo(function Number({ mv, number, height }: NumberProps) {
  const y = useTransform(mv, latest => {
    const placeValue = latest % 10;
    const diff = number - placeValue;
    return diff * height;
  });

  return (
    <motion.span
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        y,
        willChange: 'transform'
      }}
    >
      {number}
    </motion.span>
  );
});

function normalizeNearInteger(num: number): number {
  const nearest = Math.round(num);
  const tolerance = 1e-9 * Math.max(1, Math.abs(num));
  return Math.abs(num - nearest) < tolerance ? nearest : num;
}

function getValueRoundedToPlace(value: number, place: number): number {
  const scaled = value / place;
  return Math.floor(normalizeNearInteger(scaled));
}

interface DigitProps {
  place: PlaceValue;
  value: number;
  height: number;
  digitStyle?: React.CSSProperties;
}

const Digit = React.memo(function Digit({
  place,
  value,
  height,
  digitStyle
}: DigitProps) {
  if (place === '.') {
    return (
      <span
        style={{
          height,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        .
      </span>
    );
  }

  const valueRoundedToPlace = getValueRoundedToPlace(value, place);

  const animatedValue = useSpring(valueRoundedToPlace, {
    stiffness: 120,
    damping: 20,
    mass: 0.8
  });

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [valueRoundedToPlace]);

  const base = valueRoundedToPlace % 10;

  return (
    <span
      style={{
        height,
        width: '1ch',
        position: 'relative',
        overflow: 'hidden',
        fontVariantNumeric: 'tabular-nums',
        ...digitStyle
      }}
    >
      {DIGIT_RANGE.map(offset => {
        const num = (base + offset + 10) % 10;
        return (
          <Number
            key={offset}
            mv={animatedValue}
            number={num}
            height={height}
          />
        );
      })}
    </span>
  );
});

interface CounterProps {
  value: number;
  fontSize?: number;
  padding?: number;
  places?: PlaceValue[];
  gap?: number;
  borderRadius?: number;
  horizontalPadding?: number;
  textColor?: string;
  fontWeight?: React.CSSProperties['fontWeight'];
  containerStyle?: React.CSSProperties;
  counterStyle?: React.CSSProperties;
  digitStyle?: React.CSSProperties;
  gradientHeight?: number;
  gradientFrom?: string;
  gradientTo?: string;
  topGradientStyle?: React.CSSProperties;
  bottomGradientStyle?: React.CSSProperties;
}

export default function Counter({
  value,
  fontSize,
  padding = 0,
  places,
  gap,
  borderRadius = 4,
  horizontalPadding = 8,
  textColor = '#e5e7eb',
  fontWeight = 'inherit',
  containerStyle,
  counterStyle,
  digitStyle,
  gradientHeight,
  gradientFrom = 'black',
  gradientTo = 'transparent',
  topGradientStyle,
  bottomGradientStyle
}: CounterProps) {
  // 📱 Mobile responsive sizing
  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 640;

  const responsiveFontSize =
    fontSize ??
    (typeof window !== 'undefined'
      ? Math.max(14, Math.min(22, window.innerWidth * 0.05))
      : 16);

  const responsiveGap =
    gap ??
    (typeof window !== 'undefined'
      ? Math.max(4, window.innerWidth * 0.015)
      : 6);

  const responsiveGradientHeight =
    gradientHeight ?? (isMobile ? 8 : 16);

  const height = responsiveFontSize + padding;

  // Auto-detect places
  const computedPlaces = useMemo(() => {
    if (places) return places;

    return [...value.toString()].map((ch, i, arr) => {
      if (ch === '.') return '.';

      const dotIndex = arr.indexOf('.');
      const isInteger = dotIndex === -1;

      const exponent = isInteger
        ? arr.length - i - 1
        : i < dotIndex
        ? dotIndex - i - 1
        : -(i - dotIndex);

      return 10 ** exponent;
    });
  }, [places, value]);

  const defaultContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block'
  };

  const defaultCounterStyle: React.CSSProperties = {
    fontSize: responsiveFontSize,
    display: 'flex',
    gap: responsiveGap,
    overflow: 'hidden',
    borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    lineHeight: 1,
    color: textColor,
    fontWeight,
    direction: 'ltr'
  };

  const gradientContainerStyle: React.CSSProperties = {
    pointerEvents: 'none',
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  };

  const defaultTopGradientStyle: React.CSSProperties = {
    height: responsiveGradientHeight,
    background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`
  };

  const defaultBottomGradientStyle: React.CSSProperties = {
    height: responsiveGradientHeight,
    background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`
  };

  return (
    <span style={{ ...defaultContainerStyle, ...containerStyle }}>
      <span style={{ ...defaultCounterStyle, ...counterStyle }}>
        {computedPlaces.map(place => (
          <Digit
            key={place}
            place={place}
            value={value}
            height={height}
            digitStyle={digitStyle}
          />
        ))}
      </span>

      <span style={gradientContainerStyle}>
        <span style={topGradientStyle ?? defaultTopGradientStyle} />
        <span style={bottomGradientStyle ?? defaultBottomGradientStyle} />
      </span>
    </span>
  );
}