import React, { useState, useMemo, useCallback } from "react";
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

export const ItemCard = React.memo(({
  item,
  mode,
  vizardValue,
  index = 0
}: ItemCardProps) => {
  const [modeState, setModeState] = useState<"regular" | "permanent">(mode);

  const getDemandVariant = useCallback((d: number): "red" | "yellow" | "green" =>
    d <= 3 ? "red" : d <= 6 ? "yellow" : "green", []);

  const getRateIcon = useCallback((r: string) =>
    r === "Rising" ? (
      <TrendingUp className="w-4 h-4 text-green-400" />
    ) : r === "Falling" ? (
      <TrendingDown className="w-4 h-4 text-red-400" />
    ) : (
      <Minus className="w-4 h-4 text-gray-400" />
    ), []);

  const getRateVariant = useCallback((r: string): "green" | "red" | "yellow" =>
    r === "Rising"
      ? "green"
      : r === "Falling"
      ? "red"
      : "yellow", []);

  const tax = useMemo(() => {
    if (item.gemTax) {
      return { label: "Gem Tax", value: item.gemTax, variant: "purple" as const };
    }
    if (item.goldTax) {
      return { label: "Gold Tax", value: item.goldTax, variant: "yellow" as const };
    }
    return { label: "Tax", value: 0, variant: "silver" as const };
  }, [item]);

  const renderIcon = useCallback((emoji: string) => {
    if (!emoji) return <span className="text-6xl">👹</span>;

    if (emoji.startsWith("/")) {
      return (
        <img
          src={emoji}
          loading="lazy"
          decoding="async"
          className="w-28 h-28 mx-auto object-contain pixelated"
        />
      );
    }

    return <span className="text-6xl">{emoji}</span>;
  }, []);

  const keysValue = item.value;

  const vizardConverted = useMemo(() => {
    if (!vizardValue) return 0;
    return Math.round((item.value / vizardValue) * 100) / 100;
  }, [item.value, vizardValue]);

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
                  delay={index < 20 ? (index % 4) * 0.08 : 0}
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
              <span className="font-bold">
                <GradientText variant="purple">
                  <CountUp
                    from={0}
                    to={vizardConverted}
                    duration={1.2}
                    delay={index < 20 ? (index % 4) * 0.08 : 0}
                    format={(v) => Number(v).toFixed(2)}
                  />
                </GradientText>
              </span>
            )}
          </div>

          <div className="flex justify-between text-sm">
            <span className="font-medium">
              <GradientText variant="silver">Trend</GradientText>
            </span>
            <span className="font-bold flex items-center gap-1">
              {getRateIcon(item.rateOfChange)}
              <GradientText variant={getRateVariant(item.rateOfChange)}>
                {item.rateOfChange}
              </GradientText>
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="font-medium">
              <GradientText variant="silver">Demand</GradientText>
            </span>
            <GradientText variant={getDemandVariant(item.demand)}>
              {item.demand}/10
            </GradientText>
          </div>

          <div className="flex justify-between text-sm">
            <span className="font-medium">
              <GradientText variant="silver">{tax.label}</GradientText>
            </span>
            <span className="font-bold">
              {tax.value > 0 ? (
                <GradientText variant={tax.variant}>
                  <CountUp
                    from={0}
                    to={tax.value}
                    duration={1}
                    delay={index < 20 ? (index % 4) * 0.08 + 0.1 : 0}
                    format={(v) => v.toLocaleString()}
                  />
                </GradientText>
              ) : (
                <GradientText variant="silver">None</GradientText>
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="font-medium">
              <GradientText variant="silver">Prestige</GradientText>
            </span>
            <GradientText variant="blue">
              {item.prestige}
            </GradientText>
          </div>
        </div>
      </div>
    </BorderGlow>
  );
});