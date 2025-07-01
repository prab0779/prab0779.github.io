import React from 'react';
import { ItemList } from './ItemList';
import { Item } from '../types/Item';

interface HomeProps {
  items: Item[];
}

export const Home: React.FC<HomeProps> = ({ items }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          ⚔️ AOT:R Value Hub
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Track item values, calculate trades, and dominate the AOT Revolution market
        </p>
      </div>

      {/* Item List */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Item Database</h2>
        <ItemList items={items} />
      </div>
    </div>
  );
};