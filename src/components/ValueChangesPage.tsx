import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar, Filter, Search, Grid3X3, List } from 'lucide-react';
import { useValueChanges } from '../hooks/useValueChanges';
import { ItemGridCard } from './ItemGridCard';

export const ValueChangesPage: React.FC = () => {
  const { valueChanges, loading, error } = useValueChanges();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChangeType, setSelectedChangeType] = useState<string>('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(() => {
    // Default to grid for desktop, list for mobile
    return window.innerWidth >= 1024 ? 'grid' : 'list';
  });

  const renderItemIcon = (emoji: string, itemName: string) => {
    if (!emoji || typeof emoji !== 'string') {
      return <span className="text-2xl">👹</span>;
    }
    
    if (emoji.startsWith('/') || emoji.startsWith('./')) {
      return (
        <div className="w-8 h-8 flex items-center justify-center">
          <img 
            src={emoji.startsWith('./') ? emoji.slice(2) : emoji.slice(1)} 
            alt={itemName}
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

  const getTimeframeDate = (timeframe: string) => {
    const now = new Date();
    switch (timeframe) {
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return null;
    }
  };

  const getChangeDescription = (change: any) => {
    const changes = [];
    
    // Check value change
    if (change.oldValue !== change.newValue) {
      if (change.newValue > change.oldValue) {
        changes.push(`📈 Value increased from 🔑${change.oldValue} to 🔑${change.newValue}`);
      } else {
        changes.push(`📉 Value decreased from 🔑${change.oldValue} to 🔑${change.newValue}`);
      }
    }
    
    // Check demand change
    if (change.oldDemand !== change.newDemand) {
      if (change.newDemand > change.oldDemand) {
        changes.push(`📊 Demand increased from ${change.oldDemand}/10 to ${change.newDemand}/10`);
      } else {
        changes.push(`📊 Demand decreased from ${change.oldDemand}/10 to ${change.newDemand}/10`);
      }
    }
    
    // Check rate change
    if (change.oldRateOfChange !== change.newRateOfChange) {
      changes.push(`📈 Rate changed from ${change.oldRateOfChange} to ${change.newRateOfChange}`);
    }
    
    return changes.length > 0 ? changes : ['➡️ Item properties updated'];
  };

  const filteredChanges = useMemo(() => {
    let filtered = valueChanges.filter(change => {
      const matchesSearch = change.itemName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesChangeType = !selectedChangeType || change.changeType === selectedChangeType;
      
      let matchesTimeframe = true;
      if (selectedTimeframe !== 'all') {
        const timeframeDate = getTimeframeDate(selectedTimeframe);
        if (timeframeDate) {
          matchesTimeframe = new Date(change.changeDate) >= timeframeDate;
        }
      }
      
      return matchesSearch && matchesChangeType && matchesTimeframe;
    });

    return filtered;
  }, [valueChanges, searchTerm, selectedChangeType, selectedTimeframe]);

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const changeDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - changeDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return changeDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading value changes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">Error Loading Changes</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-slide-in">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          📊 Value Changes History
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Track real-time item value fluctuations and market trends
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Change Type Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedChangeType}
              onChange={(e) => setSelectedChangeType(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="">All Changes</option>
              <option value="increase">📈 Increases</option>
              <option value="decrease">📉 Decreases</option>
              <option value="stable">➡️ Updates</option>
            </select>
          </div>

          {/* Timeframe Filter */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="all">All Time</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-900 to-green-800 rounded-lg p-6 border border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm font-medium">Value Increases</p>
              <p className="text-2xl font-bold text-white">
                {filteredChanges.filter(c => c.changeType === 'increase').length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-900 to-red-800 rounded-lg p-6 border border-red-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-300 text-sm font-medium">Value Decreases</p>
              <p className="text-2xl font-bold text-white">
                {filteredChanges.filter(c => c.changeType === 'decrease').length}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-6 border border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm font-medium">Total Changes</p>
              <p className="text-2xl font-bold text-white">{filteredChanges.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Changes List */}
      {filteredChanges.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📈</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No changes found</h3>
          <p className="text-gray-500">
            {searchTerm || selectedChangeType || selectedTimeframe !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Value changes will appear here when items are updated'}
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredChanges.map((change) => {
                // Create a mock item object for ItemGridCard with updated values
                const mockItem = {
                  id: change.itemId,
                  name: change.itemName,
                  value: change.newValue,
                  demand: change.newDemand,
                  rateOfChange: change.newRateOfChange as 'Rising' | 'Falling' | 'Stable' | 'Overpriced',
                  prestige: 1,
                  status: 'Obtainable' as const,
                  obtainedFrom: 'Check main item list for details',
                  category: 'Item',
                  rarity: null,
                  emoji: change.emoji,
                  gemTax: null,
                  goldTax: null
                };

                return (
                  <div key={change.id} className="relative">
                    <ItemGridCard item={mockItem} />
                    {/* Value change overlay - more prominent */}
                    <div className="absolute top-2 right-2 bg-black bg-opacity-90 rounded-lg px-2 py-1 border border-gray-600">
                      <div className="flex flex-col items-center text-xs">
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-400">🔑{change.oldValue}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-blue-400 font-bold">🔑{change.newValue}</span>
                        </div>
                        {change.oldValue !== change.newValue && (
                          <span className={`text-xs font-bold ${
                            change.newValue > change.oldValue ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {change.newValue > change.oldValue ? '+' : ''}{change.newValue - change.oldValue}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Time indicator */}
                    <div className="absolute top-2 left-2 bg-black bg-opacity-75 rounded-lg px-2 py-1">
                      <span className="text-xs text-gray-300">
                        {getRelativeTime(change.changeDate)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredChanges.map((change) => {
                return (
                  <div key={change.id} className="bg-gray-900 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      {/* Item info */}
                      <div className="flex items-center space-x-3">
                        {renderItemIcon(change.emoji, change.itemName)}
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {change.itemName}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {getRelativeTime(change.changeDate)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Value Change */}
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-center">
                            <p className="text-xs text-gray-400 mb-1">Old Value</p>
                            <p className="text-gray-400 font-medium">🔑 {change.oldValue}</p>
                          </div>
                          <span className="text-gray-400 text-xl">→</span>
                          <div className="text-center">
                            <p className="text-xs text-gray-400 mb-1">New Value</p>
                            <p className="text-blue-400 font-bold text-lg">🔑 {change.newValue}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Market Insights */}
      {filteredChanges.length > 0 && (
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6 border border-purple-700">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="mr-2">💡</span>
            Market Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-black bg-opacity-30 rounded-lg p-4">
              <p className="text-purple-300 font-medium mb-2">📈 Most Active Items</p>
              <p className="text-gray-300">
                Items with frequent value changes indicate high market volatility and trading activity.
              </p>
            </div>
            <div className="bg-black bg-opacity-30 rounded-lg p-4">
              <p className="text-blue-300 font-medium mb-2">⏰ Trading Tips</p>
              <p className="text-gray-300">
                Monitor rate changes closely - "Rising" items may continue to increase in value.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};