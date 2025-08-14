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
            className={`${containerSize} object-contain pixelated`}
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
        <div className="flip-card-front bg-gray-900 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer">
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

            {/* Demand and Rate of Change */}
            <div className="grid grid-cols-2 gap-3 mb-4 flex-shrink-0">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <p className={`text-lg font-bold ${getDemandColor(item.demand)}`}>
                  {item.demand}/10
                </p>
                <p className="text-xs text-gray-400">Demand</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  {getRateIcon(item.rateOfChange)}
                  <span className="text-white text-xs font-medium">{item.rateOfChange}</span>
                </div>
                <p className="text-xs text-gray-400">Rate</p>
              </div>
            </div>

            {/* Click to flip indicator */}
            <div className="mt-auto text-center">
              <p className="text-xs text-gray-400">Click to flip for details</p>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div className="flip-card-back bg-gray-800 rounded-xl border border-gray-600 cursor-pointer">
          <div className="p-6 flex flex-col h-full">
            {/* Header */}
            <div className="text-center mb-4 flex-shrink-0">
              <div className="flex justify-center mb-2">
                {renderItemIcon(item.emoji, 'small')}
              </div>
              <h3 className="text-lg font-bold text-white">{item.name}</h3>
              <p className="text-sm text-gray-400">{item.category}</p>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-center">
                  <p className="text-blue-400 font-bold text-lg">🔑 {item.value}</p>
                  <p className="text-xs text-gray-400">Value</p>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-center">
                  <p className={`font-bold text-lg ${getDemandColor(item.demand)}`}>
                    {item.demand}/10
                  </p>
                  <p className="text-xs text-gray-400">Demand</p>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    {getRateIcon(item.rateOfChange)}
                  </div>
                  <p className="text-xs text-gray-400">Rate</p>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-center">
                  <p className="text-purple-400 font-bold text-lg">{item.prestige}</p>
                  <p className="text-xs text-gray-400">Prestige</p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">📋 Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">💸 Tax:</span>
                <span className={`font-medium text-sm ${taxInfo.type === 'gem' ? 'text-purple-400' : 'text-yellow-400'}`}>
                  {taxInfo.value > 0 ? `${taxInfo.emoji} ${taxInfo.value.toLocaleString()}` : 'None'}
                </span>
              </div>
              
              {item.rarity !== null && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">🧪 Rarity:</span>
                  <span className="text-yellow-400 font-medium text-sm">{item.rarity}%</span>
                </div>
              )}
            </div>

            {/* Obtained From */}
            <div className="bg-gray-700 rounded-lg p-3 mb-4 flex-grow">
              <p className="text-gray-400 text-xs font-medium mb-2">📦 How to Obtain:</p>
              <div className="max-h-16 overflow-y-auto">
                <p className="text-white text-xs leading-relaxed">{item.obtainedFrom}</p>
              </div>
            </div>

            {/* Click to flip back */}
            <div className="text-center flex-shrink-0">
              <p className="text-xs text-gray-400">Click to flip back</p>
            </div>
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