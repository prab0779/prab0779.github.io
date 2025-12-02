import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

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

      // Redirect to trade ads (user will be logged in now)
      navigate("/trade-ads");
    };

    handleLogin();
  }, []);

  return (
    <div className="text-center text-white py-20">
      Logging in...
    </div>
  );
}
