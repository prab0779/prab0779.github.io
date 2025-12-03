// 👇 DEFINE THIS OUTSIDE THE COMPONENT
let hasRun = false;

import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

// Admin Discord IDs
const ALLOWED_ADMIN_IDS = ["512671808886013962"];

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {

    const handleLogin = async () => {
      if (hasRun) return;
      hasRun = true;

      const url = window.location.href;

      const { data: sessionData, error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(url);

      if (exchangeError) {
        console.warn("Exchange error:", exchangeError.message);
      }

      const { data, error } = await supabase.auth.getSession();

      console.log("SESSION AFTER CALLBACK:", data?.session, error);

      if (data?.session?.user) {
        const discordId =
          data.session.user.user_metadata?.provider_id ||
          data.session.user.user_metadata?.sub ||
          null;

        console.log("Discord ID from callback:", discordId);

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
