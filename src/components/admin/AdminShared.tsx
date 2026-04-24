import React, { memo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getItemImageUrl } from '../../lib/supabase';
import { Item } from '../../types/Item';

// ── CSS class constants ──────────────────────────────────────────────────────

export const inputCls =
  'w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm ' +
  'focus:outline-none focus:ring-1 focus:ring-[#c4a04a]/60 focus:border-[#c4a04a]/60 ' +
  'transition-colors placeholder-white/20';

export const selectCls = `${inputCls} appearance-none`;

// ── tiny primitives ──────────────────────────────────────────────────────────

export const GoldBadge: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-[#6f572c] bg-[#4b3a1d]/60 text-[#c4a04a] ${className}`}
  >
    {children}
  </span>
);

export const StatusBadge: React.FC<{ status: Item['status'] }> = ({ status }) => {
  const map: Record<Item['status'], string> = {
    Obtainable: 'border-emerald-700/60 bg-emerald-900/30 text-emerald-400',
    Limited: 'border-amber-700/60 bg-amber-900/30 text-amber-400',
    Unobtainable: 'border-red-800/60 bg-red-900/30 text-red-400',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${map[status]}`}
    >
      {status}
    </span>
  );
};

export const RateIcon: React.FC<{ rate: string }> = ({ rate }) => {
  if (rate === 'Rising') return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
  if (rate === 'Falling') return <TrendingDown className="w-3.5 h-3.5 text-red-400" />;
  return <Minus className="w-3.5 h-3.5 text-white/30" />;
};

export const ItemIcon = memo(
  ({ emoji, name, size = 'md' }: { emoji: string; name: string; size?: 'sm' | 'md' }) => {
    const dim = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';
    if (!emoji || typeof emoji !== 'string') return <span className="text-xl">⚔️</span>;
    if (emoji.startsWith('/') || emoji.startsWith('./') || emoji.startsWith('http')) {
      return (
        <div className={`${dim} flex items-center justify-center flex-shrink-0`}>
          <img
            src={getItemImageUrl(emoji)}
            alt={name}
            className={`${dim} object-contain pixelated`}
            loading="lazy"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.style.display = 'none';
              const s = t.nextElementSibling as HTMLElement;
              if (s) s.style.display = 'inline';
            }}
          />
          <span className="text-xl hidden">⚔️</span>
        </div>
      );
    }
    return <span className="text-xl leading-none">{emoji}</span>;
  },
);

export const Field: React.FC<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
  span?: boolean;
}> = ({ label, required, children, span }) => (
  <div className={span ? 'sm:col-span-2' : ''}>
    <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
      {label}
      {required && <span className="text-[#c4a04a] ml-0.5">*</span>}
    </label>
    {children}
  </div>
);
