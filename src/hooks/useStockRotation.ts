import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export interface StockRotation {
  slot1_id: string | null;
  slot2_id: string | null;
  slot3_id: string | null;
  slot4_id: string | null;
}

export const useStockRotation = () => {
  const [rotation, setRotation] = useState<StockRotation>({
    slot1_id: null,
    slot2_id: null,
    slot3_id: null,
    slot4_id: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadRotation = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("stock_rotation")
      .select("slot1_id, slot2_id, slot3_id, slot4_id")
      .eq("id", 1)
      .single();

    if (!error && data) {
      setRotation({
        slot1_id: data.slot1_id,
        slot2_id: data.slot2_id,
        slot3_id: data.slot3_id,
        slot4_id: data.slot4_id,
      });
    }

    setLoading(false);
  };

  const saveRotation = async (updated: StockRotation) => {
    setSaving(true);

    const { error } = await supabase
      .from("stock_rotation")
      .update(updated)
      .eq("id", 1);

    setSaving(false);

    if (!error) setRotation(updated);

    return { error };
  };

  useEffect(() => {
    loadRotation();
  }, []);

  return { rotation, loading, saving, saveRotation, reload: loadRotation };
};
