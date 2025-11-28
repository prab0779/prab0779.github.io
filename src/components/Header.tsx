import React from 'react';
import { Item } from '../types/Item';
import { FAQSection } from './FAQSection';

interface HomeProps {
  items: Item[];
}

export const Home: React.FC<HomeProps> = ({ items }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section with SEO Keywords */}
      <div className="text-center py-8 sm:py-12 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
          Attack on Titan Revolution (OUTDATED) Value List
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 max-w-4xl mx-auto">
         The #1 most trusted Attack on Titan: Revolution Value List, maintained by experienced players worldwide. We provide accurate and reliable updates based on real trading activity.
        </p>
        <div className="bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded-lg p-4 sm:p-6 max-w-3xl mx-auto text-left">
          <p className="text-yellow-200 text-sm sm:text-base mb-3">
            <strong>Note:</strong> This is not an official list or set of fixed prices.
          </p>
          <p className="text-gray-300 text-sm sm:text-base mb-2">Values are determined by three key factors:</p>
          <ul className="space-y-2 text-gray-300 text-sm sm:text-base ml-4">
            <li><strong>Rarity</strong> – How difficult the item is to obtain.</li>
            <li><strong>Demand</strong> – How many players actively want it.</li>
            <li><strong>Player Needs</strong> – What it's worth to the person you're trading with.</li>
          </ul>
          <p className="text-gray-300 text-sm sm:text-base mt-3">
            Because of this, values can shift depending on the market. Trading is all about negotiation and finding a deal that feels fair to both sides.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-8">
        <FAQSection />
      </div>
    </div>
  );
};
