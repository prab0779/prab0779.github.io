import React, { useEffect, useMemo, useState } from "react";
import { useStockRotation } from "../hooks/useStockRotation";
import { useItems } from "../hooks/useItems";

export const StockRotationAdmin: React.FC = () => {
  const { rotation, loading, saving, saveRotation, reload } = useStockRotation();
  const { items } = useItems();

  const [draft, setDraft] = useState(rotation);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  // When rotation loads/changes, sync into draft
  useEffect(() => {
    setDraft(rotation);
  }, [rotation]);

  const isDirty = useMemo(() => {
    return (
      draft.slot1_id !== rotation.slot1_id ||
      draft.slot2_id !== rotation.slot2_id ||
      draft.slot3_id !== rotation.slot3_id ||
      draft.slot4_id !== rotation.slot4_id
    );
  }, [draft, rotation]);

  const updateSlot = (index: number, value: string | null) => {
    setStatus("idle");
    setDraft((prev) => ({
      ...prev,
      [`slot${index + 1}_id`]: value,
    }) as typeof prev);
  };

  const onSave = async () => {
    setStatus("idle");
    const { error } = await saveRotation(draft);
    if (error) {
      console.error("SaveRotation error:", error);
      setStatus("error");
      return;
    }
    setStatus("saved");
    // optional: reload from DB to confirm
    await reload();
  };

  if (loading) return <p className="text-gray-300">Loading stock rotation...</p>;

  const slots = [draft.slot1_id, draft.slot2_id, draft.slot3_id, draft.slot4_id];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
        Stock Rotation
      </h1>

      <p className="text-gray-400 mb-6">
        Select the 4 cosmetic items shown in the Cosmetic Market.
      </p>

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

      <div className="flex items-center gap-3">
        <button
          onClick={onSave}
          disabled={saving || !isDirty}
          className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {status === "saved" && <span className="text-green-400 text-sm">Saved ✓</span>}
        {status === "error" && <span className="text-red-400 text-sm">Save failed ✕</span>}
        {!isDirty && status === "idle" && (
          <span className="text-gray-400 text-sm">No changes</span>
        )}
      </div>
    </div>
  );
};
