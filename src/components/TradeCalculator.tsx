import React, { useMemo, useState } from "react";
import { Plus, X, Search } from "lucide-react";
import { Item, TradeItem, TradeCalculation } from "../types/Item";
import GradientText from "../Shared/GradientText";
import { getItemImageUrl } from "../lib/supabase";
import { AdBanner } from "./AdBanner";

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
      setItemsReceived((prev) =>
        prev.map((t, i) => (i === index ? { ...t, quantity: q } : t))
      );
    }
  };

  const calculation: TradeCalculation = useMemo(() => {
    const totalValueSent = itemsSent.reduce((t, { item, quantity }) => t + item.value * quantity, 0);
    const totalValueReceived = itemsReceived.reduce(
      (t, { item, quantity }) => t + item.value * quantity,
      0
    );

    const sentGemTax = itemsSent.reduce((t, { item, quantity }) => t + (item.gemTax || 0) * quantity, 0);
    const sentGoldTax = itemsSent.reduce((t, { item, quantity }) => t + (item.goldTax || 0) * quantity, 0);

    const receivedGemTax = itemsReceived.reduce(
      (t, { item, quantity }) => t + (item.gemTax || 0) * quantity,
      0
    );
    const receivedGoldTax = itemsReceived.reduce(
      (t, { item, quantity }) => t + (item.goldTax || 0) * quantity,
      0
    );

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

    if (emoji.startsWith("/") || emoji.startsWith("./") || emoji.startsWith("http")) {
      return (
        <img
          src={getItemImageUrl(emoji)}
          alt={itemName}
          className="w-full h-full object-contain"
          style={{ imageRendering: "pixelated" as any }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      );
    }

    return <span className="text-4xl leading-none">{emoji}</span>;
  };

  const diff = calculation.totalValueReceived - calculation.totalValueSent;
  const hasTrade = calculation.totalValueSent > 0 || calculation.totalValueReceived > 0;

  const tradeLabel = !hasTrade
    ? ""
    : diff === 0
    ? "FAIR TRADE"
    : diff > 0
    ? "YOU WIN"
    : "YOU LOSE";

  const maxSpan = Math.max(1, Math.max(calculation.totalValueSent, calculation.totalValueReceived));
  const normalized = hasTrade ? diff / maxSpan : 0;
  const pct = Math.max(0, Math.min(100, 50 + normalized * 50));

  const StatusPill = () => {
    if (!tradeLabel) return null;

    const styles =
      tradeLabel === "FAIR TRADE"
        ? "bg-emerald-900/40 text-emerald-300 border-emerald-700/40"
        : tradeLabel === "YOU WIN"
        ? "bg-emerald-800/30 text-emerald-200 border-emerald-700/30"
        : "bg-red-900/50 text-red-300 border-red-800/40";

    return (
      <div
        className={`w-full text-center py-3 font-semibold tracking-wide border ${styles}`}
        style={{ borderLeft: "none", borderRight: "none" }}
      >
        <span className="inline-flex items-center gap-2 justify-center">
          {tradeLabel}
        </span>
      </div>
    );
  };

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
        <div
          className="w-full max-w-lg rounded-2xl border bg-zinc-950 shadow-2xl"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <h3 className="text-white font-semibold text-lg">{title}</h3>
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
                className="w-full rounded-xl bg-zinc-900/60 border border-zinc-800 pl-10 pr-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2"
                style={{ boxShadow: "none", outline: "none" }}
              />
            </div>

            <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
              {filtered.map((it) => (
                <button
                  key={it.id}
                  onClick={() => onSelect(it)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70 px-3 py-3 flex items-center gap-3 transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-black/40 border border-zinc-800 flex items-center justify-center overflow-hidden">
                    {renderItemIcon(it.emoji, it.name)}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-white font-medium leading-tight">{it.name}</div>
                    <div className="text-xs text-zinc-400">{it.category}</div>
                  </div>
                  <div className="font-semibold" style={{ color: "var(--gold-bright)" }}>
                    {it.value}
                  </div>
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

  const Side: React.FC<{ side: "sent" | "received" }> = ({ side }) => {
    const selected = side === "sent" ? itemsSent : itemsReceived;
    const openModal = () => (side === "sent" ? setShowSentModal(true) : setShowReceivedModal(true));

    const value = side === "sent" ? calculation.totalValueSent : calculation.totalValueReceived;
    const gemTax = side === "sent" ? calculation.sentGemTax : calculation.receivedGemTax;
    const goldTax = side === "sent" ? calculation.sentGoldTax : calculation.receivedGoldTax;

    return (
      <div
        className="rounded-2xl bg-black/30 p-4 sm:p-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 9 }, (_, idx) => {
            if (idx === 4) {
              return (
                <button
                  key={idx}
                  onClick={openModal}
                  className="aspect-square rounded-xl bg-zinc-950/40 hover:bg-zinc-950/55 transition flex items-center justify-center"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  title="Add item"
                >
                  <Plus className="w-7 h-7" style={{ color: "var(--gold-bright)" }} />
                </button>
              );
            }

            const mapIndex = idx < 4 ? idx : idx - 1;
            const tradeItem = selected[mapIndex];

            return (
              <div
                key={idx}
                className="aspect-square rounded-xl bg-zinc-950/35 hover:bg-zinc-950/45 transition relative overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {tradeItem ? (
                  <>
                    <button
                      onClick={() => removeItem(mapIndex, side)}
                      className="absolute top-1 right-1 z-10 rounded-md bg-black/60 p-0.5 sm:p-1 text-zinc-200 hover:text-white transition"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                      title="Remove"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>

                    <div className="h-full w-full p-1.5 sm:p-3 flex flex-col items-center justify-between">
                      <div className="w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden">
                        <div className="w-9 h-9 sm:w-16 sm:h-16">
                          {renderItemIcon(tradeItem.item.emoji, tradeItem.item.name)}
                        </div>
                      </div>

                      <div className="w-full text-center shrink-0">
                        <div className="text-[9px] sm:text-xs text-white/90 font-semibold leading-tight line-clamp-1">
                          {tradeItem.item.name}
                        </div>

                        <div className="mt-0.5 flex items-center justify-center gap-0.5 sm:gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(mapIndex, tradeItem.quantity - 1, side);
                            }}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-zinc-900/70 border border-zinc-800 text-white hover:bg-zinc-800 transition text-xs"
                            disabled={tradeItem.quantity <= 1}
                            title="Decrease"
                          >
                            -
                          </button>

                          <input
                            type="number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            min={1}
                            max={999}
                            value={tradeItem.quantity}
                            onChange={(e) =>
                              updateQuantity(mapIndex, parseInt(e.target.value) || 1, side)
                            }
                            className="no-arrows w-7 sm:w-10 h-5 sm:h-6 rounded bg-zinc-900/70 border border-zinc-800 text-white text-center text-[10px] sm:text-xs focus:outline-none"
                            style={{ boxShadow: "none" }}
                          />

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(mapIndex, tradeItem.quantity + 1, side);
                            }}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-zinc-900/70 border border-zinc-800 text-white hover:bg-zinc-800 transition text-xs"
                            disabled={tradeItem.quantity >= 999}
                            title="Increase"
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

        {/* totals */}
        <div
          className="mt-5 rounded-xl bg-black/25 px-4 py-3"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center justify-between text-sm">
            <GradientText variant="gold" className="font-semibold">Value:</GradientText>
            <span className="text-white font-semibold">{value.toLocaleString()}</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-sm">
            <GradientText variant="silver" className="font-medium">Gem Tax:</GradientText>
            <span className="text-zinc-100">{gemTax.toLocaleString()}</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-sm">
            <GradientText variant="silver" className="font-medium">Gold Tax:</GradientText>
            <span className="text-zinc-100">{goldTax.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  };

  const percentText = hasTrade && maxSpan ? ((diff / maxSpan) * 100).toFixed(1) : "0.0";

  return (
    <div className="max-w-6xl mx-auto px-4 py-14 mt-12">
      <div className="text-center mb-6 mt-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          <GradientText variant="gold">AoTR Trade Calculator</GradientText>
        </h1>

        <p className="mt-3 text-sm sm:text-base">
          <GradientText variant="silver">
            Build a trade on both sides and instantly see value + tax difference.
          </GradientText>
        </p>
      </div>

      <div className="mb-6">
        <StatusPill />
      </div>

      {/* Main board */}
      <div
        className="rounded-2xl overflow-hidden bg-black/15 shadow-2xl"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div
            className="p-5 sm:p-6"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", borderRight: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Side side="sent" />
          </div>
          <div className="p-5 sm:p-6">
            <Side side="received" />
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="p-5 sm:p-6 bg-black/20"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-zinc-300 font-medium">Value Difference:</span>
              <span
                className="px-3 py-1 rounded-lg font-semibold text-sm"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  background:
                    diff === 0
                      ? "rgba(16,185,129,0.12)"
                      : diff > 0
                      ? "rgba(16,185,129,0.08)"
                      : "rgba(239,68,68,0.08)",
                  color:
                    diff === 0 ? "rgb(167 243 208)" : diff > 0 ? "rgb(187 247 208)" : "rgb(254 202 202)",
                }}
              >
                {diff.toLocaleString()} ({percentText}%)
              </span>
            </div>

            <button
              onClick={resetAll}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition"
              style={{
                background: "rgba(127,29,29,0.55)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "white",
              }}
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          </div>

          <div
            className="relative h-2 rounded-full overflow-hidden"
            style={{ background: "#1a1a1a" }}
          >
            <div className="absolute inset-0 bg-red-600" />
            <div
              className="absolute top-0 left-0 h-full bg-green-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Ad below the trade board */}
      <div className="flex justify-center mt-10">
        <AdBanner slot="leaderboard" />
      </div>

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
