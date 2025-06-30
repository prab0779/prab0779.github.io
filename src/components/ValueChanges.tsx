import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar, Filter, Search } from 'lucide-react';
import { ValueChange } from '../types/Item';

interface ValueChangesProps {
  valueChanges: ValueChange[];
}

export const ValueChanges: React.FC<ValueChangesProps> = ({ valueChanges }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'increase' | 'decrease' | 'stable'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'percentage' | 'value'>('date');

  const filteredChanges = useMemo(() => {
    let filtered = valueChanges.filter(change => {
      const matchesSearch = change.itemName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || change.changeType === filterType;
      return matchesSearch && matchesFilter;
    });

    // Sort changes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.changeDate).getTime() - new Date(a.changeDate).getTime();
        case 'percentage':
          return Math.abs(b.percentageChange) - Math.abs(a.percentageChange);
        case 'value':
          return b.newValue - a.newValue;
        default:
          return 0;
      }
    });

    return filtered;
  }, [valueChanges, searchTerm, filterType, sortBy]);

  const renderItemIcon = (emoji: string, itemName: string) => {
    if (emoji.startsWith('/')) {
      return (
        <div className="w-8 h-8 flex items-center justify-center">
          <img 
            src={emoji} 
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

  const getChangeIcon = (changeType: string, percentageChange: number) => {
    if (changeType === 'increase') {
      return <TrendingUp className="w-5 h-5 text-green-400" />;
    } else if (changeType === 'decrease') {
      return <TrendingDown className="w-5 h-5 text-red-400" />;
    }
    return <Minus className="w-5 h-5 text-gray-400" />;
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-400';
      case 'decrease':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          📈 Value Changes
        </h1>
        <p className="text-xl text-gray-400">
          Track item value fluctuations and market trends
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Type */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Changes</option>
              <option value="increase">Increases</option>
              <option value="decrease">Decreases</option>
              <option value="stable">No Change</option>
            </select>
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="percentage">Sort by % Change</option>
            <option value="value">Sort by Value</option>
          </select>
        </div>
      </div>

      {/* Changes List */}
      <div className="space-y-4">
        {filteredChanges.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No changes found</h3>
            <p className="text-gray-500">
              {valueChanges.length === 0 
                ? "No value changes have been recorded yet" 
                : "Try adjusting your search terms or filters"}
            </p>
          </div>
        ) : (
          filteredChanges.map(change => (
            <div key={change.id} className="bg-gray-900 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {renderItemIcon(change.emoji, change.itemName)}
                  <div>
                    <h3 className="text-lg font-semibold text-white">{change.itemName}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(change.changeDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  {/* Value Change */}
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Value</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-300">🔑 {change.oldValue}</span>
                      <span className="text-gray-500">→</span>
                      <span className="text-blue-400 font-semibold">🔑 {change.newValue}</span>
                    </div>
                  </div>

                  {/* Demand Change */}
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Demand</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-300">{change.oldDemand}/10</span>
                      <span className="text-gray-500">→</span>
                      <span className="text-yellow-400 font-semibold">{change.newDemand}/10</span>
                    </div>
                  </div>

                  {/* Percentage Change */}
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Change</p>
                    <div className="flex items-center space-x-2">
                      {getChangeIcon(change.changeType, change.percentageChange)}
                      <span className={`font-semibold ${getChangeColor(change.changeType)}`}>
                        {change.percentageChange > 0 ? '+' : ''}{change.percentageChange.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Rate of Change */}
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Rate</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-300">{change.oldRateOfChange}</span>
                      <span className="text-gray-500">→</span>
                      <span className="text-purple-400 font-semibold">{change.newRateOfChange}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};