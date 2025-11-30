import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ------------------------------
  // DISCORD LOGIN — IDENTIFY ONLY
  // ------------------------------
  const signInWithDiscord = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        // ONLY REQUEST USERNAME + AVATAR
        scopes: "identify",
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    return { data, error };
  };

  // Logout
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  // ------------------------------
  // Extract only SAFE DISCORD DATA
  // ------------------------------
  const discord = user
    ? {
        id: user.id,
        username:
          user.user_metadata?.preferred_username ??
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          "Unknown",
        avatar: user.user_metadata?.avatar_url || null,
        banner: user.user_metadata?.banner || null
      }
    : null;

  return {
    user,
    discord,      // <--- use this instead of user.user_metadata
    session,
    loading,
    signInWithDiscord,
    signOut
  };
};
