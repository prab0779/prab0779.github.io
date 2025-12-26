import React, { useMemo, useState } from "react";
import { Plus, X, Search } from "lucide-react";
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

  // ======= UI helpers =======
  const resetAll = () => {
    setItemsSent([]);
    setItemsReceived([]);
  };

  const renderItemIcon = (emoji: string, itemName: string) => {
    if (!emoji || typeof emoji !== "string") return <span className="text-4xl leading-none">👹</span>;
    if (emoji.startsWith("/") || emoji.startsWith("./")) {
      const src = emoji.startsWith("./") ? emoji.slice(2) : emoji; // keep leading /
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

  const diff = calculation.totalValueReceived - calculation.totalValueSent;
  const hasTrade = calculation.totalValueSent > 0 || calculation.totalValueReceived > 0;

  // Fairness label
  const tradeLabel = !hasTrade
    ? "—"
    : Math.abs(diff) === 0
    ? "FAIR TRADE"
    : diff > 0
    ? "YOU WIN"
    : "YOU LOSE";

  // progress bar: 0..100, center at 50
  const maxSpan = Math.max(1, Math.max(calculation.totalValueSent, calculation.totalValueReceived));
  const normalized = hasTrade ? (diff / maxSpan) : 0; // -1..+1-ish
  const pct = Math.max(0, Math.min(100, 50 + normalized * 50)); // center 50

  const StatusPill = () => {
    const cls =
      tradeLabel === "FAIR TRADE"
        ? "bg-emerald-900/40 text-emerald-300 border-emerald-700/60"
        : tradeLabel === "YOU WIN"
        ? "bg-emerald-900/25 text-emerald-200 border-emerald-700/50"
        : tradeLabel === "YOU LOSE"
        ? "bg-red-900/25 text-red-200 border-red-700/50"
        : "bg-zinc-900/40 text-zinc-300 border-zinc-700/60";

    return (
      <div className={`w-full rounded-xl border px-4 py-3 text-center font-bold tracking-wide ${cls}`}>
        <span className="inline-flex items-center gap-2">
          <span className="text-sm sm:text-base">●</span>
          <span className="text-sm sm:text-base">{tradeLabel}</span>
        </span>
      </div>
    );
  };

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
        <div className="w-full max-w-lg rounded-2xl border border-yellow-700/40 bg-zinc-950 shadow-2xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-yellow-700/20">
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
                className="w-full rounded-xl bg-zinc-900/60 border border-zinc-700 pl-10 pr-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-600"
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
                  <div className="text-yellow-300 font-bold">🔑 {it.value}</div>
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

  // ======= 3x3 side grid =======
  const Side: React.FC<{
    side: "sent" | "received";
  }> = ({ side }) => {
    const selected = side === "sent" ? itemsSent : itemsReceived;
    const openModal = () => (side === "sent" ? setShowSentModal(true) : setShowReceivedModal(true));

    const value = side === "sent" ? calculation.totalValueSent : calculation.totalValueReceived;
    const gemTax = side === "sent" ? calculation.sentGemTax : calculation.receivedGemTax;
    const goldTax = side === "sent" ? calculation.sentGoldTax : calculation.receivedGoldTax;

    return (
      <div className="rounded-2xl border border-yellow-700/25 bg-black/35 shadow-[0_0_0_1px_rgba(0,0,0,0.4),0_20px_60px_rgba(0,0,0,0.6)] p-4 sm:p-5">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {/* 3x3 slots, plus button is slot 2 like the screenshot */}
          {Array.from({ length: 9 }, (_, idx) => {
            if (idx === 1) {
              return (
                <button
                  key={idx}
                  onClick={openModal}
                  className="aspect-square rounded-xl border border-yellow-700/30 bg-black/25 hover:bg-black/40 transition flex items-center justify-center"
                  title="Add item"
                >
                  <Plus className="w-7 h-7 text-yellow-300/90" />
                </button>
              );
            }

            // map to selected items: skip the plus slot
            const mapIndex = idx < 1 ? idx : idx - 1;
            const tradeItem = selected[mapIndex];

            return (
              <div
                key={idx}
                className="aspect-square rounded-xl border border-yellow-700/20 bg-black/25 hover:bg-black/35 transition relative overflow-hidden"
              >
                {tradeItem ? (
                  <>
                    <button
                      onClick={() => removeItem(mapIndex, side)}
                      className="absolute top-2 right-2 z-10 rounded-md bg-black/60 border border-yellow-700/25 p-1 text-zinc-200 hover:text-white"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="h-full w-full p-3 flex flex-col items-center justify-between">
                      <div className="w-full flex-1 flex items-center justify-center overflow-hidden">
                        <div className="w-14 h-14 sm:w-16 sm:h-16">
                          {renderItemIcon(tradeItem.item.emoji, tradeItem.item.name)}
                        </div>
                      </div>

                      <div className="w-full text-center">
                        <div className="text-[11px] sm:text-xs text-white/90 font-semibold leading-tight line-clamp-2 min-h-[28px]">
                          {tradeItem.item.name}
                        </div>

                        <div className="mt-1 flex items-center justify-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(mapIndex, tradeItem.quantity - 1, side);
                            }}
                            className="w-6 h-6 rounded bg-zinc-900/70 border border-zinc-700 text-white hover:bg-zinc-800"
                            disabled={tradeItem.quantity <= 1}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={1}
                            max={999}
                            value={tradeItem.quantity}
                            onChange={(e) => updateQuantity(mapIndex, parseInt(e.target.value) || 1, side)}
                            className="no-arrows w-10 h-6 rounded bg-zinc-900/70 border border-zinc-700 text-white text-center text-xs focus:outline-none focus:ring-2 focus:ring-yellow-600"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(mapIndex, tradeItem.quantity + 1, side);
                            }}
                            className="w-6 h-6 rounded bg-zinc-900/70 border border-zinc-700 text-white hover:bg-zinc-800"
                            disabled={tradeItem.quantity >= 999}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full w-full" />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom totals panel like screenshot */}
        <div className="mt-5 rounded-xl border border-yellow-700/20 bg-black/35 px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-yellow-300/90 font-semibold">🔑 Value:</span>
            <span className="text-yellow-200 font-bold">{value.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-zinc-300 font-semibold">💎 Gem Tax:</span>
            <span className="text-zinc-200">{gemTax.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-zinc-300 font-semibold">🪙 Gold Tax:</span>
            <span className="text-zinc-200">{goldTax.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight" style={{ textShadow: "0 6px 20px rgba(0,0,0,0.8)" }}>
          AoTR Trade Calculator
        </h1>

        <div className="mt-3 inline-flex items-center gap-3 rounded-full border border-yellow-700/30 bg-black/30 px-4 py-2">
          <span className="text-yellow-300 font-bold text-sm">⇦</span>
          <span className="text-yellow-200/90 text-xs sm:text-sm font-semibold tracking-wide">
            ATTACK ON TITAN REVOLUTION VALUE CALCULATOR (AOTR)
          </span>
          <span className="text-yellow-300 font-bold text-sm">⇨</span>
        </div>
      </div>

      {/* Status bar */}
      <div className="mb-6">
        <StatusPill />
      </div>

      {/* Main board */}
      <div className="rounded-2xl border border-gold bg-black/25 shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-yellow-700/15">
            <Side side="sent" />
          </div>
          <div className="p-5 sm:p-6">
            <Side side="received" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-yellow-700/15 bg-black/30 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-yellow-200 font-semibold">Value Difference:</span>
              <span
                className={`px-3 py-1 rounded-lg font-bold text-sm border ${
                  diff === 0
                    ? "bg-emerald-900/30 text-emerald-300 border-emerald-700/40"
                    : diff > 0
                    ? "bg-emerald-900/20 text-emerald-200 border-emerald-700/35"
                    : "bg-red-900/20 text-red-200 border-red-700/35"
                }`}
              >
                {diff.toLocaleString()} ({hasTrade && maxSpan ? ((diff / maxSpan) * 100).toFixed(1) : "0.0"}%)
              </span>
            </div>

            <button
              onClick={resetAll}
              className="inline-flex items-center gap-2 rounded-lg bg-red-800/70 hover:bg-red-700 text-white font-semibold px-4 py-2 border border-red-700/40 transition"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* red -> green bar */}
          {/* red -> green bar (center marker) */}
<div className="relative h-3 rounded-full overflow-hidden border border-yellow-700/20 bg-zinc-900">
  {/* base gradient */}
  <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-yellow-500 to-emerald-500" />

  {/* center line */}
  <div className="absolute left-1/2 top-0 h-full w-[2px] bg-black/60" />

  {/* marker */}
  <div
    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-black/60 bg-white/80 shadow"
    style={{ left: `calc(${pct}% - 6px)` }}
  />
</div>

        </div>
      </div>

      {/* Modals */}
      <ItemModal
        isOpen={showSentModal}
        onClose={() => setShowSentModal(false)}
        onSelect={(item) => addItem(item, "sent")}
        title="Select item to send"
      />
      <ItemModal
        isOpen={showReceivedModal}
        onClose={() => setShowReceivedModal(false)}
        onSelect={(item) => addItem(item, "received")}
        title="Select item to receive"
      />
    </div>
  );
};
