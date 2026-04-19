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
    if (!emoji || typeof emoji !== "string") return <span className="text-4xl">👹</span>;
    if (emoji.startsWith("/") || emoji.startsWith("./")) {
      const src = emoji.startsWith("./") ? emoji.slice(2) : emoji;
      return <img src={src} alt={itemName} className="w-full h-full object-contain" />;
    }
    return <span className="text-4xl">{emoji}</span>;
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
      <div className={`w-full text-center py-3 font-semibold border ${styles}`}>
        {tradeLabel}
      </div>
    );
  };

  const ItemModal: React.FC<any> = ({ isOpen, onClose, onSelect, title }) => {
    const [searchTerm, setSearchTerm] = useState("");
    if (!isOpen) return null;

    const filtered = items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70">
        <div className="bg-zinc-950 p-5 rounded-xl w-full max-w-lg">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-4 p-2 bg-zinc-900 text-white"
          />
          {filtered.map(it => (
            <button key={it.id} onClick={() => onSelect(it)} className="block w-full text-left text-white">
              {it.name}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const Side: React.FC<{ side: "sent" | "received" }> = ({ side }) => {
    const selected = side === "sent" ? itemsSent : itemsReceived;
    const openModal = () => (side === "sent" ? setShowSentModal(true) : setShowReceivedModal(true));
    const value = side === "sent" ? calculation.totalValueSent : calculation.totalValueReceived;

    return (
      <div className="p-4">
        <button onClick={openModal}>+</button>
        <div>{value}</div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-20 mt-16">

      <div className="text-center mb-6 mt-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold flex flex-wrap justify-center">
          {"AoTR Trade Calculator".split("").map((c, i) => (
            <span key={i} className="gold-letter">{c === " " ? "\u00A0" : c}</span>
          ))}
        </h1>

        <p className="mt-3 flex flex-wrap justify-center">
          {"Build a trade on both sides and instantly see value + tax difference."
            .split(" ")
            .map((w, i, arr) => (
              <span key={i} className="silver-letter">
                {w}{i < arr.length - 1 && "\u00A0"}
              </span>
            ))}
        </p>
      </div>

      <StatusPill />

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <Side side="sent" />
        <Side side="received" />
      </div>

      <button onClick={resetAll}>Reset</button>

      <ItemModal
        isOpen={showSentModal}
        onClose={() => setShowSentModal(false)}
        onSelect={(item) => addItem(item, "sent")}
      />
      <ItemModal
        isOpen={showReceivedModal}
        onClose={() => setShowReceivedModal(false)}
        onSelect={(item) => addItem(item, "received")}
      />
    </div>
  );
};