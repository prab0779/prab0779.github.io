import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GA_MEASUREMENT_ID = "G-C6TFNV65TB";

let scriptLoaded = false;

function loadGtagScript() {
  if (scriptLoaded || document.getElementById("ga-gtag-src")) {
    scriptLoaded = true;
    return;
  }
  const script = document.createElement("script");
  script.id = "ga-gtag-src";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  (window as unknown as Record<string, unknown>).gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);

  scriptLoaded = true;
}

const GoogleAnalytics: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    loadGtagScript();
    if (typeof (window as unknown as Record<string, unknown>).gtag === "function") {
      (window as unknown as Record<string, (...args: unknown[]) => void>).gtag(
        "event",
        "page_view",
        { page_path: location.pathname + location.search, send_to: GA_MEASUREMENT_ID }
      );
    }
  }, [location.pathname, location.search, isAdmin]);

  return null;
};

export default GoogleAnalytics;
