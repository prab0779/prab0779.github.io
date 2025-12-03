import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

// Admin Discord IDs
const ALLOWED_ADMIN_IDS = ["512671808886013962"];

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogin = async () => {
      // Try exchanging the code for a session (if Discord sent a ?code= param)
      const { data: sessionData, error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(window.location.href);

      if (exchangeError) {
        console.warn("No exchange needed or exchange error:", exchangeError.message);
      }

      // Now fetch session to ensure Supabase stored it
      const { data, error } = await supabase.auth.getSession();

      console.log("SESSION AFTER CALLBACK:", data?.session, error);

      if (data?.session?.user) {
        // Check if user is an admin
        const discordId =
          data.session.user.user_metadata?.provider_id ||
          data.session.user.user_metadata?.sub ||
          null;

        console.log("Discord ID from callback:", discordId);

        // If admin, redirect to admin page; otherwise to trade ads
        if (discordId && ALLOWED_ADMIN_IDS.includes(discordId)) {
          navigate("/admin");
        } else {
          navigate("/trade-ads");
        }
      } else {
        // Fallback to trade ads if no session
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
