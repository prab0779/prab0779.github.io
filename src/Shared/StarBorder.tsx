import React from 'react';

type StarBorderProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: React.CSSProperties['animationDuration'];
  thickness?: number;
};

const StarBorder = <T extends React.ElementType = 'button'>({
  as,
  className = '',
  color = 'white',
  speed = '5s',
  thickness = 2,
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || 'button';

  return (
    <Component
      {...(rest as any)}
      className="relative inline-block rounded-[16px] overflow-hidden"
      style={{
        padding: thickness
      }}
    >
      {/* ✨ Animated glow layers */}
      <div
        className="absolute inset-0 opacity-70 animate-star-movement-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      />
      <div
        className="absolute inset-0 opacity-70 animate-star-movement-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      />

      {/* ✅ ACTUAL BUTTON */}
      <div
        className={`relative z-10 rounded-[14px] ${className}`}
      >
        {children}
      </div>
    </Component>
  );
};

export default StarBorder;

// tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       animation: {
//         'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
//         'star-movement-top': 'star-movement-top linear infinite alternate',
//       },
//       keyframes: {
//         'star-movement-bottom': {
//           '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
//           '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
//         },
//         'star-movement-top': {
//           '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
//           '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
//         },
//       },
//     },
//   }
// }
