import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Item } from "../types/Item";

interface ItemCardProps {
  item: Item;
  mode: "regular" | "permanent";
  vizardValue: number;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, mode, vizardValue }) => {
  const [modeState, setModeState] = useState<"regular" | "permanent">(mode);

  useEffect(() => setModeState(mode), [mode]);

  // VALUE FORMATTERS
  const formatKeyValue = (v: number) => {
    if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(2) + "B";
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(0) + "M";
    return v.toLocaleString();
  };

  const formatVizardValue = (v: number) =>
    !v || v <= 0 ? "0" : v % 1 === 0 ? v.toString() : v.toFixed(2);

  const keysValue = item.value;
  const vizardConverted = vizardValue > 0 ? item.value / vizardValue : 0;

  // COLORS / ICONS
  const getDemandColor = (d: number) =>
    d <= 3 ? "text-red-400" : d <= 6 ? "text-yellow-400" : "text-green-400";

  const getRateColor = (r: string) =>
    r === "Rising"
      ? "text-green-400"
      : r === "Falling"
      ? "text-red-400"
      : "text-yellow-400";

  const getRateIcon = (r: string) =>
    r === "Rising" ? (
      <TrendingUp className="w-4 h-4 text-green-400" />
    ) : r === "Falling" ? (
      <TrendingDown className="w-4 h-4 text-red-400" />
    ) : (
      <Minus className="w-4 h-4 text-gray-400" />
    );

  const getStatusColor = (s: string) =>
    s === "Unobtainable"
      ? "bg-red-900 text-red-200 border-red-700"
      : s === "Limited"
      ? "bg-yellow-900 text-yellow-200 border-yellow-700"
      : "bg-green-900 text-green-200 border-green-700";

  // TAX
  const tax = item.gemTax
    ? { label: "Gem Tax", icon: "💎", value: item.gemTax, color: "text-purple-300" }
    : item.goldTax
    ? { label: "Gold Tax", icon: "🪙", value: item.goldTax, color: "text-yellow-300" }
    : { label: "Tax", icon: "💰", value: 0, color: "text-gray-300" };

  const renderIcon = (emoji: string) =>
    emoji?.startsWith("/") ? (
      <img src={emoji} className="w-32 h-32 mx-auto object-contain pixelated" />
    ) : (
      <span className="text-7xl">{emoji || "👹"}</span>
    );

  return (
    <div className="bg-[#06060A] rounded-2xl border border-gray-800 p-5 shadow-xl hover:border-blue-500 transition-all flex flex-col">

      {/* NAME */}
      <h2 className="text-white font-bold text-lg mb-2">{item.name}</h2>

      {/* ICON + STATUS OVERLAY */}
      <div className="relative flex justify-center mb-5">
        {/* Status Badge */}
        <span
          className={`absolute -top-2 px-3 py-1 text-xs rounded-full border font-semibold ${getStatusColor(
            item.status
          )}`}
        >
          {item.status}
        </span>

        {/* Big Icon */}
        {renderIcon(item.emoji)}
      </div>

      {/* MODE TOGGLE */}
      <div className="flex bg-gray-900 border border-gray-800 rounded-full w-max mx-auto mb-4">
        <button
          onClick={() => setModeState("regular")}
          className={`px-4 py-1 text-xs rounded-full ${
            modeState === "regular" ? "bg-blue-600 text-white" : "text-gray-300"
          }`}
        >
          Key
        </button>

        <button
          onClick={() => setModeState("permanent")}
          className={`px-4 py-1 text-xs rounded-full ${
            modeState === "permanent" ? "bg-blue-600 text-white" : "text-gray-300"
          }`}
        >
          Vizard
        </button>
      </div>

      {/* STATS BOX */}
      <div className="bg-black/40 rounded-xl p-4 space-y-3 border border-gray-800">

        {/* VALUE */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-300 font-medium">Value</span>
          <span
            className={`${modeState === "regular" ? "text-white" : "text-purple-300"} font-bold`}
          >
            {modeState === "regular"
              ? formatKeyValue(keysValue)
              : formatVizardValue(vizardConverted)}
          </span>
        </div>

        {/* TREND */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-300 font-medium">Trend</span>
          <span className={`${getRateColor(item.rateOfChange)} font-bold`}>
            {item.rateOfChange}
          </span>
        </div>

        {/* DEMAND */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-300 font-medium">Demand</span>
          <span className={`${getDemandColor(item.demand)} font-bold`}>
            {item.demand}/10
          </span>
        </div>

        {/* TAX */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-300 font-medium">{tax.label}</span>
          <span className={`${tax.color} font-bold`}>
            {tax.value ? `${tax.icon} ${tax.value.toLocaleString()}` : "None"}
          </span>
        </div>

        {/* PRESTIGE */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-300 font-medium">Prestige</span>
          <span className="text-purple-300 font-bold">{item.prestige}</span>
        </div>
      </div>
    </div>
  );
};
