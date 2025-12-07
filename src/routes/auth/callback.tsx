import { useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
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

      // 🔥 Exchange OAuth code for a Supabase session
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      if (error) {
        console.error("OAuth exchange error:", error.message);
      }

      // 🔥 Get the new session
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      console.log("SESSION LOADED:", session);

      if (session?.user) {
        // Discord user ID is stored inside: user_metadata.sub → "discord|123456"
        const sub = session.user.user_metadata?.sub || "";
        const discordId = sub.startsWith("discord|")
          ? sub.replace("discord|", "")
          : null;

        console.log("Extracted Discord ID:", discordId);

        // Redirect admins
        if (discordId && ALLOWED_ADMIN_IDS.includes(discordId)) {
          return navigate("/admin");
        }
      }

      // Regular users → trade ads
      navigate("/trade-ads");
    };

    handleLogin();
  }, [navigate]);

  return (
    <div className="text-center text-white py-20">
      Logging in...
    </div>
  );
}
