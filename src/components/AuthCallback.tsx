import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const ALLOWED_ADMIN_IDS = ["512671808886013962"];

export default function AuthCallback() {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    const handleLogin = async () => {
      if (hasRun.current) return;
      hasRun.current = true;

      // 1) Read params from real query
      const realUrl = new URL(window.location.href);
      const realParams = realUrl.searchParams;

      // 2) Read params from hash (if present)
      const hash = window.location.hash;
      const hashQuery = hash.includes("?") ? hash.split("?")[1] : "";
      const hashParams = new URLSearchParams(hashQuery);

      // Prefer real query, fallback to hash query
      const code = realParams.get("code") || hashParams.get("code");
      const type = realParams.get("type") || hashParams.get("type");

      // 3) Build a clean callback URL for Supabase (no hash)
      const cleanUrl = `${window.location.origin}/auth/callback` +
        (code ? `?code=${code}${type ? `&type=${type}` : ""}` : "");

      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(cleanUrl);

      if (exchangeError) {
        console.warn("Exchange error:", exchangeError.message);
      }

      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (session?.user) {
        const sub = session.user.user_metadata?.sub || "";
        const discordId = sub.startsWith("discord|")
          ? sub.replace("discord|", "")
          : null;

        // 4) Clean URL + navigate (prevents `/auth/callback?...#/trade-ads`)
        const target =
          discordId && ALLOWED_ADMIN_IDS.includes(discordId)
            ? "/#/admin"
            : "/#/trade-ads";

        window.history.replaceState(null, "", target);
        window.location.replace(target);
      } else {
        const target = "/#/trade-ads";
        window.history.replaceState(null, "", target);
        window.location.replace(target);
      }
    };

    handleLogin();
  }, [navigate]);

  return (
    <div className="text-center text-white py-20">
      Logging in...
    </div>
  );
}