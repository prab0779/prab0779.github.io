import React, { useState, useMemo } from 'react';
import { Plus, X, Calculator, ArrowLeftRight } from 'lucide-react';
import { Item, TradeItem, TradeCalculation } from '../types/Item';

interface TradeCalculatorProps {
  items: Item[];
}

export const TradeCalculator: React.FC<TradeCalculatorProps> = ({ items }) => {
  const [itemsSent, setItemsSent] = useState<TradeItem[]>([]);
  const [itemsReceived, setItemsReceived] = useState<TradeItem[]>([]);
  const [showSentModal, setShowSentModal] = useState(false);
  const [showReceivedModal, setShowReceivedModal] = useState(false);

  const addItem = (item: Item, type: 'sent' | 'received') => {
    const tradeItem: TradeItem = { item, quantity: 1 };
    
    if (type === 'sent') {
      setItemsSent(prev => [...prev, tradeItem]);
      setShowSentModal(false);
    } else {
      setItemsReceived(prev => [...prev, tradeItem]);
      setShowReceivedModal(false);
    }
  };

  const removeItem = (index: number, type: 'sent' | 'received') => {
    if (type === 'sent') {
      setItemsSent(prev => prev.filter((_, i) => i !== index));
    } else {
      setItemsReceived(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateQuantity = (index: number, quantity: number, type: 'sent' | 'received') => {
    if (type === 'sent') {
      setItemsSent(prev => prev.map((item, i) => 
        i === index ? { ...item, quantity: Math.max(1, quantity) } : item
      ));
    } else {
      setItemsReceived(prev => prev.map((item, i) => 
        i === index ? { ...item, quantity: Math.max(1, quantity) } : item
      ));
    }
  };

  const calculation: TradeCalculation = useMemo(() => {
    const totalValueSent = itemsSent.reduce((total, { item, quantity }) => 
      total + (item.value * quantity), 0
    );
    
    const totalValueReceived = itemsReceived.reduce((total, { item, quantity }) => 
      total + (item.value * quantity), 0
    );
    
    // Calculate tax difference - whoever has higher total tax pays the difference
    const totalTaxSent = itemsSent.reduce((total, { item, quantity }) => 
      total + (item.taxGem * quantity), 0
    );
    
    const totalTaxReceived = itemsReceived.reduce((total, { item, quantity }) => 
      total + (item.taxGem * quantity), 0
    );

    const taxDifference = Math.abs(totalTaxSent - totalTaxReceived);
    const whoPaysTax = totalTaxSent > totalTaxReceived ? 'You pay' : 'They pay';

    return {
      itemsSent,
      itemsReceived,
      totalValueSent,
      totalValueReceived,
      totalTaxGems: taxDifference,
      totalTaxGold: 0,
      netGainLoss: totalValueReceived - totalValueSent,
      whoPaysTax
    };
  }, [itemsSent, itemsReceived]);

  const renderItemIcon = (emoji: string, itemName: string, size: 'small' | 'medium' | 'large' | 'xlarge' = 'medium') => {
    const sizeClasses = {
      small: 'w-6 h-6 text-xl',
      medium: 'w-8 h-8 text-2xl', 
      large: 'w-16 h-16 text-6xl',
      xlarge: 'w-full h-full text-8xl'
    };
    
    if (emoji.startsWith('/')) {
      return (
        <div className={`flex items-center justify-center ${size === 'xlarge' ? 'w-full h-full' : sizeClasses[size].split(' ').slice(0, 2).join(' ')}`}>
          <img 
            src={emoji} 
            alt={itemName}
            className={`object-contain pixelated ${size === 'xlarge' ? 'w-full h-full max-w-none max-h-none' : sizeClasses[size].split(' ').slice(0, 2).join(' ')}`}
            style={{ imageRendering: 'pixelated' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <span className={`hidden ${size === 'xlarge' ? 'text-8xl' : sizeClasses[size].split(' ')[2]}`}>👹</span>
        </div>
      );
    }
    return <span className={size === 'xlarge' ? 'text-8xl' : sizeClasses[size].split(' ')[2]}>{emoji}</span>;
  };

  const ItemModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onSelect: (item: Item) => void; 
    title: string 
  }> = ({ isOpen, onClose, onSelect, title }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    if (!isOpen) return null;

    const filteredItems = items
      .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => b.value - a.value);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 max-h-96 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search */}
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-4 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredItems.map(item => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center space-x-3"
              >
                {renderItemIcon(item.emoji, item.name, 'medium')}
                <div className="flex-1">
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-sm text-gray-400">{item.category}</p>
                </div>
                <span className="text-blue-400 font-medium">🔑 {item.value}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ItemGrid: React.FC<{ type: 'sent' | 'received' }> = ({ type }) => {
    const selectedItems = type === 'sent' ? itemsSent : itemsReceived;
    const title = type === 'sent' ? 'Items You\'re Sending' : 'Items You\'re Receiving';
    const color = type === 'sent' ? 'red' : 'green';
    const icon = type === 'sent' ? '📤' : '📥';

    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className={`${color === 'red' ? 'text-red-400' : 'text-green-400'} mr-2`}>{icon}</span>
          {title}
        </h2>
        
        {/* Item Grid - 3x3 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Plus button in top-left */}
          <div
            className="aspect-square border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-900 hover:bg-opacity-20 transition-all duration-200 group"
            onClick={() => {
              if (type === 'sent') {
                setShowSentModal(true);
              } else {
                setShowReceivedModal(true);
              }
            }}
          >
            <Plus className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
          </div>

          {/* Item slots - 8 remaining slots */}
          {Array.from({ length: 8 }, (_, index) => {
            const tradeItem = selectedItems[index];
            
            return (
              <div
                key={index}
                className={`aspect-square border-2 border-dashed rounded-lg flex flex-col transition-all duration-200 ${
                  tradeItem 
                    ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' 
                    : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                } group relative`}
              >
                {tradeItem ? (
                  <div className="w-full h-full p-2 flex flex-col">
                    <button
                      onClick={() => removeItem(index, type)}
                      className="absolute top-1 right-1 text-red-400 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100 z-10"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    
                    {/* Icon container - takes most of the space */}
                    <div className="flex-1 flex items-center justify-center min-h-0 mb-2">
                      {renderItemIcon(tradeItem.item.emoji, tradeItem.item.name, 'xlarge')}
                    </div>
                    
                    {/* Name - small text at bottom */}
                    <div className="text-xs text-gray-300 text-center leading-tight mb-1 px-1 h-8 flex items-center justify-center">
                      <span className="break-words line-clamp-2" style={{ wordBreak: 'break-word' }}>
                        {tradeItem.item.name}
                      </span>
                    </div>
                    
                    {/* Quantity input */}
                    <input
                      type="number"
                      min="1"
                      value={tradeItem.quantity}
                      onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1, type)}
                      className="w-full h-6 text-xs bg-gray-700 border border-gray-600 rounded text-white text-center flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xl">
                    {/* Empty slot */}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-slide-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">🧮 Trade Calculator</h1>
        <p className="text-gray-400">Calculate the value and tax of your trades</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ItemGrid type="sent" />
        <ItemGrid type="received" />
      </div>

      {/* Modals */}
      <ItemModal
        isOpen={showSentModal}
        onClose={() => setShowSentModal(false)}
        onSelect={(item) => addItem(item, 'sent')}
        title="Select Item to Send"
      />

      <ItemModal
        isOpen={showReceivedModal}
        onClose={() => setShowReceivedModal(false)}
        onSelect={(item) => addItem(item, 'received')}
        title="Select Item to Receive"
      />

      {/* Calculation Results */}
      {(itemsSent.length > 0 || itemsReceived.length > 0) && (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-700 animate-fade-in">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <Calculator className="w-6 h-6 mr-2 text-blue-400" />
            Trade Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-red-900 bg-opacity-30 rounded-lg p-4 border border-red-700 transform hover:scale-105 transition-transform duration-200">
                <p className="text-red-300 text-sm mb-1">Total Value Sent</p>
                <p className="text-2xl font-bold text-red-400">🔑 {calculation.totalValueSent}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <ArrowLeftRight className="w-16 h-16 text-gray-400 animate-pulse" />
            </div>
            
            <div className="text-center">
              <div className="bg-green-900 bg-opacity-30 rounded-lg p-4 border border-green-700 transform hover:scale-105 transition-transform duration-200">
                <p className="text-green-300 text-sm mb-1">Total Value Received</p>
                <p className="text-2xl font-bold text-green-400">🔑 {calculation.totalValueReceived}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors duration-200">
              <p className="text-gray-400 text-sm mb-1">Tax Difference</p>
              <p className="text-xl font-semibold text-purple-400">🔑 {calculation.totalTaxGems}</p>
              <p className="text-xs text-gray-500 mt-1">{calculation.whoPaysTax}</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors duration-200">
              <p className="text-gray-400 text-sm mb-1">Net Gain/Loss</p>
              <p className={`text-xl font-semibold ${
                calculation.netGainLoss > 0 ? 'text-green-400' : 
                calculation.netGainLoss < 0 ? 'text-red-400' : 'text-gray-400'
              }`}>
                {calculation.netGainLoss > 0 ? '+' : ''}🔑 {calculation.netGainLoss}
              </p>
            </div>
          </div>
          
          {calculation.netGainLoss !== 0 && (
            <div className={`mt-4 p-4 rounded-lg animate-bounce-subtle ${
              calculation.netGainLoss > 0 
                ? 'bg-green-900 bg-opacity-30 border border-green-700' 
                : 'bg-red-900 bg-opacity-30 border border-red-700'
            }`}>
              <p className={`text-sm ${
                calculation.netGainLoss > 0 ? 'text-green-300' : 'text-red-300'
              }`}>
                {calculation.netGainLoss > 0 
                  ? '📈 This trade is profitable for you!' 
                  : '📉 You would lose value in this trade.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};