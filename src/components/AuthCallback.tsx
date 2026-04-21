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

      // Extract query params from hash (HashRouter)
      const hash = window.location.hash;
      const queryString = hash.includes("?") ? hash.split("?")[1] : "";

      // Build a clean URL for Supabase
      const fixedUrl = `${window.location.origin}/auth/callback${
        queryString ? `?${queryString}` : ""
      }`;

      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(fixedUrl);

      if (exchangeError) {
        console.warn("Exchange error:", exchangeError.message);
      }

      const { data, error } = await supabase.auth.getSession();
      const session = data?.session;

      if (session?.user) {
        const sub = session.user.user_metadata?.sub || "";

        const discordId = sub.startsWith("discord|")
          ? sub.replace("discord|", "")
          : null;

        if (discordId && ALLOWED_ADMIN_IDS.includes(discordId)) {
          navigate("/admin", { replace: true });
        } else {
          navigate("/trade-ads", { replace: true });
        }
      } else {
        navigate("/trade-ads", { replace: true });
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