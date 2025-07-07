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
    
    // Calculate total gem and gold taxes for items being sent
    const sentGemTax = itemsSent.reduce((total, { item, quantity }) => 
      total + ((item.gemTax || 0) * quantity), 0
    );
    
    const sentGoldTax = itemsSent.reduce((total, { item, quantity }) => 
      total + ((item.goldTax || 0) * quantity), 0
    );
    
    // Calculate total gem and gold taxes for items being received
    const receivedGemTax = itemsReceived.reduce((total, { item, quantity }) => 
      total + ((item.gemTax || 0) * quantity), 0
    );
    
    const receivedGoldTax = itemsReceived.reduce((total, { item, quantity }) => 
      total + ((item.goldTax || 0) * quantity), 0
    );

    // Calculate the NET tax you need to pay (can be negative)
    // If you're receiving 30k gem tax items and sending 20k gem tax items, you pay 10k
    // If you're receiving 20k gem tax items and sending 30k gem tax items, you get -10k (they owe you)
    const totalGemTax = receivedGemTax - sentGemTax;
    const totalGoldTax = receivedGoldTax - sentGoldTax;

    return {
      itemsSent,
      itemsReceived,
      totalValueSent,
      totalValueReceived,
      totalGemTax,
      totalGoldTax,
      netGainLoss: totalValueReceived - totalValueSent,
      sentGemTax,
      sentGoldTax,
      receivedGemTax,
      receivedGoldTax
    };
  }, [itemsSent, itemsReceived]);

  const renderItemIcon = (emoji: string, itemName: string, size: 'small' | 'medium' | 'large' | 'slot' = 'medium') => {
    const sizeClasses = {
      small: 'w-6 h-6 text-xl',
      medium: 'w-8 h-8 text-2xl', 
      large: 'w-16 h-16 text-6xl',
      slot: 'w-full h-full'
    };
    
    // Add null/undefined check before calling startsWith
    if (!emoji || typeof emoji !== 'string') {
      return (
        <span className={
          size === 'slot' 
            ? 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-none' 
            : sizeClasses[size].split(' ')[2]
        }>
          👹
        </span>
      );
    }
    
    if (emoji.startsWith('/')) {
      return (
        <div className={`flex items-center justify-center ${sizeClasses[size]}`}>
          <img 
            src={emoji} 
            alt={itemName}
            className={`object-contain pixelated ${
              size === 'slot' 
                ? 'w-full h-full max-w-none max-h-none min-w-0 min-h-0' 
                : sizeClasses[size].split(' ').slice(0, 2).join(' ')
            }`}
            style={{ imageRendering: 'pixelated' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <span className={`hidden ${
            size === 'slot' 
              ? 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl' 
              : sizeClasses[size].split(' ')[2]
          }`}>👹</span>
        </div>
      );
    }
    return (
      <span className={
        size === 'slot' 
          ? 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-none' 
          : sizeClasses[size].split(' ')[2]
      }>
        {emoji}
      </span>
    );
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
      <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-700">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center">
          <span className={`${color === 'red' ? 'text-red-400' : 'text-green-400'} mr-2`}>{icon}</span>
          {title}
        </h2>
        
        {/* Item Grid - 3x3 */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
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
            <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
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
                  <div className="w-full h-full p-1 sm:p-2 flex flex-col">
                    <button
                      onClick={() => removeItem(index, type)}
                      className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 text-red-400 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100 z-10"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    
                    {/* Icon container - takes most of the space */}
                    <div className="flex-1 flex items-center justify-center min-h-0 mb-1 sm:mb-2 p-1">
                      {renderItemIcon(tradeItem.item.emoji, tradeItem.item.name, 'slot')}
                    </div>
                    
                    {/* Name - small text at bottom */}
                    <div className="text-xs text-gray-300 text-center leading-tight mb-1 px-0.5 sm:px-1 h-6 sm:h-8 flex items-center justify-center">
                      <span className="break-words line-clamp-2 text-xs sm:text-xs" style={{ wordBreak: 'break-word' }}>
                        {tradeItem.item.name}
                      </span>
                    </div>
                    
                    {/* Quantity input with better styling and controls */}
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(index, tradeItem.quantity - 1, type);
                        }}
                        className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-xs rounded flex items-center justify-center transition-colors"
                        disabled={tradeItem.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="999"
                        value={tradeItem.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          updateQuantity(index, Math.min(999, Math.max(1, value)), type);
                        }}
                        className="w-8 sm:w-10 h-5 sm:h-6 text-xs bg-gray-700 border border-gray-600 rounded text-white text-center flex-shrink-0 focus:outline-none focus:ring-1 focus:ring-blue-500 no-arrows"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(index, tradeItem.quantity + 1, type);
                        }}
                        className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-xs rounded flex items-center justify-center transition-colors"
                        disabled={tradeItem.quantity >= 999}
                      >
                        +
                      </button>
                    </div>
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
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-slide-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">🧮 Trade Calculator</h1>
        <p className="text-gray-400">Calculate the value and tax of your trades</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
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
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700 animate-fade-in">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-400" />
            Trade Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="bg-red-900 bg-opacity-30 rounded-lg p-3 sm:p-4 border border-red-700 transform hover:scale-105 transition-transform duration-200">
                <p className="text-red-300 text-sm mb-1">Total Value Sent</p>
                <p className="text-xl sm:text-2xl font-bold text-red-400">🔑 {calculation.totalValueSent}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <ArrowLeftRight className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 animate-pulse" />
            </div>
            
            <div className="text-center">
              <div className="bg-green-900 bg-opacity-30 rounded-lg p-3 sm:p-4 border border-green-700 transform hover:scale-105 transition-transform duration-200">
                <p className="text-green-300 text-sm mb-1">Total Value Received</p>
                <p className="text-xl sm:text-2xl font-bold text-green-400">🔑 {calculation.totalValueReceived}</p>
              </div>
            </div>
          </div>
          
          {/* Tax You Will Pay - FIXED LOGIC */}
          <div className="mt-6">
            <div className="bg-orange-900 bg-opacity-20 rounded-lg p-4 border border-orange-700">
              <h3 className="text-orange-300 font-semibold mb-4 flex items-center">
                <span className="mr-2">💸</span>
                Tax You Will Pay (net difference)
              </h3>
              
              {/* Main Tax Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-purple-900 bg-opacity-30 rounded-lg p-3 border border-purple-700">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300 font-medium">💎 Gem Tax:</span>
                    <span className={`font-bold text-lg ${
                      calculation.totalGemTax >= 0 ? 'text-purple-400' : 'text-green-400'
                    }`}>
                      {calculation.totalGemTax >= 0 
                        ? calculation.totalGemTax.toLocaleString()
                        : `+${Math.abs(calculation.totalGemTax).toLocaleString()}`
                      }
                    </span>
                  </div>
                  {calculation.totalGemTax < 0 && (
                    <p className="text-xs text-green-300 mt-1">They owe you gems!</p>
                  )}
                </div>
                
                <div className="bg-yellow-900 bg-opacity-30 rounded-lg p-3 border border-yellow-700">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-300 font-medium">🪙 Gold Tax:</span>
                    <span className={`font-bold text-lg ${
                      calculation.totalGoldTax >= 0 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {calculation.totalGoldTax >= 0 
                        ? calculation.totalGoldTax.toLocaleString()
                        : `+${Math.abs(calculation.totalGoldTax).toLocaleString()}`
                      }
                    </span>
                  </div>
                  {calculation.totalGoldTax < 0 && (
                    <p className="text-xs text-green-300 mt-1">They owe you gold!</p>
                  )}
                </div>
              </div>
              
              {/* No Tax Message */}
              {calculation.totalGemTax === 0 && calculation.totalGoldTax === 0 && (
                <div className="text-center py-3 mt-4">
                  <p className="text-green-400 font-medium">🎉 No net tax for this trade!</p>
                </div>
              )}
            </div>
          </div>

          {/* Net Gain/Loss */}
          <div className="mt-6">
            <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors duration-200">
              <p className="text-gray-400 text-sm mb-1">Net Gain/Loss (Value Only)</p>
              <p className={`text-2xl font-bold ${
                calculation.netGainLoss > 0 ? 'text-green-400' : 
                calculation.netGainLoss < 0 ? 'text-red-400' : 'text-gray-400'
              }`}>
                {calculation.netGainLoss > 0 ? '+' : ''}🔑 {calculation.netGainLoss}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                (This doesn't include tax costs - factor in the tax above for total cost)
              </p>
            </div>
          </div>
          
          {calculation.netGainLoss !== 0 && (
            <div className={`mt-4 p-3 sm:p-4 rounded-lg animate-bounce-subtle ${
              calculation.netGainLoss > 0 
                ? 'bg-green-900 bg-opacity-30 border border-green-700' 
                : 'bg-red-900 bg-opacity-30 border border-red-700'
            }`}>
              <p className={`text-sm ${
                calculation.netGainLoss > 0 ? 'text-green-300' : 'text-red-300'
              }`}>
                {calculation.netGainLoss > 0 
                  ? '📈 This trade is profitable for you (excluding tax)!' 
                  : '📉 You would lose value in this trade (excluding tax).'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};