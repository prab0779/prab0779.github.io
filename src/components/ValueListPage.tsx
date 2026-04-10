import React, { useState, useEffect } from "react";
import { ItemFlipGrid } from "./ItemFlipGrid";
import { Item } from "../types/Item";

interface ValueListPageProps {
  items: Item[];
}

export const ValueListPage: React.FC<ValueListPageProps> = ({ items }) => {
  const [viewMode, setViewMode] = useState<"regular" | "permanent">("regular");

  // 🔥 persist mode
  useEffect(() => {
    const saved = localStorage.getItem("viewMode");
    if (saved) setViewMode(saved as "regular" | "permanent");
  }, []);

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-16 text-center">

      <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
        AOT:R Value List
      </h1>

      <div className="bg-[#0b0b0d]/80 border border-[#D4AF37]/30 rounded-xl p-5 mb-12 text-left backdrop-blur">
        <p className="text-gray-300 text-sm leading-relaxed">
          Browse our complete AOT:R value list (
          <span className="text-white font-semibold">{items.length}</span> items).

          <span className="text-red-400 font-semibold"> ⚠️ Notice:</span>{" "}
          These values are{" "}
          <span className="text-yellow-400 font-semibold">
            UNOFFICIAL and currently OUTDATED
          </span>.
          They are only shown to give a rough visual understanding of item worth.

          <br /><br />

          AOT:R trading is entirely{" "}
          <span className="font-semibold text-white">player-driven</span> and based on{" "}
          <span className="text-yellow-400 font-semibold">
            rarity, demand, and player needs
          </span>.

          <br /><br />

          Do not rely on value lists for exact pricing. Always negotiate trades yourself and{" "}
          <span className="text-yellow-400 font-semibold">
            join our Discord for the latest insights.
          </span>
        </p>
      </div>

      <div className="mb-12">
        <h3 className="text-white font-semibold mb-3">
          Default View Mode
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

        <p className="text-gray-500 text-sm mt-2">
          Sets the default display mode for all items.
        </p>
      </div>

      <ItemFlipGrid items={items} mode={viewMode} />
    </div>
  );
};
