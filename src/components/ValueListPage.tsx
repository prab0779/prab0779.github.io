import React, { useState, useEffect } from "react";
import { ItemFlipGrid } from "./ItemFlipGrid";
import { Item } from "../types/Item";
import GradientText from "../Shared/GradientText";

interface ValueListPageProps {
  items: Item[];
}

export const ValueListPage: React.FC<ValueListPageProps> = ({ items }) => {
  const [viewMode, setViewMode] = useState<"regular" | "permanent">("regular");

  useEffect(() => {
    const saved = localStorage.getItem("viewMode");
    if (saved) setViewMode(saved as "regular" | "permanent");
  }, []);

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-16 text-center">

      <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
        <GradientText variant="gold">
          AOT:R Value List
        </GradientText>
      </h1>

      <div className="bg-[#0b0b0d]/80 border border-[#D4AF37]/30 rounded-xl p-5 mb-12 text-left backdrop-blur">
        <p className="text-sm leading-relaxed text-gray-400">

          <GradientText variant="silver">
            Browse our complete AOT:R value list (
          </GradientText>

          <span className="text-white font-semibold mx-1">
            {items.length}
          </span>

          <GradientText variant="silver">
            items).
          </GradientText>

          <span className="text-red-400 font-semibold ml-2">
            Notice:
          </span>

          <GradientText variant="silver">
            {" "}These values are{" "}
          </GradientText>

          <span className="text-yellow-400 font-semibold">
            UNOFFICIAL and currently OUTDATED
          </span>

          <GradientText variant="silver">
            {" "}They are only shown to give a rough visual understanding of item worth.
          </GradientText>

          <br /><br />

          <GradientText variant="silver">
            AOT:R trading is entirely{" "}
          </GradientText>

          <span className="text-white font-semibold">
            player-driven
          </span>

          <GradientText variant="silver">
            {" "}and based on{" "}
          </GradientText>

          <span className="text-yellow-400 font-semibold">
            rarity, demand, and player needs
          </span>

          <br /><br />

          <GradientText variant="silver">
            Do not rely on value lists for exact pricing. Always negotiate trades yourself and{" "}
          </GradientText>

          <span className="text-yellow-400 font-semibold">
            join our Discord for the latest insights.
          </span>

        </p>
      </div>

      <div className="mb-12">
        <h3 className="font-semibold mb-3">
          <GradientText variant="gold">
            Default View Mode
          </GradientText>
        </h3>

        <div className="inline-flex bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("regular")}
            className={`px-6 py-2 font-medium transition-all duration-200 ${
              viewMode === "regular"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            Keys
          </button>

          <button
            onClick={() => setViewMode("permanent")}
            className={`px-6 py-2 font-medium transition-all duration-200 ${
              viewMode === "permanent"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            Vizard
          </button>
        </div>

        <p className="text-sm mt-2">
          <GradientText variant="silver">
            Sets the default display mode for all items.
          </GradientText>
        </p>
      </div>

      <ItemFlipGrid items={items} mode={viewMode} />
    </div>
  );
};