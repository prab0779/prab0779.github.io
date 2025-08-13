import React from 'react';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Item } from '../types/Item';

interface ItemCardProps {
  item: Item;
  isExpanded: boolean;
  onToggle: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, isExpanded, onToggle }) => {
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
        return 'bg-red-900 text-red-200';
      case 'Limited':
        return 'bg-yellow-900 text-yellow-200';
      default:
        return 'bg-green-900 text-green-200';
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

  const renderItemIcon = (emoji: string) => {
    // Add null/undefined check before calling startsWith
    if (!emoji || typeof emoji !== 'string') {
      return <span className="text-2xl">👹</span>;
    }
    
    if (emoji.startsWith('/')) {
      return (
        <div className="w-8 h-8 flex items-center justify-center">
          <img 
            src={emoji} 
            alt={item.name}
            className="w-8 h-8 object-contain pixelated"
            style={{ imageRendering: 'pixelated' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <span className="text-2xl hidden">👹</span>
        </div>
      );
    }
    return <span className="text-2xl">{emoji}</span>;
  };

  const taxInfo = getTaxDisplay(item);

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 text-left hover:bg-gray-800 transition-colors duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {renderItemIcon(item.emoji)}
            <div>
              <h3 className="text-lg font-semibold text-white">{item.name}</h3>
              <p className="text-sm text-gray-400">{item.category}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xl font-bold text-blue-400">🔑 {item.value}</p>
              <p className="text-sm text-gray-400">Value</p>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-700 bg-gray-800 animate-fade-in">
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">📜 Item Details</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">🔹 Name:</span>
                <span className="text-white font-medium">{item.name}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">💰 Value:</span>
                <span className="text-blue-400 font-medium">🔑 {item.value}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">🔸 Demand:</span>
                <span className={`font-medium ${getDemandColor(item.demand)}`}>
                  {item.demand}/10
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">📈 Rate of Change:</span>
                <div className="flex items-center space-x-1">
                  {getRateIcon(item.rateOfChange)}
                  <span className="text-white">{item.rateOfChange}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">🏅 Prestige:</span>
                <span className="text-purple-400 font-medium">{item.prestige}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">📋 Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">💸 Tax:</span>
                <span className={`font-medium ${taxInfo.type === 'gem' ? 'text-purple-400' : 'text-yellow-400'}`}>
                  {taxInfo.value > 0 ? `${taxInfo.emoji} ${taxInfo.value.toLocaleString()}` : 'No tax'}
                </span>
              </div>
              
              {item.rarity !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">🧪 Rarity:</span>
                  <span className="text-yellow-400 font-medium">{item.rarity}%</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            <p className="text-gray-400 text-sm">📦 Obtained from:</p>
            <p className="text-white text-sm mt-1">{item.obtainedFrom}</p>
          </div>
          
          <div className="mt-3 p-3 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-700">
            <p className="text-blue-300 text-sm">
              💡 <strong>Tip:</strong> ⚠️ Values change fast — trade smart 💬 Ask in Discord 🔒 Avoid sketchy links 🪙 Overpay wisely
            </p>
          </div>
        </div>
      )}
    </div>
  );
};