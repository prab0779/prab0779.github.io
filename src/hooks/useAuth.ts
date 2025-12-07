import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load session on page load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for sign-in changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // FIXED DISCORD OAuth login
  const signInWithDiscord = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        scope: "identify email",
        redirectTo: `${window.location.origin}/auth/callback?type=oauth`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // FIXED Discord metadata extraction
  const discord = user
    ? {
        id: user.user_metadata?.sub?.replace("discord|", "") || null,
        username:
          user.user_metadata?.name ??
          "Unknown",
        avatar: user.user_metadata?.avatar_url ?? null,
      }
    : null;

  return {
    user,
    discord,
    session,
    loading,
    signInWithDiscord,
    signOut,
  };
};
