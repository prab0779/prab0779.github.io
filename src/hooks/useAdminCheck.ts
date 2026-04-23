import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const useAdminCheck = (userId: string | undefined) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    supabase
      .rpc("is_admin")
      .then(({ data }) => {
        setIsAdmin(data === true);
      })
      .catch(() => setIsAdmin(false))
      .finally(() => setLoading(false));
  }, [userId]);

  return { isAdmin, loading };
};
