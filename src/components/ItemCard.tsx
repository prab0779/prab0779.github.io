import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Item } from "../types/Item";
import { getItemImageUrl } from "../lib/supabase";
import BorderGlow from "../Shared/BorderGlow";
import GradientText from "../Shared/GradientText";

interface ItemCardProps {
  item: Item;
  mode: "viz" | "scroll";
  index?: number;
}

const isMobile =
  typeof window !== "undefined" &&
  (navigator.maxTouchPoints > 0 ||
    window.matchMedia("(max-width: 768px)").matches);

const formatValue = (v: number) => {
  const n = Number(v) || 0;
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(0) + "M";
  return n.toLocaleString();
};

const CardWrapper = ({ children }: { children: React.ReactNode }) => {
  if (isMobile) {
    return (
      <div className="relative border border-white/15 rounded-2xl bg-[#0c0c0c]">
        {children}
      </div>
    );
  }

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
      {children}
    </BorderGlow>
  );
};

const SCROLL_RATE = 300;

const ItemCardComponent = ({
  item,
  mode,
  index = 0,
}: ItemCardProps) => {
  const [localMode, setLocalMode] = useState<"viz" | "scroll" | null>(null);
  const activeMode = localMode ?? mode;
  const shouldAnimate = !isMobile;

  useEffect(() => { setLocalMode(null); }, [mode]);

  const getDemandVariant = (d: number): "red" | "yellow" | "green" =>
    d <= 3 ? "red" : d <= 6 ? "yellow" : "green";

  const getRateVariant = (r: string): "green" | "red" | "yellow" =>
    r === "Rising" ? "green" : r === "Falling" ? "red" : "yellow";

  const getRateIcon = (r: string) =>
    r === "Rising" ? (
      <TrendingUp className="w-4 h-4 text-green-400" />
    ) : r === "Falling" ? (
      <TrendingDown className="w-4 h-4 text-red-400" />
    ) : (
      <Minus className="w-4 h-4 text-gray-400" />
    );

  const tax =
    item.gemTax
      ? { label: "Gem Tax", value: item.gemTax, variant: "purple" as const }
      : item.goldTax
      ? { label: "Gold Tax", value: item.goldTax, variant: "yellow" as const }
      : { label: "Tax", value: 0, variant: "silver" as const };

  const vizValue = item.value;
  const scrollValue = item.value * SCROLL_RATE;

  const renderIcon = (emoji: string) => {
    if (!emoji) {
      return (
        <div className="w-28 h-28 flex items-center justify-center">
          <span className="text-6xl">👹</span>
        </div>
      );
    }

    if (
      emoji.startsWith("/") ||
      emoji.startsWith("./") ||
      emoji.startsWith("http")
    ) {
      return (
        <div className="w-28 h-28 mx-auto">
          <img
            src={getItemImageUrl(emoji)}
            alt={item.name}
            width={112}
            height={112}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain pixelated"
          />
        </div>
      );
    }

    return (
      <div className="w-28 h-28 flex items-center justify-center">
        <span className="text-6xl">{emoji}</span>
      </div>
    );
  };

  return (
    <CardWrapper>
      <div className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg">
            <GradientText variant="gold">{item.name}</GradientText>
          </h2>
        </div>

        <div className="flex justify-center mb-4">
          {renderIcon(item.emoji)}
        </div>

        {/* Per-card mode toggle */}
        <div className="flex items-center justify-center gap-1 mb-3">
          <button
            onClick={(e) => { e.stopPropagation(); setLocalMode("viz"); }}
            className={`px-3 py-1 rounded-l-lg text-xs font-semibold transition-colors border ${
              activeMode === "viz"
                ? "bg-[#c4a04a]/20 text-[#c4a04a] border-[#6f572c]/60"
                : "bg-white/[0.03] text-white/30 border-white/[0.08] hover:text-white/50"
            }`}
          >
            Viz
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLocalMode("scroll"); }}
            className={`px-3 py-1 rounded-r-lg text-xs font-semibold transition-colors border ${
              activeMode === "scroll"
                ? "bg-[#c4a04a]/20 text-[#c4a04a] border-[#6f572c]/60"
                : "bg-white/[0.03] text-white/30 border-white/[0.08] hover:text-white/50"
            }`}
          >
            Scroll
          </button>
        </div>

        <div className="bg-black/40 rounded-xl p-4 space-y-3 border border-gray-800">
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              <GradientText variant="silver">
                {activeMode === "viz" ? "Viz" : "Scrolls"}
              </GradientText>
            </span>
            <span className="text-white font-bold">
              {formatValue(activeMode === "viz" ? vizValue : scrollValue)}
            </span>
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
                  {tax.value.toLocaleString()}
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
            <GradientText variant="blue">{item.prestige}</GradientText>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};

export const ItemCard = React.memo(
  ItemCardComponent,
  (prev, next) => {
    return (
      prev.item.id === next.item.id &&
      prev.item.value === next.item.value &&
      prev.item.rateOfChange === next.item.rateOfChange &&
      prev.item.demand === next.item.demand &&
      prev.mode === next.mode
    );
  }
);