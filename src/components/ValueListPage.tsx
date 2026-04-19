import React, { useState, useEffect } from "react";
import { ItemFlipGrid } from "./ItemFlipGrid";
import { Item } from "../types/Item";

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

      <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 flex flex-wrap justify-center">
        {"AOT:R Value List".split("").map((c, i) => (
          <span key={i} className="gold-letter">
            {c === " " ? "\u00A0" : c}
          </span>
        ))}
      </h1>

      <div className="bg-[#0b0b0d]/80 border border-[#D4AF37]/30 rounded-xl p-5 mb-12 text-left backdrop-blur">
        <p className="text-sm leading-relaxed flex flex-wrap">

          {"Browse our complete AOT:R value list (".split(" ").map((w, i, arr) => (
            <span key={i} className="silver-letter">
              {w}{i < arr.length - 1 && "\u00A0"}
            </span>
          ))}

          <span className="text-white font-semibold mx-1">
            {items.length}
          </span>

          {"items).".split(" ").map((w, i, arr) => (
            <span key={"b"+i} className="silver-letter">
              {w}{i < arr.length - 1 && "\u00A0"}
            </span>
          ))}

          <span className="text-red-400 font-semibold"> ⚠️ Notice: </span>

          {"These values are".split(" ").map((w, i, arr) => (
            <span key={"c"+i} className="silver-letter">
              {w}{i < arr.length - 1 && "\u00A0"}
            </span>
          ))}

          <span className="text-yellow-400 font-semibold mx-1">
            UNOFFICIAL and currently OUTDATED
          </span>

          {"They are only shown to give a rough visual understanding of item worth."
            .split(" ")
            .map((w, i, arr) => (
              <span key={"d"+i} className="silver-letter">
                {w}{i < arr.length - 1 && "\u00A0"}
              </span>
            ))}

          <br /><br />

          {"AOT:R trading is entirely".split(" ").map((w, i, arr) => (
            <span key={"e"+i} className="silver-letter">
              {w}{i < arr.length - 1 && "\u00A0"}
            </span>
          ))}

          <span className="text-white font-semibold mx-1">
            player-driven
          </span>

          {"and based on".split(" ").map((w, i, arr) => (
            <span key={"f"+i} className="silver-letter">
              {w}{i < arr.length - 1 && "\u00A0"}
            </span>
          ))}

          <span className="text-yellow-400 font-semibold mx-1">
            rarity, demand, and player needs
          </span>

          <br /><br />

          {"Do not rely on value lists for exact pricing. Always negotiate trades yourself and"
            .split(" ")
            .map((w, i, arr) => (
              <span key={"g"+i} className="silver-letter">
                {w}{i < arr.length - 1 && "\u00A0"}
              </span>
            ))}

          <span className="text-yellow-400 font-semibold mx-1">
            join our Discord for the latest insights.
          </span>

        </p>
      </div>

      <div className="mb-12">
        <h3 className="font-semibold mb-3 flex flex-wrap justify-center">
          {"Default View Mode".split("").map((c, i) => (
            <span key={i} className="gold-letter">
              {c === " " ? "\u00A0" : c}
            </span>
          ))}
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

        <p className="text-sm mt-2 flex flex-wrap justify-center">
          {"Sets the default display mode for all items."
            .split(" ")
            .map((w, i, arr) => (
              <span key={i} className="silver-letter">
                {w}{i < arr.length - 1 && "\u00A0"}
              </span>
            ))}
        </p>
      </div>

      <ItemFlipGrid items={items} mode={viewMode} />
    </div>
  );
};