import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { MaintenancePopup } from './components/MaintenancePopup';
import { Home } from './components/Home';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useItems } from './hooks/useItems';
import { ItemHistory } from './types/Item';

// Lazy-loaded pages
const TradeCalculator = lazy(() => import('./components/TradeCalculator').then(m => ({ default: m.TradeCalculator })));
const ValueChangesPage = lazy(() => import('./components/ValueChangesPage').then(m => ({ default: m.ValueChangesPage })));
const TradeAdsPage = lazy(() => import('./components/TradeAdsPage').then(m => ({ default: m.TradeAdsPage })));
const ScamLogsPage = lazy(() => import('./components/ScamLogsPage').then(m => ({ default: m.ScamLogsPage })));
const AdminPage = lazy(() => import('./components/AdminPage').then(m => ({ default: m.AdminPage })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400">Loading...</p>
    </div>
  </div>
);

export const AppContent: React.FC = () => {
  const { items, loading } = useItems();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const location = useLocation();

  // Load maintenance mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('maintenanceMode');
    if (saved) setMaintenanceMode(JSON.parse(saved));
  }, []);

  const toggleMaintenanceMode = (enabled: boolean) => {
    setMaintenanceMode(enabled);
    localStorage.setItem('maintenanceMode', JSON.stringify(enabled));
  };

  const isAdminPage = location.pathname === '/admin';

  return (
    <>
      {!isAdminPage && <Header />}
      {maintenanceMode && !isAdminPage && <MaintenancePopup />}

      <main className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home items={items} />} />

              <Route
                path="/calculator"
                element={<TradeCalculator items={items} />}
              />

              <Route
                path="/value-changes"
                element={<ValueChangesPage />}
              />

              <Route
                path="/trade-ads"
                element={<TradeAdsPage items={items} />}
              />

              <Route
                path="/scam-logs"
                element={<ScamLogsPage />}
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPage
                      maintenanceMode={maintenanceMode}
                      onMaintenanceModeChange={toggleMaintenanceMode}
                    />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>

        {!isAdminPage && (
          <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-16">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-2xl">⚔️</span>
                <span className="text-xl font-bold text-white">AOT:R Value Hub</span>
              </div>
              <p className="text-gray-400 mb-4">
                Attack on Titan Revolution Values (UPDATED)
              </p>
              <p className="text-gray-500 text-sm mt-6 pt-6 border-t border-gray-800">
                © 2025 AOT:R Value Hub. Not affiliated with the official game.
              </p>
            </div>
          </footer>
        )}
      </main>
    </>
  );
};