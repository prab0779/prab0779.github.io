import React, { useState } from "react";
import { ItemFlipGrid } from "./ItemFlipGrid";
import { Item } from "../types/Item";

interface ValueListPageProps {
  items: Item[];
}

export const ValueListPage: React.FC<ValueListPageProps> = ({ items }) => {
  const [viewMode, setViewMode] = useState<"regular" | "permanent">("regular");

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 text-center">

      <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
        AOT:R Value List
      </h1>

      <p className="text-gray-400 max-w-2xl mx-auto mb-12">
  Browse our complete AOT:R value list ({items.length}+ items).
  <span className="text-red-400 font-semibold"> ⚠️ Notice:</span> 
  These values are <span className="text-yellow-400 font-semibold">UNOFFICIAL and currently OUTDATED</span>. 
  They are only shown to give a rough visual understanding of item worth.

  <br /><br />

  AOT:R trading is entirely <span className="font-semibold">player-driven</span> and based on 
  <span className="text-yellow-400 font-semibold"> rarity, demand, and player needs</span>. 
  Because of this, item values constantly change depending on availability and what players are willing to trade.

  <br /><br />

  Do not rely on value lists for exact pricing. Always negotiate trades yourself and 
  <span className="text-yellow-400 font-semibold"> join our Discord for the latest community insights.</span>
</p>



      <div className="mb-12">
        <h3 className="text-white font-semibold mb-3">Default View Mode</h3>

        <div className="inline-flex bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("regular")}
            className={`px-6 py-2 font-medium ${
              viewMode === "regular"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            Keys
          </button>

          <button
            onClick={() => setViewMode("permanent")}
            className={`px-6 py-2 font-medium ${
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
