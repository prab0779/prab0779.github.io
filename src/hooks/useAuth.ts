import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Discord login with identity scope
  const signInWithDiscord = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "identify",
      }
    });
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  // safer discord metadata
  const discord = user
    ? {
        id: user.id,
        username:
          user.user_metadata?.preferred_username ??
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          "Unknown",
        avatar: user.user_metadata?.avatar_url ?? null,
        banner: user.user_metadata?.banner ?? null
      }
    : null;

  return {
    user,
    discord,
    session,
    loading,
    signInWithDiscord,
    signOut
  };
};
