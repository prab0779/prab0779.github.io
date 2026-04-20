import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { MaintenancePopup } from "./components/MaintenancePopup";
import { Home } from "./components/Home";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useItems } from "./hooks/useItems";
import ClickSpark from "./Shared/ClickSpark";
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
  import("./routes/auth/callback").then(m => ({ default: m.default }))
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div
      className="container"
      style={
        {
          "--uib-size": "43px",
          "--uib-color": "black",
          "--uib-speed": "1.3s",
          "--uib-dot-size": "calc(var(--uib-size) * 0.24)"
        } as React.CSSProperties
      }
    >
      <div className="dot" />
    </div>

    <style>{`
      .container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: var(--uib-dot-size);
        width: var(--uib-size);
      }

      .dot,
      .container::before,
      .container::after {
        content: '';
        display: block;
        height: var(--uib-dot-size);
        width: var(--uib-dot-size);
        border-radius: 50%;
        background-color: var(--uib-color);
        transform: scale(0);
        transition: background-color 0.3s ease;
      }

      .container::before {
        animation: pulse var(--uib-speed) ease-in-out calc(var(--uib-speed) * -0.375) infinite;
      }

      .dot {
        animation: pulse var(--uib-speed) ease-in-out calc(var(--uib-speed) * -0.25) infinite both;
      }

      .container::after {
        animation: pulse var(--uib-speed) ease-in-out calc(var(--uib-speed) * -0.125) infinite;
      }

      @keyframes pulse {
        0%, 100% {
          transform: scale(0);
        }
        50% {
          transform: scale(1);
        }
      }
    `}</style>
  </div>
);

/* ⭐ MAIN DEFAULT EXPORT */
export default function App() {
  return (
    <OnlinePresenceProvider>
      <ClickSpark
        sparkColor="#fff"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        <AppContent />
      </ClickSpark>
    </OnlinePresenceProvider>
  );
}

export const AppContent: React.FC = () => {
  const { items } = useItems();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const location = useLocation();

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
    <div className="min-h-screen flex flex-col relative aotr-background">
      <div className="relative z-10 flex flex-col min-h-screen">

        {!isAdminPage && <Header />}
        {maintenanceMode && !isAdminPage && <MaintenancePopup />}

        <main className="flex-1">
          <div className="w-full">
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