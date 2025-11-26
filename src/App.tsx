import React, { useState, useEffect, Suspense, lazy, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { MaintenancePopup } from './components/MaintenancePopup';
import { Home } from './components/Home';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useItems } from './hooks/useItems';
import { ItemHistory } from './types/Item';

const TradeCalculator = lazy(() => import('./components/TradeCalculator').then(m => ({ default: m.TradeCalculator })));
const ValueChangesPage = lazy(() => import('./components/ValueChangesPage').then(m => ({ default: m.ValueChangesPage })));
const TradeAdsPage = lazy(() => import('./components/TradeAdsPage').then(m => ({ default: m.TradeAdsPage })));
const ScamLogsPage = lazy(() => import('./components/ScamLogsPage').then(m => ({ default: m.ScamLogsPage })));
const AdminPage = lazy(() => import('./components/AdminPage').then(m => ({ default: m.AdminPage })));

// Component that has access to location
const AppContent: React.FC = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState('home');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const { items, loading } = useItems();
  const [itemHistory, setItemHistory] = useState<ItemHistory>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load maintenance mode from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('maintenanceMode');
    if (saved) {
      setMaintenanceMode(JSON.parse(saved));
    }
  }, []);

  // Check if current page is admin
  const isAdminPage = location.pathname === '/admin';

  // Initialize item history on first load
  useEffect(() => {
    if (items.length === 0) return;

    const savedHistory = localStorage.getItem('itemHistory');
    
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
  }, [items]);

  // Function to toggle maintenance mode (will be passed to AdminPage)
  const toggleMaintenanceMode = (enabled: boolean) => {
    setMaintenanceMode(enabled);
    localStorage.setItem('maintenanceMode', JSON.stringify(enabled));
  };

  const handlePageChange = async (newPage: string) => {
    if (newPage === currentPage || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Wait for exit animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCurrentPage(newPage);
    
    // Wait a bit then remove transitioning state
    await new Promise(resolve => setTimeout(resolve, 50));
    
    setIsTransitioning(false);
  };

  const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );

  const renderPage = () => {
    if (loading) {
      return <LoadingFallback />;
    }

    switch (currentPage) {
      case 'home':
        return <Home items={items} />;
      case 'calculator':
        return <Suspense fallback={<LoadingFallback />}><TradeCalculator items={items} /></Suspense>;
      case 'value-changes':
        return <Suspense fallback={<LoadingFallback />}><ValueChangesPage /></Suspense>;
      case 'trade-ads':
        return <Suspense fallback={<LoadingFallback />}><TradeAdsPage items={items} /></Suspense>;
      case 'scam-logs':
        return <Suspense fallback={<LoadingFallback />}><ScamLogsPage /></Suspense>;
      default:
        return <Home items={items} />;
    }
  };

  return (
    <>
      {/* Show maintenance popup only if maintenance is enabled AND not on admin page */}
      {maintenanceMode && !isAdminPage && <MaintenancePopup />}
      
      <Routes>
        {/* Admin Route - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-gray-400">Loading admin...</div></div>}>
                <AdminPage
                  maintenanceMode={maintenanceMode}
                  onMaintenanceModeChange={toggleMaintenanceMode}
                />
              </Suspense>
            </ProtectedRoute>
          }
        />
        
        {/* Main App Routes */}
        <Route 
          path="/*" 
          element={
            <div className="min-h-screen bg-black">
              <Header currentPage={currentPage} onPageChange={handlePageChange} />
              
              <main className="container mx-auto px-4 py-8">
                <div className={`transition-all duration-300 ease-in-out ${
                  isTransitioning 
                    ? 'opacity-0 transform translate-x-8' 
                    : 'opacity-100 transform translate-x-0'
                }`}>
                  {renderPage()}
                </div>
              </main>
              
              <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-16">
                <div className="max-w-6xl mx-auto px-4 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <span className="text-2xl">⚔️</span>
                    <span className="text-xl font-bold text-white">AOT:R Value Hub</span>
                  </div>
                  <p className="text-gray-400 mb-4">
                    Attack on Titan Revolution Values (UPDATED)
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
                    <button
                      onClick={() => handlePageChange('value-changes')}
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Value Changes
                    </button>
                    <button
                      onClick={() => handlePageChange('value-guesser')}
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Value Guesser
                    </button>
                    <button
                      onClick={() => handlePageChange('trade-ads')}
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Trade Ads
                    </button>
                    <button
                      onClick={() => handlePageChange('scam-logs')}
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Scam Logs
                    </button>
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
          } 
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
