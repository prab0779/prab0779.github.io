import React, { useMemo, useState } from "react";
import { Plus, X, Search, RotateCcw, ArrowRightLeft } from "lucide-react";
import { Item, TradeItem, TradeCalculation } from "../types/Item";

interface TradeCalculatorProps {
  items: Item[];
}

export const TradeCalculator: React.FC<TradeCalculatorProps> = ({ items }) => {
  const [itemsSent, setItemsSent] = useState<TradeItem[]>([]);
  const [itemsReceived, setItemsReceived] = useState<TradeItem[]>([]);
  const [showSentModal, setShowSentModal] = useState(false);
  const [showReceivedModal, setShowReceivedModal] = useState(false);

  const addItem = (item: Item, type: "sent" | "received") => {
    const tradeItem: TradeItem = { item, quantity: 1 };
    if (type === "sent") {
      setItemsSent((prev) => [...prev, tradeItem]);
      setShowSentModal(false);
    } else {
      setItemsReceived((prev) => [...prev, tradeItem]);
      setShowReceivedModal(false);
    }
  };

  const removeItem = (index: number, type: "sent" | "received") => {
    if (type === "sent") setItemsSent((prev) => prev.filter((_, i) => i !== index));
    else setItemsReceived((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number, type: "sent" | "received") => {
    const q = Math.min(999, Math.max(1, quantity));
    if (type === "sent") {
      setItemsSent((prev) => prev.map((t, i) => (i === index ? { ...t, quantity: q } : t)));
    } else {
      setItemsReceived((prev) => prev.map((t, i) => (i === index ? { ...t, quantity: q } : t)));
    }
  };

  const calculation: TradeCalculation = useMemo(() => {
    const totalValueSent = itemsSent.reduce((t, { item, quantity }) => t + item.value * quantity, 0);
    const totalValueReceived = itemsReceived.reduce((t, { item, quantity }) => t + item.value * quantity, 0);

    const sentGemTax = itemsSent.reduce((t, { item, quantity }) => t + (item.gemTax || 0) * quantity, 0);
    const sentGoldTax = itemsSent.reduce((t, { item, quantity }) => t + (item.goldTax || 0) * quantity, 0);

    const receivedGemTax = itemsReceived.reduce((t, { item, quantity }) => t + (item.gemTax || 0) * quantity, 0);
    const receivedGoldTax = itemsReceived.reduce((t, { item, quantity }) => t + (item.goldTax || 0) * quantity, 0);

    const totalGemTax = receivedGemTax - sentGemTax;
    const totalGoldTax = receivedGoldTax - sentGoldTax;

    return {
      itemsSent,
      itemsReceived,
      totalValueSent,
      totalValueReceived,
      totalGemTax,
      totalGoldTax,
      netGainLoss: totalValueReceived - totalValueSent,
      sentGemTax,
      sentGoldTax,
      receivedGemTax,
      receivedGoldTax,
    };
  }, [itemsSent, itemsReceived]);

  const resetAll = () => {
    setItemsSent([]);
    setItemsReceived([]);
  };

  const renderItemIcon = (emoji: string, itemName: string) => {
    if (!emoji || typeof emoji !== "string") return <span className="text-4xl leading-none">👹</span>;
    if (emoji.startsWith("/") || emoji.startsWith("./")) {
      const src = emoji.startsWith("./") ? emoji.slice(2) : emoji;
      return (
        <img
          src={src}
          alt={itemName}
          className="w-full h-full object-contain"
          style={{ imageRendering: "pixelated" as any }}
          onError={(e) => {
            const t = e.target as HTMLImageElement;
            t.style.display = "none";
          }}
        />
      );
    }
    return <span className="text-4xl leading-none">{emoji}</span>;
  };

  // ====== status math ======
  const hasTrade = calculation.totalValueSent > 0 || calculation.totalValueReceived > 0;
  const diff = calculation.totalValueReceived - calculation.totalValueSent;

  const maxSpan = Math.max(1, Math.max(calculation.totalValueSent, calculation.totalValueReceived));
  const percent = hasTrade ? (diff / maxSpan) * 100 : 0;

  const status =
    !hasTrade ? "NO TRADE" : Math.abs(percent) < 2 ? "FAIR" : percent > 0 ? "WIN" : "LOSE";

  const statusStyles =
    status === "FAIR"
      ? "border-emerald-700/40 bg-emerald-950/30 text-emerald-200"
      : status === "WIN"
      ? "border-emerald-700/30 bg-emerald-950/20 text-emerald-200"
      : status === "LOSE"
      ? "border-red-700/35 bg-red-950/20 text-red-200"
      : "border-zinc-700/40 bg-zinc-950/30 text-zinc-200";

  const barPos = Math.max(0, Math.min(100, 50 + (diff / maxSpan) * 50)); // 0..100 center 50

  // ======= Searchable modal =======
  const ItemModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSelect: (item: Item) => void;
    title: string;
  }> = ({ isOpen, onClose, onSelect, title }) => {
    const [searchTerm, setSearchTerm] = useState("");

    if (!isOpen) return null;

    const filtered = items
      .filter((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => b.value - a.value);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h3 className="text-white font-bold text-lg">{title}</h3>
            <button onClick={onClose} className="text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search items..."
                className="w-full rounded-xl bg-zinc-900/60 border border-zinc-700 pl-10 pr-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
              {filtered.map((it) => (
                <button
                  key={it.id}
                  onClick={() => onSelect(it)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70 px-3 py-3 flex items-center gap-3 transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-black/40 border border-zinc-700 flex items-center justify-center overflow-hidden">
                    {renderItemIcon(it.emoji, it.name)}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-white font-semibold leading-tight">{it.name}</div>
                    <div className="text-xs text-zinc-400">{it.category}</div>
                  </div>
                  <div className="text-amber-300 font-bold">🔑 {it.value}</div>
                </button>
              ))}

              {filtered.length === 0 && (
                <div className="text-center text-zinc-400 py-8">No items found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ======= Slot card =======
  const SlotCard: React.FC<{
    tradeItem?: TradeItem;
    onRemove?: () => void;
    onQty?: (q: number) => void;
  }> = ({ tradeItem, onRemove, onQty }) => {
    return (
      <div
        className={[
          "relative aspect-square rounded-2xl border overflow-hidden",
          "bg-gradient-to-b from-black/40 to-black/20",
          "border-amber-700/20",
          tradeItem ? "hover:border-amber-600/40" : "hover:border-zinc-700/50",
          "transition",
        ].join(" ")}
      >
        {/* subtle corner glow */}
        <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-amber-500/10 blur-2xl" />

        {tradeItem ? (
          <>
            <button
              onClick={onRemove}
              className="absolute top-2 right-2 z-10 rounded-lg bg-black/60 border border-zinc-700/60 p-1 text-zinc-200 hover:text-white"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="h-full w-full p-3 flex flex-col">
              <div className="flex-1 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20">{renderItemIcon(tradeItem.item.emoji, tradeItem.item.name)}</div>
              </div>

              {/* footer strip */}
              <div className="mt-2 rounded-xl border border-zinc-800 bg-zinc-950/40 px-2 py-2">
                <div className="text-[11px] sm:text-xs text-white font-semibold line-clamp-1">
                  {tradeItem.item.name}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400">x</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQty?.(tradeItem.quantity - 1);
                      }}
                      className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 disabled:opacity-40"
                      disabled={tradeItem.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={999}
                      value={tradeItem.quantity}
                      onChange={(e) => onQty?.(parseInt(e.target.value) || 1)}
                      className="w-12 h-6 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-center text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQty?.(tradeItem.quantity + 1);
                      }}
                      className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 disabled:opacity-40"
                      disabled={tradeItem.quantity >= 999}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full w-full" />
        )}
      </div>
    );
  };

  // ======= Side panel =======
  const Side: React.FC<{ side: "sent" | "received" }> = ({ side }) => {
    const selected = side === "sent" ? itemsSent : itemsReceived;
    const open = () => (side === "sent" ? setShowSentModal(true) : setShowReceivedModal(true));

    const value = side === "sent" ? calculation.totalValueSent : calculation.totalValueReceived;
    const gemTax = side === "sent" ? calculation.sentGemTax : calculation.receivedGemTax;

    const title = side === "sent" ? "You Offer" : "You Receive";
    const accent = side === "sent" ? "text-red-200" : "text-emerald-200";
    const sub = side === "sent" ? "Items you’re giving" : "Items you’re getting";

    // 3x3: first tile is Add (different from screenshot)
    const tiles = Array.from({ length: 9 }, (_, i) => {
      if (i === 0) {
        return (
          <button
            key="add"
            onClick={open}
            className="aspect-square rounded-2xl border border-amber-700/25 bg-amber-500/5 hover:bg-amber-500/10 transition flex flex-col items-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-2xl border border-amber-600/30 bg-black/40 flex items-center justify-center">
              <Plus className="w-5 h-5 text-amber-200" />
            </div>
            <span className="text-xs text-amber-100/90 font-semibold">Add Item</span>
          </button>
        );
      }

      const tradeItem = selected[i - 1];
      return (
        <SlotCard
          key={i}
          tradeItem={tradeItem}
          onRemove={() => removeItem(i - 1, side)}
          onQty={(q) => updateQuantity(i - 1, q, side)}
        />
      );
    });

    return (
      <div className="rounded-3xl border border-zinc-800 bg-black/30 p-5 sm:p-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className={`text-lg sm:text-xl font-extrabold ${accent}`}>{title}</div>
            <div className="text-xs text-zinc-400">{sub}</div>
          </div>

          <div className="text-right">
            <div className="text-xs text-zinc-400">🔑 Value</div>
            <div className="text-amber-200 font-extrabold text-lg">{value.toLocaleString()}</div>
            <div className="text-xs text-zinc-400 mt-1">💎 Gem Tax</div>
            <div className="text-zinc-200 font-semibold">{gemTax.toLocaleString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">{tiles}</div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header (different structure) */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
        <div>
          <div className="text-xs text-zinc-400 tracking-widest uppercase">
            AOTR • Trading Tools
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Trade Calculator
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Build a trade, compare values, and see net tax instantly.
          </p>
        </div>

        <div className={`rounded-2xl border px-4 py-3 ${statusStyles}`}>
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 opacity-80" />
            <div className="font-extrabold tracking-wide">{status}</div>
          </div>
          <div className="text-xs opacity-80 mt-1">
            {hasTrade ? `${percent > 0 ? "+" : ""}${percent.toFixed(1)}% swing` : "Add items to start"}
          </div>
        </div>
      </div>

      {/* Main layout (different spacing + separators) */}
      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-black/35 to-black/10 p-5 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          <Side side="sent" />
          <Side side="received" />
        </div>

        {/* Bottom summary (different from screenshot) */}
        <div className="mt-6 rounded-3xl border border-zinc-800 bg-black/35 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-sm text-zinc-300 font-semibold">Value Difference</div>
              <div
                className={[
                  "px-3 py-1 rounded-xl border text-sm font-bold",
                  diff === 0
                    ? "bg-emerald-950/30 text-emerald-200 border-emerald-700/40"
                    : diff > 0
                    ? "bg-emerald-950/20 text-emerald-200 border-emerald-700/30"
                    : "bg-red-950/20 text-red-200 border-red-700/35",
                ].join(" ")}
              >
                {diff > 0 ? "+" : ""}
                {diff.toLocaleString()}
              </div>
            </div>

            <button
              onClick={resetAll}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-700 px-4 py-2 text-white font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* Different bar style: slimmer + marker */}
          <div className="mt-4">
            <div className="h-2 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 relative overflow-hidden border border-zinc-800">
              {/* center marker */}
              <div className="absolute left-1/2 top-0 h-full w-[2px] bg-black/55" />
              {/* position marker */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/90 border border-black/30 shadow"
                style={{ left: `calc(${barPos}% - 8px)` }}
                title="Trade balance"
              />
            </div>
            <div className="mt-2 text-xs text-zinc-500 flex justify-between">
              <span>Lose</span>
              <span>Fair</span>
              <span>Win</span>
            </div>
          </div>

          {/* Optional: show net taxes in a unique layout */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="text-xs text-zinc-400 mb-1">Net Gem Tax</div>
              <div className={`text-lg font-extrabold ${calculation.totalGemTax >= 0 ? "text-amber-200" : "text-emerald-200"}`}>
                {calculation.totalGemTax >= 0
                  ? calculation.totalGemTax.toLocaleString()
                  : `+${Math.abs(calculation.totalGemTax).toLocaleString()} (they owe)`}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
              <div className="text-xs text-zinc-400 mb-1">Net Gold Tax</div>
              <div className={`text-lg font-extrabold ${calculation.totalGoldTax >= 0 ? "text-amber-200" : "text-emerald-200"}`}>
                {calculation.totalGoldTax >= 0
                  ? calculation.totalGoldTax.toLocaleString()
                  : `+${Math.abs(calculation.totalGoldTax).toLocaleString()} (they owe)`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ItemModal
        isOpen={showSentModal}
        onClose={() => setShowSentModal(false)}
        onSelect={(item) => addItem(item, "sent")}
        title="Add item to offer"
      />
      <ItemModal
        isOpen={showReceivedModal}
        onClose={() => setShowReceivedModal(false)}
        onSelect={(item) => addItem(item, "received")}
        title="Add item to receive"
      />
    </div>
  );
};
