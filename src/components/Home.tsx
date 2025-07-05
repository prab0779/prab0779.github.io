import React from 'react';
import { ItemList } from './ItemList';
import { Item } from '../types/Item';

interface HomeProps {
  items: Item[];
}

export const Home: React.FC<HomeProps> = ({ items }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section with SEO Keywords */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          ⚔️ Attack on Titan Revolution (AOTR) Value List
        </h1>
        <p className="text-xl text-gray-400 mb-6">
          Welcome to the official AOTR value tracker — updated daily with accurate trading values
        </p>
        <p className="text-lg text-gray-300 mb-8 max-w-4xl mx-auto">
          Your ultimate resource for <strong className="text-blue-400">AOTR trading values</strong>, 
          <strong className="text-blue-400"> Attack on Titan Revolution item values</strong>, and comprehensive 
          <strong className="text-blue-400"> AOTR trading list</strong>. Calculate trades, track market trends, 
          and dominate the AOT Revolution economy with real-time data.
        </p>
        
        {/* Key Features with Keywords */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-white mb-2">AOTR Value Database</h3>
            <p className="text-gray-400 text-sm">
              Complete Attack on Titan Revolution item values with real-time updates and accurate pricing data
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-colors">
            <div className="text-3xl mb-3">🧮</div>
            <h3 className="text-lg font-semibold text-white mb-2">AOTR Trade Calculator</h3>
            <p className="text-gray-400 text-sm">
              Advanced AOTR trading calculator with tax computation and profit analysis for smart trading
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="text-lg font-semibold text-white mb-2">Market Insights</h3>
            <p className="text-gray-400 text-sm">
              Track AOTR value changes, market trends, and trading opportunities in real-time
            </p>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-8 border border-blue-700 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          🎮 About AOTR Value Hub - Your Premier Attack on Titan Revolution Trading Resource
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
          <div>
            <p className="mb-4">
              <strong className="text-blue-400">AOTR Value Hub</strong> is the most comprehensive 
              <strong> Attack on Titan Revolution value list</strong> available online. Our platform provides 
              accurate <strong>AOTR trading values</strong> for over 200+ items, helping players make 
              informed trading decisions in the AOT Revolution economy.
            </p>
            <p className="mb-4">
              Whether you're looking for <strong>AOTR item values</strong>, need an 
              <strong> AOTR trade calculator</strong>, or want to track market trends, our platform 
              offers everything you need for successful trading in Attack on Titan Revolution.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">🔥 Key Features:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Real-time AOTR value updates
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Advanced AOTR trading calculator
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Complete Attack on Titan Revolution item database
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                AOTR market trend analysis
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Tax calculation for AOTR trades
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Mobile-friendly AOTR value list
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trading Tips Section */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="mr-2">💡</span>
          AOTR Trading Tips & Strategies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">📊 Value Analysis</h3>
            <p className="text-gray-300 text-sm">
              Use our <strong>AOTR value tracker</strong> to monitor price fluctuations and identify 
              profitable trading opportunities. Items marked as "Rising\" often continue to increase in value.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-400 mb-2">🧮 Smart Trading</h3>
            <p className="text-gray-300 text-sm">
              Always use our <strong>AOTR trade calculator</strong> before making trades. Factor in 
              gem and gold taxes to ensure profitable exchanges in Attack on Titan Revolution.
            </p>
          </div>
        </div>
      </div>

      {/* Item Database Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              📦 Complete AOTR Item Database
            </h2>
            <p className="text-gray-400 mt-2">
              Browse our comprehensive Attack on Titan Revolution value list with {items.length}+ items
            </p>
          </div>
          <div className="hidden md:block bg-blue-900 bg-opacity-30 px-4 py-2 rounded-lg border border-blue-700">
            <p className="text-blue-300 text-sm font-medium">
              🔄 Updated Daily
            </p>
          </div>
        </div>
        <ItemList items={items} />
      </div>

      {/* FAQ Section for SEO */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6">
          ❓ Frequently Asked Questions - AOTR Values
        </h2>
        <div className="space-y-4">
          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              What is AOTR Value Hub?
            </h3>
            <p className="text-gray-300 text-sm">
              AOTR Value Hub is the ultimate resource for Attack on Titan Revolution item values, 
              featuring a comprehensive trade calculator, real-time market data, and an extensive 
              item database to help players make informed trading decisions.
            </p>
          </div>
          
          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              How accurate are the AOTR values?
            </h3>
            <p className="text-gray-300 text-sm">
              Our AOTR item values are updated regularly based on market trends, community feedback, 
              and trading data to ensure the most accurate and current pricing information for 
              Attack on Titan Revolution items.
            </p>
          </div>
          
          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              Is the AOTR trade calculator free?
            </h3>
            <p className="text-gray-300 text-sm">
              Yes! AOTR Value Hub is completely free to use. Our trade calculator, item database, 
              and all features are available at no cost to help the Attack on Titan Revolution community.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              How often are AOTR values updated?
            </h3>
            <p className="text-gray-300 text-sm">
              We update our AOTR trading values daily to reflect current market conditions. 
              Major value changes are tracked and displayed in our value changes section for 
              transparency and market analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};