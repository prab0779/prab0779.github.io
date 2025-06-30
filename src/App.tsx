import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { TradeCalculator } from './components/TradeCalculator';
import { ValueChanges } from './components/ValueChanges';
import { AdminPanel } from './components/AdminPanel';
import { items as initialItems } from './data/items';
import { Item, ValueChange, ItemHistory } from './types/Item';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [items, setItems] = useState<Item[]>(initialItems);
  const [valueChanges, setValueChanges] = useState<ValueChange[]>([]);
  const [itemHistory, setItemHistory] = useState<ItemHistory>({});
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

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

  const handleUpdateItem = (itemId: string, updates: Partial<Item>) => {
    const currentItem = items.find(item => item.id === itemId);
    if (!currentItem) return;

    const previousHistory = itemHistory[itemId];
    const now = new Date().toISOString();

    // Calculate percentage change
    const oldValue = previousHistory?.previousValue || currentItem.value;
    const newValue = updates.value || currentItem.value;
    const percentageChange = oldValue !== 0 ? ((newValue - oldValue) / oldValue) * 100 : 0;

    // Determine change type
    let changeType: 'increase' | 'decrease' | 'stable' = 'stable';
    if (newValue > oldValue) changeType = 'increase';
    else if (newValue < oldValue) changeType = 'decrease';

    // Create value change record if there's a significant change
    if (Math.abs(percentageChange) > 0.1 || 
        updates.demand !== currentItem.demand || 
        updates.rateOfChange !== currentItem.rateOfChange) {
      
      const newChange: ValueChange = {
        id: `${itemId}-${Date.now()}`,
        itemId,
        itemName: currentItem.name,
        emoji: currentItem.emoji,
        oldValue: previousHistory?.previousValue || currentItem.value,
        newValue: updates.value || currentItem.value,
        oldDemand: previousHistory?.previousDemand || currentItem.demand,
        newDemand: updates.demand || currentItem.demand,
        oldRateOfChange: previousHistory?.previousRateOfChange || currentItem.rateOfChange,
        newRateOfChange: updates.rateOfChange || currentItem.rateOfChange,
        changeDate: now,
        changeType,
        percentageChange
      };

      const updatedChanges = [newChange, ...valueChanges];
      setValueChanges(updatedChanges);
      localStorage.setItem('valueChanges', JSON.stringify(updatedChanges));
    }

    // Update item
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    setItems(updatedItems);

    // Update history
    const updatedHistory = {
      ...itemHistory,
      [itemId]: {
        previousValue: updates.value || currentItem.value,
        previousDemand: updates.demand || currentItem.demand,
        previousRateOfChange: updates.rateOfChange || currentItem.rateOfChange,
        lastUpdated: now
      }
    };
    setItemHistory(updatedHistory);
    localStorage.setItem('itemHistory', JSON.stringify(updatedHistory));
  };

  const handleAdminAuthenticate = (userData: any) => {
    setIsAdminAuthenticated(!!userData);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home items={items} />;
      case 'calculator':
        return <TradeCalculator items={items} />;
      case 'value-changes':
        return <ValueChanges valueChanges={valueChanges} />;
      case 'admin':
        return (
          <AdminPanel 
            items={items}
            onUpdateItem={handleUpdateItem}
            isAuthenticated={isAdminAuthenticated}
            onAuthenticate={handleAdminAuthenticate}
          />
        );
      default:
        return <Home items={items} />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {currentPage !== 'admin' && (
        <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      )}
      
      {currentPage === 'admin' ? (
        renderPage()
      ) : (
        <main className="container mx-auto px-4 py-8">
          {renderPage()}
        </main>
      )}
      
      {currentPage !== 'admin' && (
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
      )}
    </div>
  );
}

export default App;