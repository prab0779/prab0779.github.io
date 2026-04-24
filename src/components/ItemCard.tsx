import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Item } from "../types/Item";
import { getItemImageUrl } from "../lib/supabase";
import CountUp from "../Shared/CountUp";
import BorderGlow from "../Shared/BorderGlow";
import GradientText from "../Shared/GradientText";

interface ItemCardProps {
  item: Item;
  mode: "regular" | "permanent";
  vizardValue: number;
  index?: number;
}

const isMobile =
  typeof window !== "undefined" &&
  (navigator.maxTouchPoints > 0 ||
    window.matchMedia("(max-width: 768px)").matches);

const formatValue = (v: number) => {
  if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(2) + "B";
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(0) + "M";
  return v.toLocaleString();
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

const ItemCardComponent = ({
  item,
  mode,
  vizardValue,
  index = 0,
}: ItemCardProps) => {
  const shouldAnimate = !isMobile;

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

  const keysValue = item.value;

  const vizardConverted = vizardValue
    ? Math.round((item.value / vizardValue) * 100) / 100
    : 0;

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

        <div className="bg-black/40 rounded-xl p-4 space-y-3 border border-gray-800">
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              <GradientText variant="silver">Value</GradientText>
            </span>

            {mode === "regular" ? (
              <span className="text-white font-bold">
                {shouldAnimate ? (
                  <CountUp
                    from={0}
                    to={keysValue}
                    duration={1.2}
                    delay={(index % 4) * 0.08}
                    format={formatValue}
                  />
                ) : (
                  formatValue(keysValue)
                )}
              </span>
            ) : (
              <span className="font-bold">
                <GradientText variant="purple">
                  {shouldAnimate ? (
                    <CountUp
                      from={0}
                      to={vizardConverted}
                      duration={1.2}
                      delay={(index % 4) * 0.08}
                      format={(v) => Number(v).toFixed(2)}
                    />
                  ) : (
                    vizardConverted.toFixed(2)
                  )}
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
                  {shouldAnimate ? (
                    <CountUp
                      from={0}
                      to={tax.value}
                      duration={1}
                      delay={(index % 4) * 0.08 + 0.1}
                      format={(v) => v.toLocaleString()}
                    />
                  ) : (
                    tax.value.toLocaleString()
                  )}
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
      prev.mode === next.mode &&
      prev.vizardValue === next.vizardValue
    );
  }
);