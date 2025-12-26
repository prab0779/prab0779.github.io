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
    if (type === "sent") setItemsSent((p) => [...p, tradeItem]);
    else setItemsReceived((p) => [...p, tradeItem]);
  };

  const removeItem = (index: number, type: "sent" | "received") => {
    if (type === "sent") setItemsSent((p) => p.filter((_, i) => i !== index));
    else setItemsReceived((p) => p.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number, type: "sent" | "received") => {
    const q = Math.min(999, Math.max(1, quantity));
    if (type === "sent") setItemsSent((p) => p.map((t, i) => (i === index ? { ...t, quantity: q } : t)));
    else setItemsReceived((p) => p.map((t, i) => (i === index ? { ...t, quantity: q } : t)));
  };

  const calculation: TradeCalculation = useMemo(() => {
    const totalValueSent = itemsSent.reduce((t, { item, quantity }) => t + item.value * quantity, 0);
    const totalValueReceived = itemsReceived.reduce((t, { item, quantity }) => t + item.value * quantity, 0);
    return {
      itemsSent,
      itemsReceived,
      totalValueSent,
      totalValueReceived,
      totalGemTax: 0,
      totalGoldTax: 0,
      netGainLoss: totalValueReceived - totalValueSent,
      sentGemTax: 0,
      sentGoldTax: 0,
      receivedGemTax: 0,
      receivedGoldTax: 0,
    };
  }, [itemsSent, itemsReceived]);

  const diff = calculation.netGainLoss;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-white">

      <h1 className="text-center text-4xl font-bold text-gold-bright mb-6">
        AoTR Trade Calculator
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {(["sent","received"] as const).map((side) => {
          const selected = side === "sent" ? itemsSent : itemsReceived;
          const open = side === "sent" ? () => setShowSentModal(true) : () => setShowReceivedModal(true);

          return (
            <div
              key={side}
              className="rounded-2xl bg-zinc-950 border border-zinc-800 p-5 shadow-xl"
            >
              <div className="flex justify-between mb-4">
                <div className="font-semibold">
                  {side === "sent" ? "You're giving" : "You're getting"}
                </div>
                <button
                  onClick={open}
                  className="px-3 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-sm hover:bg-zinc-800"
                >
                  Add
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 9 }).map((_, idx) => {
                  if (idx === 4)
                    return (
                      <button
                        key={idx}
                        onClick={open}
                        className="aspect-square rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center"
                      >
                        <Plus className="w-6 h-6 text-zinc-400" />
                      </button>
                    );

                  const mapIndex = idx < 4 ? idx : idx - 1;
                  const tradeItem = selected[mapIndex];

                  return (
                    <div
                      key={idx}
                      className="aspect-square rounded-xl border border-zinc-800 bg-zinc-900 relative flex items-center justify-center"
                    >
                      {tradeItem && (
                        <>
                          <button
                            onClick={() => removeItem(mapIndex, side)}
                            className="absolute top-1 right-1 text-zinc-400 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <span className="text-xs text-center px-2">
                            {tradeItem.item.name}
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-zinc-400">Value Difference</span>
          <span className={`font-bold ${diff > 0 ? "text-emerald-400" : diff < 0 ? "text-red-400" : "text-zinc-400"}`}>
            {diff}
          </span>
        </div>

        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className={`h-full ${diff >= 0 ? "bg-emerald-600" : "bg-red-600"}`}
            style={{ width: `${Math.min(100, Math.abs(diff) * 10)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
