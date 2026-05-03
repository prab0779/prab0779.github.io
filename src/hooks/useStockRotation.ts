import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

export interface StockRotation {
  slot1_id: string | null;
  slot2_id: string | null;
  slot3_id: string | null;
  slot4_id: string | null;
  expires_at: string | null;
}

const EMPTY: StockRotation = {
  slot1_id: null,
  slot2_id: null,
  slot3_id: null,
  slot4_id: null,
  expires_at: null,
};

export const useStockRotation = () => {
  const [rotation, setRotation] = useState<StockRotation>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadRotation = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("stock_rotation")
      .select("slot1_id, slot2_id, slot3_id, slot4_id, expires_at")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error("loadRotation error:", error);
      setRotation(EMPTY);
      setLoading(false);
      return;
    }

    if (!data) {
      setRotation(EMPTY);
      setLoading(false);
      return;
    }

    setRotation({
      slot1_id: data.slot1_id ?? null,
      slot2_id: data.slot2_id ?? null,
      slot3_id: data.slot3_id ?? null,
      slot4_id: data.slot4_id ?? null,
      expires_at: data.expires_at ?? null,
    });

    setLoading(false);
  }, []);

  const saveRotation = useCallback(async (updated: Omit<StockRotation, 'expires_at'>) => {
    setSaving(true);

    const expires_at = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("stock_rotation")
      .update({ ...updated, expires_at })
      .eq("id", 1)
      .select("slot1_id, slot2_id, slot3_id, slot4_id, expires_at")
      .single();

    setSaving(false);

    if (error) {
      console.error("saveRotation error:", error);
      return { error };
    }

    if (data) {
      setRotation({
        slot1_id: data.slot1_id ?? null,
        slot2_id: data.slot2_id ?? null,
        slot3_id: data.slot3_id ?? null,
        slot4_id: data.slot4_id ?? null,
        expires_at: data.expires_at ?? null,
      });
    }

    return { error: null };
  }, []);

  useEffect(() => {
    loadRotation();

    const channel = supabase
      .channel("stock_rotation_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "stock_rotation", filter: "id=eq.1" },
        () => { loadRotation(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [loadRotation]);

  const isExpired =
    !rotation.expires_at || new Date(rotation.expires_at) <= new Date();

  return {
    rotation,
    isExpired,
    loading,
    saving,
    saveRotation,
    reload: loadRotation,
  };
};
