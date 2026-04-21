import { useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function AuthCallback() {
  useEffect(() => {
    // With implicit flow, Supabase detects the token from the URL hash automatically.
    // We just wait for the session to be set then redirect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        subscription.unsubscribe();
        window.location.replace("/#/trade-ads");
      }
    });

    // Fallback: if already signed in (e.g. page refresh), redirect immediately
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        subscription.unsubscribe();
        window.location.replace("/#/trade-ads");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="text-center text-white py-20">
      Logging in...
    </div>
  );
}
