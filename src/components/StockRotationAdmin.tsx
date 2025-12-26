import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useStockRotation, StockRotation } from "../hooks/useStockRotation";
import { useItems } from "../hooks/useItems";

export const StockRotationAdmin: React.FC = () => {
  const { rotation, loading, saving, saveRotation, reload } = useStockRotation();
  const { items } = useItems();

  const [draft, setDraft] = useState<StockRotation>(rotation);
  const [msg, setMsg] = useState<string | null>(null);

  // Debug: confirm session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("SESSION:", data.session);
    });
  }, []);

  // Keep draft in sync when DB updates
  useEffect(() => {
    setDraft(rotation);
  }, [rotation]);

  const slots = useMemo(
    () => [draft.slot1_id, draft.slot2_id, draft.slot3_id, draft.slot4_id],
    [draft]
  );

  const updateSlot = (index: number, value: string | null) => {
    setDraft((prev) => ({
      ...prev,
      [`slot${index + 1}_id`]: value,
    }) as StockRotation);
  };

  const onSave = async () => {
    setMsg(null);
    const { error } = await saveRotation(draft);
    if (error) {
      setMsg(`❌ Save failed: ${error.message ?? String(error)}`);
      return;
    }
    setMsg("✅ Saved!");
    await reload();
  };

  if (loading) return <p className="text-gray-300">Loading stock rotation...</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
        Stock Rotation
      </h1>

      <p className="text-gray-400 mb-6">
        Select the 4 cosmetic items shown in the Cosmetic Market.
      </p>

      {msg && (
        <div className="mb-4 px-4 py-3 rounded border border-gray-700 bg-gray-900 text-gray-200">
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {slots.map((slot, i) => (
          <div key={i} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <label className="block text-gray-300 text-sm mb-2">
              Slot {i + 1}
            </label>

            <select
              value={slot || ""}
              onChange={(e) => updateSlot(i, e.target.value === "" ? null : e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg"
            >
              <option value="">None</option>

              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.emoji} {item.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        onClick={onSave}
        disabled={saving}
        className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-60 text-white rounded-lg font-medium"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};
