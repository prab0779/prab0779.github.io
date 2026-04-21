import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    const handleLogin = async () => {
      if (hasRun.current) return;
      hasRun.current = true;

      // Let Supabase handle everything
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      if (error) {
        console.warn("Exchange error:", error.message);
      }

      // Just go to trade ads after login
      navigate("/trade-ads", { replace: true });
    };

    handleLogin();
  }, [navigate]);

  return (
    <div className="text-center text-white py-20">
      Logging in...
    </div>
  );
}