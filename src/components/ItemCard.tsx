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

const ItemCardComponent = ({
  item,
  mode,
  vizardValue,
  index = 0,
}: ItemCardProps) => {
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
    if (!cardRef.current || isMobile) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, []);

  const shouldAnimate = !isMobile && hasAnimated;

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
      <div ref={cardRef} className="p-5 flex flex-col h-full">
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
                {isMobile ? (
                  formatValue(keysValue)
                ) : (
                  <CountUp
                    from={shouldAnimate ? 0 : keysValue}
                    to={keysValue}
                    duration={shouldAnimate ? 1.2 : 0}
                    delay={(index % 4) * 0.08}
                    format={formatValue}
                  />
                )}
              </span>
            ) : (
              <span className="font-bold">
                <GradientText variant="purple">
                  {isMobile ? (
                    vizardConverted.toFixed(2)
                  ) : (
                    <CountUp
                      from={shouldAnimate ? 0 : vizardConverted}
                      to={vizardConverted}
                      duration={shouldAnimate ? 1.2 : 0}
                      delay={(index % 4) * 0.08}
                      format={(v) => Number(v).toFixed(2)}
                    />
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
                  {isMobile ? (
                    tax.value.toLocaleString()
                  ) : (
                    <CountUp
                      from={shouldAnimate ? 0 : tax.value}
                      to={tax.value}
                      duration={shouldAnimate ? 1 : 0}
                      delay={(index % 4) * 0.08 + 0.1}
                      format={(v) => v.toLocaleString()}
                    />
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
    </BorderGlow>
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