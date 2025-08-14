import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Item } from '../types/Item';

interface ItemFlipCardProps {
  item: Item;
}

export const ItemFlipCard: React.FC<ItemFlipCardProps> = ({ item }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const getDemandColor = (demand: number) => {
    if (demand <= 3) return 'text-red-400';
    if (demand <= 6) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRateIcon = (rate: string) => {
    switch (rate) {
      case 'Rising':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'Falling':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Unobtainable':
        return 'bg-red-900 text-red-200 border-red-700';
      case 'Limited':
        return 'bg-yellow-900 text-yellow-200 border-yellow-700';
      default:
        return 'bg-green-900 text-green-200 border-green-700';
    }
  };

  const getTaxDisplay = (item: Item) => {
    if (item.gemTax && item.gemTax > 0) {
      return { emoji: '💎', value: item.gemTax, type: 'gem' };
    } else if (item.goldTax && item.goldTax > 0) {
      return { emoji: '🪙', value: item.goldTax, type: 'gold' };
    }
    return { emoji: '💎', value: 0, type: 'none' };
  };

  const renderItemIcon = (emoji: string, size: 'small' | 'large' = 'large') => {
    const sizeClass = size === 'large' ? 'text-4xl sm:text-5xl' : 'text-2xl';
    const containerSize = size === 'large' ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-8 h-8';

    if (!emoji || typeof emoji !== 'string') {
      return <span className={sizeClass}>👹</span>;
    }

    if (emoji.startsWith('/')) {
      return (
        <div className={`${containerSize} flex items-center justify-center`}>
          <img
            src={emoji.startsWith('./') ? emoji.slice(2) : emoji.slice(1)}
            alt={item.name}
            className={`${containerSize} object-contain pixelated max-h-20`}
            style={{ imageRendering: 'pixelated' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <span className={`${sizeClass} hidden`}>👹</span>
        </div>
      );
    }
    return <span className={sizeClass}>{emoji}</span>;
  };

  const taxInfo = getTaxDisplay(item);

  return (
    <div className="flip-card h-96" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* Front of Card */}
        <div className="flip-card-front bg-gray-900 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full">
          <div className="p-6 flex flex-col h-full">
            {/* Item Icon */}
            <div className="text-center mb-4 flex-shrink-0">
              <div className="flex justify-center mb-3">
                {renderItemIcon(item.emoji)}
              </div>
            </div>

            {/* Item Name */}
            <div className="text-center mb-4 flex-shrink-0">
              <h3 className="text-lg font-bold text-white line-clamp-2 min-h-[3rem] flex items-center justify-center px-2">
                {item.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{item.category}</p>
            </div>

            {/* Value - Most Prominent */}
            <div className="text-center mb-4 flex-shrink-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 shadow-lg">
                <p className="text-2xl font-bold text-white">🔑 {item.value}</p>
                <p className="text-sm text-blue-100">Value</p>
              </div>
            </div>

            {/* Demand and Rate */}
            <div className="grid grid-cols-2 gap-2 mb-4 flex-shrink-0">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <p className={`text-lg font-bold ${getDemandColor(item.demand)}`}>
                  {item.demand}/10
                </p>
                <p className="text-xs text-gray-400">Demand</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center space-x-1 mb-1 min-h-[20px]">
                  {getRateIcon(item.rateOfChange)}
                  <span className="text-white text-xs font-medium truncate">{item.rateOfChange}</span>
                </div>
                <p className="text-xs text-gray-400">Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div className="flip-card-back bg-gray-800 rounded-xl border border-gray-600 cursor-pointer overflow-hidden flex flex-col h-full">
          <div className="p-4 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4 flex-shrink-0">
              <div className="flex-shrink-0">
                {renderItemIcon(item.emoji, 'small')}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-bold text-base truncate">🔹 {item.name}</h3>
                <p className="text-gray-400 text-sm truncate">{item.category}</p>
              </div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4 flex-shrink-0">
              <div className="bg-blue-900 bg-opacity-40 rounded-lg p-2 border border-blue-700">
                <div className="text-xs text-blue-300 mb-1">💰 Value</div>
                <div className="text-blue-400 font-bold text-sm">🔑 {item.value}</div>
              </div>

              <div className="bg-gray-700 rounded-lg p-2 border border-gray-600">
                <div className="text-xs text-gray-300 mb-1">🔸 Demand</div>
                <div className={`font-bold text-sm ${getDemandColor(item.demand)}`}>{item.demand}/10</div>
              </div>

              <div className="bg-gray-700 rounded-lg p-2 border border-gray-600">
                <div className="text-xs text-gray-300 mb-1">📈 Rate</div>
                <div className="flex items-center space-x-1">
                  {getRateIcon(item.rateOfChange)}
                  <span className="text-white font-bold text-xs truncate">{item.rateOfChange}</span>
                </div>
              </div>

              <div className="bg-purple-900 bg-opacity-40 rounded-lg p-2 border border-purple-700">
                <div className="text-xs text-purple-300 mb-1">🏅 Prestige</div>
                <div className="text-purple-400 font-bold text-sm">{item.prestige}</div>
              </div>
            </div>

            {/* Status */}
            <div className="text-center mb-3 flex-shrink-0">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                📋 {item.status}
              </span>
            </div>

            {/* Additional Info */}
            <div className="space-y-2 flex-shrink-0 mb-3">
              <div className="bg-orange-900 bg-opacity-30 rounded-lg p-2 border border-orange-700">
                <div className="flex items-center justify-between">
                  <span className="text-orange-300 text-xs font-medium">💸 Tax</span>
                  <span className={`font-bold text-xs ${taxInfo.type === 'gem' ? 'text-purple-400' : taxInfo.type === 'gold' ? 'text-yellow-400' : 'text-gray-400'}`}>
                    {taxInfo.value > 0 ? `${taxInfo.emoji} ${taxInfo.value.toLocaleString()}` : 'None'}
                  </span>
                </div>
              </div>
          

            {/* How to Obtain */}
            <div className="flex-1 min-h-0 mb-3">
              <div className="bg-gray-700 rounded-lg p-2 border border-gray-600 h-full">
                <div className="text-xs text-gray-300 font-medium mb-1">📦 How to Obtain</div>
                <div className="text-white text-xs leading-relaxed overflow-y-auto h-full max-h-16">
                  {item.obtainedFrom}
                </div>
              </div>
            </div>

      <style jsx>{`
        .flip-card {
          background-color: transparent;
          perspective: 1000px;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }

        .flip-card-inner.flipped {
          transform: rotateY(180deg);
        }

        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};
