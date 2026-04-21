import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const applySession = (session: Session | null) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  };

  useEffect(() => {
    // Initial load
    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session);
    });

    // Listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithDiscord = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        scope: "identify email",
        redirectTo: `${window.location.origin}/#/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const discord = user
    ? {
        id: user.user_metadata?.sub?.replace("discord|", "") || null,
        username: user.user_metadata?.name ?? "Unknown",
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