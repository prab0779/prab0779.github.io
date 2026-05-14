import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { getItemImageUrl } from "../lib/supabase";
import { useStockRotation, StockRotation } from "../hooks/useStockRotation";
import { useItemsContext } from "../contexts/ItemsContext";
import { Save, ChevronDown, ChevronUp, Search, AlertCircle, CheckCircle } from "lucide-react";

const ItemIcon: React.FC<{ emoji: string; name: string }> = ({ emoji, name }) => {
  const isImage = emoji.startsWith("/") || emoji.startsWith("./") || emoji.startsWith("http");
  if (isImage) {
    return <img src={getItemImageUrl(emoji)} alt={name} className="w-6 h-6 object-contain flex-shrink-0" />;
  }
  return <span className="text-lg leading-none flex-shrink-0">{emoji}</span>;
};

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
    return items.filter((i) => i.name.toLowerCase().includes(t));
  }, [items, term]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    if (open) setTerm("");
  }, [open]);

  return (
    <div ref={containerRef} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">{label}</label>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.07] text-white rounded-lg flex items-center justify-between hover:border-[#6f572c]/50 transition-colors"
      >
        <span className="flex items-center gap-2 truncate">
          {selected ? (
            <>
              <ItemIcon emoji={selected.emoji} name={selected.name} />
              <span className="truncate text-sm">{selected.name}</span>
            </>
          ) : (
            <span className="text-white/30 text-sm">None selected</span>
          )}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-white/30" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/30" />
        )}
      </button>

      {open && (
        <div className="mt-2 bg-[#0a0a0f] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl">
          <div className="p-2 border-b border-white/[0.06]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                autoFocus
                placeholder="Search item..."
                className="w-full pl-9 pr-3 py-2 bg-white/[0.04] border border-white/[0.07] text-white text-sm rounded-lg placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#c4a04a]/50"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            <button
              type="button"
              onClick={() => { onChange(null); setOpen(false); }}
              className="w-full text-left px-3 py-2.5 hover:bg-white/[0.04] text-white/40 text-sm border-b border-white/[0.04] transition-colors"
            >
              None
            </button>

            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-white/20 text-sm text-center">No results</div>
            ) : (
              filtered.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => { onChange(it.id); setOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 hover:bg-white/[0.04] flex items-center gap-2 transition-colors ${
                    it.id === value ? "bg-[#4b3a1d]/30 border-l-2 border-l-[#c4a04a]" : ""
                  }`}
                >
                  <ItemIcon emoji={it.emoji} name={it.name} />
                  <span className="text-white text-sm truncate">{it.name}</span>
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
  const { rotation, isExpired, loading, saving, saveRotation, reload } = useStockRotation();
  const { items } = useItemsContext();

  const [draft, setDraft] = useState<Omit<StockRotation, 'expires_at'>>(rotation);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession();
  }, []);

  useEffect(() => {
    setDraft(rotation);
  }, [rotation]);

  const updateSlot = (index: number, value: string | null) => {
    setDraft((prev) => ({
      ...prev,
      [`slot${index + 1}_id`]: value,
    }) as Omit<StockRotation, 'expires_at'>);
  };

  const onSave = async () => {
    setMsg(null);

    const chosen = [draft.slot1_id, draft.slot2_id, draft.slot3_id, draft.slot4_id].filter(Boolean);
    const unique = new Set(chosen);
    if (unique.size !== chosen.length) {
      setMsg({ type: 'error', text: "You can't use the same item in multiple slots." });
      return;
    }

    const { error } = await saveRotation(draft);
    if (error) {
      setMsg({ type: 'error', text: `Save failed: ${error.message ?? String(error)}` });
      return;
    }
    setMsg({ type: 'success', text: "Saved! Stock will expire in 6 hours." });
    await reload();
  };

  const expiryLabel = () => {
    if (!rotation.expires_at) return null;
    const exp = new Date(rotation.expires_at);
    if (exp <= new Date()) return "Expired — stock is showing as missing.";
    return `Active until ${exp.toLocaleString()} (6h from last save)`;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 rounded-full border-2 border-[#c4a04a]/30 border-t-[#c4a04a] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Stock Rotation</h1>
        <p className="text-white/40 text-sm">
          Select the 4 cosmetic items shown in the Cosmetic Market. Items automatically reset to missing after 6 hours.
        </p>
      </div>

      {expiryLabel() && (
        <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm ${
          isExpired
            ? "border-red-800/50 bg-red-950/30 text-red-300"
            : "border-emerald-800/50 bg-emerald-950/30 text-emerald-300"
        }`}>
          {isExpired ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
          {expiryLabel()}
        </div>
      )}

      {msg && (
        <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm ${
          msg.type === 'success'
            ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
            : 'bg-red-950/30 border-red-800/50 text-red-300'
        }`}>
          {msg.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SlotPicker label="Slot 1" value={draft.slot1_id} items={items} onChange={(id) => updateSlot(0, id)} />
        <SlotPicker label="Slot 2" value={draft.slot2_id} items={items} onChange={(id) => updateSlot(1, id)} />
        <SlotPicker label="Slot 3" value={draft.slot3_id} items={items} onChange={(id) => updateSlot(2, id)} />
        <SlotPicker label="Slot 4" value={draft.slot4_id} items={items} onChange={(id) => updateSlot(3, id)} />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c4a04a] hover:bg-[#d4b05a] disabled:opacity-50 text-black font-semibold text-sm transition-colors shadow-[0_0_20px_rgba(196,160,74,0.2)]"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <p className="text-xs text-white/30">
          Saving sets a 6-hour expiry. When it expires, all slots show as missing until you save again.
        </p>
      </div>
    </div>
  );
};
