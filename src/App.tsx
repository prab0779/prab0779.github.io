import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { TradeCalculator } from './components/TradeCalculator';
import { ValueChanges } from './components/ValueChanges';
import { items as initialItems } from './data/items';
import { Item, ValueChange, ItemHistory } from './types/Item';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [items, setItems] = useState<Item[]>(initialItems);
  const [valueChanges, setValueChanges] = useState<ValueChange[]>([]);
  const [itemHistory, setItemHistory] = useState<ItemHistory>({});

  // Initialize item history on first load
  useEffect(() => {
    const savedHistory = localStorage.getItem('itemHistory');
    const savedChanges = localStorage.getItem('valueChanges');
    
    if (savedHistory) {
      setItemHistory(JSON.parse(savedHistory));
    } else {
      // Initialize history with current values
      const initialHistory: ItemHistory = {};
      items.forEach(item => {
        initialHistory[item.id] = {
          previousValue: item.value,
          previousDemand: item.demand,
          previousRateOfChange: item.rateOfChange,
          lastUpdated: new Date().toISOString()
        };
      });
      setItemHistory(initialHistory);
      localStorage.setItem('itemHistory', JSON.stringify(initialHistory));
    }

    if (savedChanges) {
      setValueChanges(JSON.parse(savedChanges));
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home items={items} />;
      case 'calculator':
        return <TradeCalculator items={items} />;
      case 'value-changes':
        return <ValueChanges valueChanges={valueChanges} />;
      default:
        return <Home items={items} />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>
      
      <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">⚔️</span>
            <span className="text-xl font-bold text-white">AOT:R Value Hub</span>
          </div>
          <p className="text-gray-400 mb-4">
            Your ultimate resource for Attack on Titan Revolution item values and trading
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="https://discord.gg/aotrvalues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              Discord Community
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              Game Guide
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              Updates
            </a>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              © 2025 AOT:R Value Hub. Not affiliated with the official game.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;