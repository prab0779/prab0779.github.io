import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const StockRestockerAdmin: React.FC = () => {
  const [form, setForm] = useState({
    slot1: "",
    slot2: "",
    slot3: "",
    slot4: "",
  });

  const [saving, setSaving] = useState(false);
  
  const [message, setMessage] = useState("");

  async function loadStock() {
    const { data, error } = await supabase
      .from("stock_rotation")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("ADMIN LOAD ERROR:", error);
      return;
    }

    setForm({
      slot1: data.slot1 || "",
      slot2: data.slot2 || "",
      slot3: data.slot3 || "",
      slot4: data.slot4 || "",
    });
  }

  async function saveStock() {
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("stock_rotation")
      .update({
        slot1: form.slot1 || null,
        slot2: form.slot2 || null,
        slot3: form.slot3 || null,
        slot4: form.slot4 || null,
      })
      .eq("id", 1);

    setSaving(false);

    if (error) {
      console.error("SAVE ERROR:", error);
      setMessage("❌ Failed to update stock.");
    } else {
      setMessage("✅ Stock updated successfully!");
    }
  }

  useEffect(() => {
    loadStock();
  }, []);

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-4">Admin — Edit Stock</h2>

      {/* SLOT INPUTS */}
      {["slot1", "slot2", "slot3", "slot4"].map((key, index) => (
        <div className="mb-4" key={key}>
          <label className="text-gray-300 text-sm">
            Slot {index + 1}
          </label>
          <input
            className="w-full px-3 py-2 mt-1 bg-gray-800 border border-gray-600 rounded text-white"
            placeholder="Cosmetic Name"
            value={(form as any)[key]}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                [key]: e.target.value,
              }))
            }
          />
        </div>
      ))}

      {/* SAVE BUTTON */}
      <button
        onClick={saveStock}
        disabled={saving}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
      >
        {saving ? "Saving..." : "Save Stock"}
      </button>

      {message && (
        <p className="text-center mt-3 text-green-400">{message}</p>
      )}
    </div>
  );
};
