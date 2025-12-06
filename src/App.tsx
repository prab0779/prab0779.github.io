import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { MaintenancePopup } from "./components/MaintenancePopup";
import { Home } from "./components/Home";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useItems } from "./hooks/useItems";
import { OnlinePresenceProvider } from "./components/OnlinePresenceProvider";

/* Lazy-loaded pages */
const TradeCalculator = lazy(() =>
  import("./components/TradeCalculator").then(m => ({ default: m.TradeCalculator }))
);
const ValueListPage = lazy(() =>
  import("./components/ValueListPage").then(m => ({ default: m.ValueListPage }))
);
const ValueChangesPage = lazy(() =>
  import("./components/ValueChangesPage").then(m => ({ default: m.ValueChangesPage }))
);
const TradeAdsPage = lazy(() =>
  import("./components/TradeAdsPage").then(m => ({ default: m.TradeAdsPage }))
);
const ScamLogsPage = lazy(() =>
  import("./components/ScamLogsPage").then(m => ({ default: m.ScamLogsPage }))
);
const AdminPage = lazy(() =>
  import("./components/AdminPage").then(m => ({ default: m.AdminPage }))
);
const AuthCallback = lazy(() =>
  import("./components/AuthCallback").then(m => ({ default: m.default }))
);

/* Loading spinner */
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400">Loading...</p>
    </div>
  </div>
);

/* ⭐ MAIN DEFAULT EXPORT */
export default function App() {
  return (
    <OnlinePresenceProvider>
      <AppContent />
    </OnlinePresenceProvider>
  );
}

export const AppContent: React.FC = () => {
  const { items } = useItems();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const location = useLocation();

  /* Load maintenance mode from localStorage */
  useEffect(() => {
    const saved = localStorage.getItem("maintenanceMode");
    if (saved) setMaintenanceMode(JSON.parse(saved));
  }, []);

  const toggleMaintenanceMode = (enabled: boolean) => {
    setMaintenanceMode(enabled);
    localStorage.setItem("maintenanceMode", JSON.stringify(enabled));
  };

  const isAdminPage = location.pathname === "/admin";

  return (
    <div className="min-h-screen relative aotr-background">

      {/* CONTENT ABOVE BACKGROUND */}
      <div className="relative z-10">

        {!isAdminPage && <Header />}
        {maintenanceMode && !isAdminPage && <MaintenancePopup />}

        <main>
          <div className="container mx-auto px-4 py-4">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home items={items} />} />
                <Route path="/calculator" element={<TradeCalculator items={items} />} />
                <Route path="/value-list" element={<ValueListPage items={items} />} />
                <Route path="/value-changes" element={<ValueChangesPage />} />
                <Route path="/trade-ads" element={<TradeAdsPage items={items} />} />
                <Route path="/scam-logs" element={<ScamLogsPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

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
        </main>

        {!isAdminPage && <Footer />}
      </div>
    </div>
  );
};
