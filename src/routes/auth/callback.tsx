import { useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function AuthCallback() {
  useEffect(() => {
    // Implicit flow: Supabase reads the #access_token hash automatically via
    // detectSessionInUrl. We just listen for the SIGNED_IN event then redirect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session) {
        subscription.unsubscribe();
        window.location.replace("/");
      }
    });

    // If the session is already available (e.g. fast parse), redirect immediately.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        subscription.unsubscribe();
        window.location.replace("/");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen aotr-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#c4a04a]/30 border-t-[#c4a04a] animate-spin mx-auto mb-4" />
        <p className="text-white/40 text-sm">Signing you in…</p>
      </div>
    </div>
  );
}
