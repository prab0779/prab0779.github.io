import React from 'react';
import { ItemFlipGrid } from './ItemFlipGrid';
import { Item } from '../types/Item';

interface ValueListPageProps {
  items: Item[];
}

export const ValueListPage: React.FC<ValueListPageProps> = ({ items }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Complete Value List
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Browse our comprehensive Attack on Titan Revolution value list with {items.length}+ items
            </p>
          </div>
          <div className="bg-blue-900 bg-opacity-30 px-4 py-2 rounded-lg border border-blue-700">
            <p className="text-blue-300 text-xs sm:text-sm font-medium">
              Updated Daily
            </p>
          </div>
        </div>
        <ItemFlipGrid items={items} />
      </div>
    </div>
  );
};
