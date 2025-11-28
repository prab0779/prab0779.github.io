import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Item } from "../types/Item";

interface ItemCardProps {
  item: Item;
  mode: "regular" | "permanent"; // global mode
  vizardValue: number; // Vizard Mask value
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, mode, vizardValue }) => {
  const [modeState, setModeState] = useState<"regular" | "permanent">(mode);

  useEffect(() => {
    setModeState(mode);
  }, [mode]);

  // Demand colors
  const getDemandColor = (d: number) =>
    d <= 3 ? "text-red-400" : d <= 6 ? "text-yellow-400" : "text-green-400";

  const getDemandBarColor = (d: number) =>
    d <= 3 ? "bg-red-400" : d <= 6 ? "bg-yellow-400" : "bg-green-400";

  // Trend handling
  const getRateIcon = (r: string) =>
    r === "Rising" ? (
      <TrendingUp className="w-4 h-4 text-green-400" />
    ) : r === "Falling" ? (
      <TrendingDown className="w-4 h-4 text-red-400" />
    ) : (
      <Minus className="w-4 h-4 text-gray-400" />
    );

  const getRateColor = (r: string) =>
    r === "Rising"
      ? "text-green-400"
      : r === "Falling"
      ? "text-red-400"
      : "text-yellow-400";

  // Status (Obtainable / Unobtainable)
  const getStatusColor = (s: string) =>
    s === "Unobtainable"
      ? "bg-red-900/70 text-red-200 border-red-700"
      : s === "Limited"
      ? "bg-yellow-900/70 text-yellow-200 border-yellow-700"
      : "bg-green-900/70 text-green-200 border-green-700";

  // Tax (gold or gems)
  const tax = item.gemTax
    ? { label: "Gem Tax", icon: "💎", value: item.gemTax, color: "text-purple-300" }
    : item.goldTax
    ? { label: "Gold Tax", icon: "🪙", value: item.goldTax, color: "text-yellow-300" }
    : { label: "Tax", icon: "💰", value: 0, color: "text-gray-300" };

  const renderIcon = (emoji: string) => {
    if (!emoji || typeof emoji !== "string") return <span className="text-6xl">👹</span>;

    if (emoji.startsWith("/"))
      return <img src={emoji} className="w-28 h-28 mx-auto object-contain pixelated" />;

    return <span className="text-6xl">{emoji}</span>;
  };

  // Final Values
const keysValue = item.value;

const vizardConverted =
  vizardValue > 0 ? (item.value / vizardValue) : 0;

// Formatter for Keys Mode
const formatKeyValue = (v: number) => {
  if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(2) + "B";
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(0) + "M";
  return v.toLocaleString();
};

// Formatter for Vizard Mode (no B/M — clean numbers)
const formatVizardValue = (v: number) => {
  if (!v || v <= 0) return "0";
  return v % 1 === 0 ? v.toString() : v.toFixed(2); // remove .00
};


  return (
    <div className="bg-[#06060A] rounded-2xl border border-gray-800 p-5 shadow-xl hover:border-blue-500 transition-all flex flex-col">

      {/* ITEM NAME + STATUS */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-white font-bold text-lg">{item.name}</h2>
      </div>

      {/* ICON */}
      <div className="flex justify-center mb-4">
        {renderIcon(item.emoji)}
      </div>

      {/* MODE SWITCHER (Keys / Vizard) */}
      <div className="flex bg-gray-900 border border-gray-800 rounded-full w-max mx-auto mb-4">
        <button
          onClick={() => setModeState("regular")}
          className={`px-3 py-1 text-xs rounded-full ${
            modeState === "regular" ? "bg-blue-600 text-white" : "text-gray-300"
          }`}
        >
          Key
        </button>

        <button
          onClick={() => setModeState("permanent")}
          className={`px-3 py-1 text-xs rounded-full ${
            modeState === "permanent" ? "bg-blue-600 text-white" : "text-gray-300"
          }`}
        >
          Vizard
        </button>
      </div>

      {/* Stats - CLEAN COSMIC STYLE */}
<div className="bg-black/40 rounded-xl p-4 space-y-3 border border-gray-800">

  {/* VALUE */}
<div className="flex justify-between text-sm">
  <span className="text-gray-300 font-medium">Value</span>

  {modeState === "regular" ? (
    <span className="text-white font-bold">
      {formatKeyValue(keysValue)}
    </span>
  ) : (
    <span className="text-purple-300 font-bold">
      {formatVizardValue(vizardConverted)}
    </span>
  )}
</div>


  {/* TREND */}
  <div className="flex justify-between text-sm">
    <span className="text-gray-300 font-medium">Trend</span>
    <span className={`font-bold ${getRateColor(item.rateOfChange)}`}>
      {item.rateOfChange}
    </span>
  </div>

  {/* DEMAND */}
  <div className="flex justify-between text-sm">
    <span className="text-gray-300 font-medium">Demand</span>
    <span className={`font-bold ${getDemandColor(item.demand)}`}>
      {item.demand}/10
    </span>
  </div>

  {/* TAX */}
  <div className="flex justify-between text-sm">
    <span className="text-gray-300 font-medium">{tax.label}</span>
    <span className={`font-bold ${tax.color}`}>
      {tax.value > 0 ? `${tax.icon} ${tax.value.toLocaleString()}` : "None"}
    </span>
  </div>

  {/* PRESTIGE */}
  <div className="flex justify-between text-sm">
    <span className="text-gray-300 font-medium">Prestige</span>
    <span className="text-purple-300 font-bold">
      {item.prestige}
    </span>
  </div>

</div>

    </div>
  );
}; 
