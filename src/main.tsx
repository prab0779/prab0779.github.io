import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { supabase } from "./lib/supabase";

// With HashRouter, Discord returns to https://site.com/#access_token=...
// HashRouter interprets the hash as a route before Supabase can read the token.
// We extract and process the token here — before React Router mounts — so the
// session is established. Then we clean the hash so the router sees "/".
(function handleOAuthRedirect() {
  const hash = window.location.hash;
  if (hash && hash.includes("access_token=")) {
    // Parse the token params out of the hash fragment
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token") ?? "";

    if (accessToken) {
      // Set the session directly so Supabase has it before any component mounts
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      // Clean the URL so the router doesn't try to route to "/access_token=..."
      window.history.replaceState(null, "", window.location.pathname + window.location.search + "#/");
    }
  }
})();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
