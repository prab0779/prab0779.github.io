import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export type UserRole = 'admin' | 'moderator' | null;

export const useAdminCheck = (userId: string | undefined) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsAdmin(false);
      setRole(null);
      setLoading(false);
      return;
    }

    const checkAdmin = async () => {
      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id, role")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error(error);
        setIsAdmin(false);
        setRole(null);
      } else {
        setIsAdmin(!!data);
        setRole(data?.role ?? null);
      }

      setLoading(false);
    };

    checkAdmin();
  }, [userId]);

  return { isAdmin, role, loading };
};
