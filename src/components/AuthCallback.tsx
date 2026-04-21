import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const hasRun = useRef(false);

  useEffect(() => {
    const handleLogin = async () => {
      if (hasRun.current) return;
      hasRun.current = true;

      // Strip hash before sending to Supabase
      const url = new URL(window.location.href);
      url.hash = "";

      const { error } = await supabase.auth.exchangeCodeForSession(
        url.toString()
      );

      if (error) {
        console.warn("Exchange error:", error.message);
      }

      // Force reload so session is definitely available
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