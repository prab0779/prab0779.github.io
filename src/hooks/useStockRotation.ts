import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

export interface StockRotation {
  slot1_id: string | null;
  slot2_id: string | null;
  slot3_id: string | null;
  slot4_id: string | null;
}

const EMPTY: StockRotation = {
  slot1_id: null,
  slot2_id: null,
  slot3_id: null,
  slot4_id: null,
};

export const useStockRotation = () => {
  const [rotation, setRotation] = useState<StockRotation>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadRotation = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("stock_rotation")
      .select("slot1_id, slot2_id, slot3_id, slot4_id")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error("loadRotation error:", error);
      setRotation(EMPTY);
      setLoading(false);
      return;
    }

    if (!data) {
      // row missing; keep empty (you can upsert later if you want)
      setRotation(EMPTY);
      setLoading(false);
      return;
    }

    setRotation({
      slot1_id: data.slot1_id ?? null,
      slot2_id: data.slot2_id ?? null,
      slot3_id: data.slot3_id ?? null,
      slot4_id: data.slot4_id ?? null,
    });

    setLoading(false);
  }, []);

  const saveRotation = useCallback(async (updated: StockRotation) => {
    setSaving(true);

    // UPDATE row id=1 (you already have it)
    const { data, error } = await supabase
      .from("stock_rotation")
      .update(updated)
      .eq("id", 1)
      .select("slot1_id, slot2_id, slot3_id, slot4_id")
      .single();

    setSaving(false);

    console.log("saveRotation:", { data, error });

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
      });
    }

    return { error: null };
  }, []);

  // Initial load + realtime updates
  useEffect(() => {
    loadRotation();

    const channel = supabase
      .channel("stock_rotation_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "stock_rotation", filter: "id=eq.1" },
        () => {
          loadRotation();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadRotation]);

  return {
    rotation,
    loading,
    saving,
    saveRotation,
    reload: loadRotation,
  };
};
