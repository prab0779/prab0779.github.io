import React, { useState, useMemo, useRef, useEffect } from "react";
import { X, Search, Plus, Minus, ChevronDown } from "lucide-react";
import { CreateTradeAdData, TradeAdItem } from "../types/TradeAd";
import GradientText from "../Shared/GradientText";

interface ItemOption {
  name: string;
  emoji: string;
  category?: string;
  value?: number;
}

interface Props {
  items: ItemOption[];
  tags: string[];
  onClose: () => void;
  onSubmit: (data: CreateTradeAdData) => Promise<{ error: string | null }>;
  authorName: string;
  authorAvatar: string | null;
}

// ── Item Picker ──────────────────────────────────────────────────────────────

interface ItemPickerProps {
  items: ItemOption[];
  selected: TradeAdItem[];
  onAdd: (item: ItemOption) => void;
  onRemove: (name: string) => void;
  onQtyChange: (name: string, delta: number) => void;
  placeholder: string;
  accentClass: string;
}

const isImagePath = (s: string) => s.startsWith("/") || s.startsWith("./") || s.startsWith("http");

function ItemEmoji({ emoji, name, size = "md" }: { emoji: string; name: string; size?: "sm" | "md" | "lg" }) {
  const sizeMap = { sm: "w-5 h-5", md: "w-7 h-7", lg: "w-9 h-9" };
  if (isImagePath(emoji))
    return <img src={emoji} alt={name} className={`${sizeMap[size]} object-contain rounded`} />;
  return <span className={size === "lg" ? "text-xl" : size === "md" ? "text-base" : "text-sm"}>{emoji || "?"}</span>;
}

function ItemPicker({ items, selected, onAdd, onRemove, onQtyChange, placeholder, accentClass }: ItemPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedNames = useMemo(() => new Set(selected.map(s => s.itemName)), [selected]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items.slice(0, 60);
    const q = query.toLowerCase();
    return items.filter(i => i.name.toLowerCase().includes(q)).slice(0, 60);
  }, [items, query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="space-y-2">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map(item => (
            <div
              key={item.itemName}
              className="flex items-center gap-1.5 bg-[#1a1a1a] border border-white/10 rounded-lg px-2 py-1.5 group"
            >
              <ItemEmoji emoji={item.emoji} name={item.itemName} size="sm" />
              <span className="text-white text-xs font-medium max-w-[80px] truncate">{item.itemName}</span>

              <div className="flex items-center gap-0.5 ml-1">
                <button
                  onClick={() => onQtyChange(item.itemName, -1)}
                  className="w-4 h-4 flex items-center justify-center rounded bg-zinc-700 hover:bg-zinc-600 text-white"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
                <span className="text-white text-xs w-4 text-center">{item.quantity}</span>
                <button
                  onClick={() => onQtyChange(item.itemName, 1)}
                  className="w-4 h-4 flex items-center justify-center rounded bg-zinc-700 hover:bg-zinc-600 text-white"
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>

              <button
                onClick={() => onRemove(item.itemName)}
                className="ml-1 text-zinc-500 hover:text-red-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown trigger */}
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={handleOpen}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-[#111] border border-zinc-800 hover:border-zinc-600 rounded-lg text-left transition-colors"
        >
          <span className="text-zinc-400 text-sm">{placeholder}</span>
          <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute z-50 top-full mt-1 w-full bg-[#111] border border-zinc-700 rounded-xl shadow-2xl overflow-hidden">
            {/* Search input */}
            <div className="p-2 border-b border-zinc-800 flex items-center gap-2">
              <Search className="w-4 h-4 text-zinc-500 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search items..."
                className="flex-1 bg-transparent text-white text-sm placeholder-zinc-500 outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-zinc-500 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Item list */}
            <div className="max-h-52 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-4">No items found</p>
              ) : (
                filtered.map(item => {
                  const alreadySelected = selectedNames.has(item.name);
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        onAdd(item);
                        setQuery("");
                        setOpen(false);
                      }}
                      disabled={alreadySelected}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors
                        ${alreadySelected
                          ? "opacity-40 cursor-not-allowed"
                          : `hover:${accentClass} hover:bg-white/5`
                        }`}
                    >
                      <ItemEmoji emoji={item.emoji} name={item.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${alreadySelected ? "text-zinc-400" : "text-white"}`}>
                          {item.name}
                        </p>
                        {item.category && (
                          <p className="text-xs text-zinc-600 truncate">{item.category}</p>
                        )}
                      </div>
                      {item.value != null && item.value > 0 && (
                        <span className="text-xs text-zinc-500 flex-shrink-0">{item.value.toLocaleString()}</span>
                      )}
                      {alreadySelected && (
                        <span className="text-xs text-zinc-600 flex-shrink-0">Added</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {filtered.length === 60 && !query && (
              <p className="text-xs text-zinc-600 text-center py-2 border-t border-zinc-800">
                Type to search all items
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Modal ───────────────────────────────────────────────────────────────

export const CreateTradeAdModal: React.FC<Props> = ({
  items,
  tags,
  onClose,
  onSubmit,
  authorName,
  authorAvatar,
}) => {
  const [offering, setOffering] = useState<TradeAdItem[]>([]);
  const [wanted, setWanted] = useState<TradeAdItem[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = (list: TradeAdItem[], set: React.Dispatch<React.SetStateAction<TradeAdItem[]>>, item: ItemOption) => {
    if (list.some(i => i.itemName === item.name)) return;
    set(prev => [...prev, { itemId: item.name, itemName: item.name, emoji: item.emoji, quantity: 1 }]);
  };

  const removeItem = (set: React.Dispatch<React.SetStateAction<TradeAdItem[]>>, name: string) => {
    set(prev => prev.filter(i => i.itemName !== name));
  };

  const changeQty = (set: React.Dispatch<React.SetStateAction<TradeAdItem[]>>, name: string, delta: number) => {
    set(prev => prev.map(i =>
      i.itemName === name
        ? { ...i, quantity: Math.max(1, Math.min(99, i.quantity + delta)) }
        : i
    ));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const submit = async () => {
    if (offering.length === 0 && wanted.length === 0) {
      setError("Add at least one item to offer or request.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await onSubmit({
      itemsOffering: offering,
      itemsWanted: wanted,
      tags: selectedTags,
      authorName,
      authorAvatar,
      contactInfo: "",
    });

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#0c0c0c] rounded-2xl w-full max-w-xl border border-white/10 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-bold">
            <GradientText variant="gold">Create Trade Ad</GradientText>
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Author preview */}
          <div className="flex items-center gap-2.5 bg-[#111] rounded-lg px-3 py-2.5 border border-white/5">
            {authorAvatar && (
              <img src={authorAvatar} alt={authorName} className="w-8 h-8 rounded-full" />
            )}
            <div>
              <p className="text-white text-sm font-medium">{authorName}</p>
              <p className="text-zinc-500 text-xs">Posting as</p>
            </div>
          </div>

          {/* Offering */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <GradientText variant="gold" className="text-sm font-semibold">Offering</GradientText>
              {offering.length > 0 && (
                <span className="ml-auto text-xs text-zinc-500">{offering.length} item{offering.length !== 1 ? "s" : ""}</span>
              )}
            </div>
            <ItemPicker
              items={items}
              selected={offering}
              onAdd={item => addItem(offering, setOffering, item)}
              onRemove={name => removeItem(setOffering, name)}
              onQtyChange={(name, delta) => changeQty(setOffering, name, delta)}
              placeholder="Add items you're offering..."
              accentClass="text-yellow-400"
            />
          </div>

          {/* Divider with arrow */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/5" />
            <div className="text-zinc-600 text-xs font-medium tracking-widest">FOR</div>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Wanted */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <GradientText variant="blue" className="text-sm font-semibold">Looking For</GradientText>
              {wanted.length > 0 && (
                <span className="ml-auto text-xs text-zinc-500">{wanted.length} item{wanted.length !== 1 ? "s" : ""}</span>
              )}
            </div>
            <ItemPicker
              items={items}
              selected={wanted}
              onAdd={item => addItem(wanted, setWanted, item)}
              onRemove={name => removeItem(setWanted, name)}
              onQtyChange={(name, delta) => changeQty(setWanted, name, delta)}
              placeholder="Add items you want..."
              accentClass="text-blue-400"
            />
          </div>

          {/* Tags */}
          <div>
            <p className="text-zinc-400 text-sm font-medium mb-2">Tags <span className="text-zinc-600 text-xs">(optional)</span></p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                    selectedTags.includes(tag)
                      ? "bg-yellow-700/30 border-yellow-600/50 text-yellow-300"
                      : "bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-950/40 border border-red-800/40 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-white/5 bg-[#0a0a0a]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-5 py-2 text-sm bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors"
          >
            {loading ? "Posting..." : "Post Ad"}
          </button>
        </div>

      </div>
    </div>
  );
};
