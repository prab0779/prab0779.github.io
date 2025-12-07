import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

// Allowed admin Discord IDs
const ALLOWED_ADMIN_IDS = ["512671808886013962"];

export default function AuthCallback() {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    const handleLogin = async () => {
      if (hasRun.current) return;
      hasRun.current = true;

      const url = window.location.href;

      // Exchange OAuth code for session
      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(url);

      if (exchangeError) {
        console.warn("Exchange error:", exchangeError.message);
      }

      const { data, error } = await supabase.auth.getSession();
      const session = data?.session;

      console.log("SESSION AFTER CALLBACK:", session, error);

      if (session?.user) {
        const sub = session.user.user_metadata?.sub || "";

        // Extract Discord ID from "discord|1234567890"
        const discordId = sub.startsWith("discord|")
          ? sub.replace("discord|", "")
          : null;

        console.log("Parsed Discord ID:", discordId);

        if (discordId && ALLOWED_ADMIN_IDS.includes(discordId)) {
          navigate("/admin");
        } else {
          navigate("/trade-ads");
        }
      } else {
        navigate("/trade-ads");
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
