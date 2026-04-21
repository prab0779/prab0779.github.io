import { useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";

export default function AuthCallback() {
  const hasRun = useRef(false);

  useEffect(() => {
    const handleLogin = async () => {
      if (hasRun.current) return;
      hasRun.current = true;

      // Strip hash so Supabase gets a clean URL
      const url = new URL(window.location.href);
      url.hash = "";

      const { error } = await supabase.auth.exchangeCodeForSession(
        url.toString()
      );

      if (error) {
        console.error("OAuth exchange error:", error.message);
      }

      // Force clean redirect (prevents race condition + bad URL)
      window.location.replace("/#/trade-ads");
    };

    handleLogin();
  }, []);

  return (
    <div className="text-center text-white py-20">
      Logging in...
    </div>
  );
}