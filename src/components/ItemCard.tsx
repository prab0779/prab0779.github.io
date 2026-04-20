import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Item } from "../types/Item";
import CountUp from "../Shared/CountUp";
import BorderGlow from "../Shared/BorderGlow";
import GradientText from "../Shared/GradientText";

interface ItemCardProps {
  item: Item;
  mode: "regular" | "permanent";
  vizardValue: number;
  index?: number;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  mode,
  vizardValue,
  index = 0
}) => {
  const [modeState, setModeState] = useState<"regular" | "permanent">(mode);

  useEffect(() => {
    setModeState(mode);
  }, [mode]);

  const getDemandColor = (d: number) =>
    d <= 3 ? "text-red-400" : d <= 6 ? "text-yellow-400" : "text-green-400";

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

  const tax = item.gemTax
    ? { label: "Gem Tax", value: item.gemTax, color: "text-purple-300" }
    : item.goldTax
    ? { label: "Gold Tax", value: item.goldTax, color: "text-yellow-300" }
    : { label: "Tax", value: 0, color: "text-gray-300" };

  const renderIcon = (emoji: string) => {
    if (!emoji) return <span className="text-6xl">👹</span>;
    if (emoji.startsWith("/")) {
      return (
        <img
          src={emoji}
          className="w-28 h-28 mx-auto object-contain pixelated"
        />
      );
    }
    return <span className="text-6xl">{emoji}</span>;
  };

  const keysValue = item.value;
  const vizardConverted =
    vizardValue > 0
      ? Math.round((item.value / vizardValue) * 100) / 100
      : 0;

  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor="40 80 80"
      backgroundColor="#0c0c0c"
      borderRadius={24}
      glowRadius={40}
      glowIntensity={1}
      coneSpread={25}
      animated={false}
      colors={["#FFD700", "#FFC94D", "#FFB347"]}
    >
      <div className="p-5 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg">
            <GradientText variant="gold">
              {item.name}
            </GradientText>
          </h2>
        </div>

        <div className="flex justify-center mb-4">
          {renderIcon(item.emoji)}
        </div>

        <div className="flex bg-gray-900 border border-gray-800 rounded-full w-max mx-auto mb-4">
          <button
            onClick={() => setModeState("regular")}
            className={`px-3 py-1 text-xs rounded-full ${
              modeState === "regular"
                ? "bg-blue-600 text-white"
                : "text-gray-300"
            }`}
          >
            Key
          </button>

          <button
            onClick={() => setModeState("permanent")}
            className={`px-3 py-1 text-xs rounded-full ${
              modeState === "permanent"
                ? "bg-blue-600 text-white"
                : "text-gray-300"
            }`}
          >
            Vizard
          </button>
        </div>

        <div className="bg-black/40 rounded-xl p-4 space-y-3 border border-gray-800">
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              <GradientText variant="silver">Value</GradientText>
            </span>

            {modeState === "regular" ? (
              <span className="text-white font-bold">
                <CountUp
                  from={0}
                  to={keysValue}
                  duration={1.2}
                  delay={(index % 4) * 0.08}
                  format={(v) => {
                    if (v >= 1_000_000_000)
                      return (v / 1_000_000_000).toFixed(2) + "B";
                    if (v >= 1_000_000)
                      return (v / 1_000_000).toFixed(0) + "M";
                    return v.toLocaleString();
                  }}
                />
              </span>
            ) : (
              <span className="text-purple-300 font-bold">
                <CountUp
                  from={0}
                  to={vizardConverted}
                  duration={1.2}
                  delay={(index % 4) * 0.08}
                  format={(v) => Number(v).toFixed(2)}
                />
              </span>
            )}
          </div>

          <div className="flex justify-between text-sm">
            <span className="font-medium">
              <GradientText variant="silver">Trend</GradientText>
            </span>
            <span
              className={`font-bold flex items-center gap-1 ${getRateColor(
                item.rateOfChange
              )}`}
            >
              {getRateIcon(item.rateOfChange)}
              {item.rateOfChange}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="font-medium">
              <GradientText variant="silver">Demand</GradientText>
            </span>
            <span className={`font-bold ${getDemandColor(item.demand)}`}>
              {item.demand}/10
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="font-medium">
              <GradientText variant="silver">{tax.label}</GradientText>
            </span>
            <span className={`font-bold ${tax.color}`}>
              {tax.value > 0 ? (
                <CountUp
                  from={0}
                  to={tax.value}
                  duration={1}
                  delay={(index % 4) * 0.08 + 0.1}
                  format={(v) => v.toLocaleString()}
                />
              ) : (
                "None"
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="font-medium">
              <GradientText variant="silver">Prestige</GradientText>
            </span>
            <span className="text-purple-300 font-bold">
              {item.prestige}
            </span>
          </div>
        </div>
      </div>
    </BorderGlow>
  );
};