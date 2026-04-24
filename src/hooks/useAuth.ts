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
    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithDiscord = async () => {
    return supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        scopes: "identify",
        redirectTo: `${window.location.origin}/`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  let discord = null;

  if (user) {
    const rawName =
      user.user_metadata?.preferred_username ||
      user.user_metadata?.global_name ||
      user.user_metadata?.name ||
      "Unknown";

    const cleanName = rawName.endsWith("#0")
      ? rawName.replace("#0", "")
      : rawName;

    discord = {
      id: user.user_metadata?.sub?.replace("discord|", "") || null,
      username: cleanName,
      avatar: user.user_metadata?.avatar_url ?? null,
    };
  }

  return {
    user,
    discord,
    session,
    loading,
    signInWithDiscord,
    signOut,
  };
};