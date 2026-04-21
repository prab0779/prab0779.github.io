// useItemNames.ts
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const useItemNames = (enabled: boolean) => {
  const [items, setItems] = useState<{ name: string; emoji: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const fetch = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("items")
        .select("name, emoji")
        .order("name", { ascending: true });

      setItems(data || []);
      setLoading(false);
    };

    fetch();
  }, [enabled]);

  return { items, loading };
};