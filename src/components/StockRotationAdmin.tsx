import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { useStockRotation, StockRotation } from "../hooks/useStockRotation";
import { useItems } from "../hooks/useItems";

type SlotPickerProps = {
  label: string;
  value: string | null;
  items: { id: string; name: string; emoji: string }[];
  onChange: (id: string | null) => void;
};

const SlotPicker: React.FC<SlotPickerProps> = ({ label, value, items, onChange }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");

  const selected = useMemo(
    () => (value ? items.find((i) => i.id === value) : null),
    [value, items]
  );

  const filtered = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t) return items;
    return items.filter((i) => {
      const name = i.name.toLowerCase();
      return name.includes(t);
    });
  }, [items, term]);

  // close on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // when opening, reset search
  useEffect(() => {
    if (open) setTerm("");
  }, [open]);

  return (
    <div ref={containerRef} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
      <label className="block text-gray-300 text-sm mb-2">{label}</label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg flex items-center justify-between hover:bg-gray-750"
      >
        <span className="flex items-center gap-2 truncate">
          {selected ? (
            <>
              <span>{selected.emoji}</span>
              <span className="truncate">{selected.name}</span>
            </>
          ) : (
            <span className="text-gray-400">None</span>
          )}
        </span>
        <span className="text-gray-400">{open ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="mt-2 bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
          <div className="p-2 border-b border-gray-800">
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              autoFocus
              placeholder="Search item..."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg outline-none"
            />
          </div>

          <div className="max-h-64 overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-900 text-gray-300 border-b border-gray-900"
            >
              None
            </button>

            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-gray-500">No results</div>
            ) : (
              filtered.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => {
                    onChange(it.id);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-900 flex items-center gap-2 ${
                    it.id === value ? "bg-gray-900" : ""
                  }`}
                >
                  <span>{it.emoji}</span>
                  <span className="text-white truncate">{it.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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

  const updateSlot = (index: number, value: string | null) => {
    setDraft((prev) => ({
      ...prev,
      [`slot${index + 1}_id`]: value,
    }) as StockRotation);
  };

  const onSave = async () => {
    setMsg(null);

    // Optional: prevent duplicates across slots
    const chosen = [draft.slot1_id, draft.slot2_id, draft.slot3_id, draft.slot4_id].filter(Boolean);
    const unique = new Set(chosen);
    if (unique.size !== chosen.length) {
      setMsg("❌ You can't use the same item in multiple slots.");
      return;
    }

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
        <SlotPicker
          label="Slot 1"
          value={draft.slot1_id}
          items={items}
          onChange={(id) => updateSlot(0, id)}
        />
        <SlotPicker
          label="Slot 2"
          value={draft.slot2_id}
          items={items}
          onChange={(id) => updateSlot(1, id)}
        />
        <SlotPicker
          label="Slot 3"
          value={draft.slot3_id}
          items={items}
          onChange={(id) => updateSlot(2, id)}
        />
        <SlotPicker
          label="Slot 4"
          value={draft.slot4_id}
          items={items}
          onChange={(id) => updateSlot(3, id)}
        />
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
