import React, { useState, useEffect, useCallback } from "react";
import { ItemFlipGrid } from "./ItemFlipGrid";
import { Item } from "../types/Item";
import SplitText from "../Shared/SplitText";
import BlurText from "../Shared/BlurText";
import GradientText from "../Shared/GradientText";
import { DisplayAd } from "./DisplayAd";

interface ValueListPageProps {
  items: Item[];
}

export const ValueListPage: React.FC<ValueListPageProps> = ({ items }) => {
  const [viewMode, setViewMode] = useState<"viz" | "scroll">(() => {
    return (localStorage.getItem("viewMode") as "viz" | "scroll") || "viz";
  });

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  const handleViewMode = useCallback((mode: "viz" | "scroll") => {
    setViewMode(mode);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-16 text-center">

      <SplitText
        text="AOT:R Value List"
        tag="h1"
        className="text-4xl sm:text-5xl font-extrabold text-[var(--gold-bright)] leading-tight min-h-[3rem]"
        delay={40}
        duration={0.8}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 30 }}
        to={{ opacity: 1, y: 0 }}
      />

      <div className="h-0.5 w-20 bg-gradient-to-r from-[var(--gold-soft)] via-[var(--gold-bright)] to-transparent rounded-full mt-3 mx-auto" />

      <div className="mt-6 max-w-xl mx-auto min-h-[140px]">
        <BlurText
          text={`Browse our complete AOT:R value list (${items.length} items).

Notice: These values are UNOFFICIAL and currently OUTDATED.

They are only shown to give a rough visual understanding of item worth.

AOT:R trading is entirely player-driven and based on rarity, demand, and player needs.

Do not rely on value lists for exact pricing. Always negotiate trades yourself and join our Discord for the latest insights.`}
          delay={120}
          animateBy="words"
          direction="top"
          className="text-lg text-gray-400"
        />
      </div>

      <div className="mb-12 mt-10">
        <h3 className="font-semibold mb-3">
          <GradientText variant="gold">
            Display Mode
          </GradientText>
        </h3>

        <div className="inline-flex bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => handleViewMode("viz")}
            className={`px-6 py-2 font-medium transition-all duration-200 ${
              viewMode === "viz"
                ? "bg-[#c4a04a] text-black"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            Viz
          </button>

          <button
            onClick={() => handleViewMode("scroll")}
            className={`px-6 py-2 font-medium transition-all duration-200 ${
              viewMode === "scroll"
                ? "bg-[#c4a04a] text-black"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            Scroll
          </button>
        </div>

        <p className="text-sm mt-2">
          <GradientText variant="silver">
            1 Viz = 300 Scrolls
          </GradientText>
        </p>
      </div>

      <ItemFlipGrid items={items} mode={viewMode} />
    </div>
  );
};