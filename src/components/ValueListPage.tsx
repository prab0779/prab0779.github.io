import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ItemFlipGrid } from "./ItemFlipGrid";
import { Item } from "../types/Item";

interface ValueListPageProps {
  items: Item[];
}

export const ValueListPage: React.FC<ValueListPageProps> = ({ items }) => {
  const [viewMode, setViewMode] = useState<"regular" | "permanent">(() => {
    return (localStorage.getItem("viewMode") as "regular" | "permanent") || "regular";
  });

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  const handleViewMode = useCallback((mode: "regular" | "permanent") => {
    setViewMode(mode);
  }, []);

  const titleChars = useMemo(
    () => "AOT:R Value List".split(""),
    []
  );

  const descriptionWords = useMemo(() => {
    return [
      "Browse our complete AOT:R value list (",
      "COUNT",
      "items).",
      "⚠️ Notice:",
      "These values are",
      "UNOFFICIAL and currently OUTDATED",
      "They are only shown to give a rough visual understanding of item worth.",
      "AOT:R trading is entirely",
      "player-driven",
      "and based on",
      "rarity, demand, and player needs",
      "Do not rely on value lists for exact pricing. Always negotiate trades yourself and",
      "join our Discord for the latest insights."
    ];
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-16 text-center">

      <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 flex flex-wrap justify-center min-h-[3rem]">
        {titleChars.map((c, i) => (
          <span key={i} className="gold-letter">
            {c === " " ? "\u00A0" : c}
          </span>
        ))}
      </h1>

      <div className="bg-[#0b0b0d]/80 border border-[#D4AF37]/30 rounded-xl p-5 mb-12 text-left backdrop-blur min-h-[160px]">
        <p className="text-sm leading-relaxed flex flex-wrap">

          {descriptionWords.map((word, i) => {
            if (word === "COUNT") {
              return (
                <span key={i} className="text-white font-semibold mx-1">
                  {items.length}
                </span>
              );
            }

            if (word === "⚠️ Notice:") {
              return (
                <span key={i} className="text-red-400 font-semibold mx-1">
                  {word}
                </span>
              );
            }

            if (word === "UNOFFICIAL and currently OUTDATED") {
              return (
                <span key={i} className="text-yellow-400 font-semibold mx-1">
                  {word}
                </span>
              );
            }

            if (word === "player-driven") {
              return (
                <span key={i} className="text-white font-semibold mx-1">
                  {word}
                </span>
              );
            }

            if (word === "rarity, demand, and player needs" || word.includes("Discord")) {
              return (
                <span key={i} className="text-yellow-400 font-semibold mx-1">
                  {word}
                </span>
              );
            }

            return (
              <span key={i} className="silver-letter mr-1">
                {word}
              </span>
            );
          })}
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
            onClick={() => handleViewMode("regular")}
            className={`px-6 py-2 font-medium transition-all duration-200 ${
              viewMode === "regular"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            Keys
          </button>

          <button
            onClick={() => handleViewMode("permanent")}
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