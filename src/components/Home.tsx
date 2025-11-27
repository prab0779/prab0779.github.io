import React from 'react';
import { ItemFlipGrid } from './ItemFlipGrid';
import { Item } from '../types/Item';

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

      {/* Item Database Section */}
      <div className="px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Item Database
            </h2>
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

      {/* Expanded FAQ Section for SEO */}
      <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-700 mx-4">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
          ❓ Frequently Asked Questions - Trading Corps.
        </h2>
        <div className="space-y-4">
          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">
              What is Trading Corps.?
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              Trading Corps. is the ultimate resource for Attack on Titan Revolution item values, 
              featuring a comprehensive trade calculator, real-time market data, and an extensive 
              item database to help players make informed trading decisions. Trading Corps. is a fan-made resource and is not affiliated with, sponsored by, or endorsed by Attack on Titan, its creators, or the Roblox game Attack on Titan Revolution
            </p>
          </div>

          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">
              How accurate are the values?
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              Our item values are updated regularly based on market trends, community feedback, 
              and trading data to ensure the most accurate and current pricing information for 
              Attack on Titan Revolution items.
            </p>
          </div>

          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">
              Is the Trading Corps. calculator free?
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              Yes! Trading Corps. is completely free to use. Our trade calculator, item database,
              and all features are available at no cost to help the Attack on Titan Revolution community.
            </p>
          </div>

          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">
              How often are values updated?
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              We update our AOTR trading values daily to reflect current market conditions.
              Major value changes are tracked and displayed in our value changes section for
              transparency and market analysis.
            </p>
          </div>

          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">
              What items are included in the AOTR value list?
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              Our comprehensive AOTR item database includes over 200+ items from Attack on Titan Revolution,
              covering weapons, accessories, clothing, consumables, and rare collectibles. Each item includes
              detailed information about value, demand, rarity, and how to obtain it.
            </p>
          </div>

          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">
              How does the AOTR trade calculator work?
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              Our AOTR trade calculator allows you to add items you're sending and receiving, automatically
              calculating total values, tax costs (gem and gold), and net profit/loss. It helps ensure
              fair trades and prevents you from losing value in Attack on Titan Revolution exchanges.
            </p>
          </div>

          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">
              What do the demand ratings mean in AOTR?
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              Demand ratings (1-10) indicate how much players want specific items in Attack on Titan Revolution.
              Higher demand (8-10) means items are highly sought after and may be harder to trade for.
              Lower demand (1-3) items are easier to obtain but may have less trading value.
            </p>
          </div>

          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">
              What does "Rate of Change" mean for AOTR items?
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              Rate of Change indicates market trends for AOTR items: "Rising" means values are increasing,
              "Falling" means decreasing, "Stable" means consistent pricing, and "Overpriced" suggests
              the item may be valued higher than market demand warrants.
            </p>
          </div>

          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">
              How do taxes work in AOTR trading?
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              Some AOTR items require gem or gold taxes when trading. Our calculator automatically computes
              these costs so you know exactly what you'll pay. Tax amounts vary by item rarity and type,
              with rarer items typically having higher tax requirements.
            </p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">
              Can I suggest updates to AOTR item values?
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              Yes! We welcome community feedback on AOTR item values. Join our Discord community to report 
              value changes, suggest corrections, or discuss market trends with other Attack on Titan Revolution 
              traders. Community input helps keep our database accurate and up-to-date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
