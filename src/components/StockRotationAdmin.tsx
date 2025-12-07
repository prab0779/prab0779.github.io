import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export const StockRotationAdmin: React.FC = () => {
  const [slots, setSlots] = useState(["", "", "", ""]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadStock = async () => {
    const { data, error } = await supabase
      .from("stock_rotation")
      .select("slot1, slot2, slot3, slot4")
      .eq("id", 1)
      .single();

    if (!error && data) {
      setSlots([
        data.slot1 || "",
        data.slot2 || "",
        data.slot3 || "",
        data.slot4 || "",
      ]);
    }
    setLoading(false);
  };

  const saveStock = async () => {
    setSaving(true);

    const { error } = await supabase
      .from("stock_rotation")
      .update({
        slot1: slots[0] || null,
        slot2: slots[1] || null,
        slot3: slots[2] || null,
        slot4: slots[3] || null,
      })
      .eq("id", 1);

    setSaving(false);

    if (error) alert("Failed to save stock rotation");
    else alert("Stock rotation updated!");
  };

  useEffect(() => {
    loadStock();
  }, []);

  if (loading) {
    return <p className="text-gray-300">Loading stock rotation...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
        Stock Rotation
      </h1>

      <p className="text-gray-400 mb-6">
        Update the 4 cosmetic items shown in the Cosmetic Market.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {slots.map((slot, i) => (
          <div
            key={i}
            className="bg-gray-900 p-4 rounded-lg border border-gray-700"
          >
            <label className="block text-gray-300 text-sm mb-2">
              Slot {i + 1}
            </label>
            <input
              type="text"
              value={slot}
              onChange={(e) => {
                const newSlots = [...slots];
                newSlots[i] = e.target.value;
                setSlots(newSlots);
              }}
              placeholder="Cosmetic Name"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg"
            />
          </div>
        ))}
      </div>

      <button
        onClick={saveStock}
        disabled={saving}
        className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium"
      >
        {saving ? "Saving..." : "Save Rotation"}
      </button>
    </div>
  );
};
