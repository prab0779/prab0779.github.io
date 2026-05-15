import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export type UserRole = 'admin' | 'moderator' | null;

export const useAdminCheck = (userId: string | null | undefined) => {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId === undefined) return;

    if (!userId) {
      setRole(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const checkAdmin = async () => {
      const { data } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      setRole(data?.role ?? null);
      setLoading(false);
    };

    checkAdmin();
  }, [userId]);

  return { role, isAdmin: !!role, loading };
};