import React, { useState, useEffect } from "react";
import { ItemFlipGrid } from "./ItemFlipGrid";
import { Item } from "../types/Item";
import GradientText from "../Shared/GradientText";
import SplitText from "../Shared/SplitText";
import BlurText from "../Shared/BlurText";

interface ValueListPageProps {
  items: Item[];
}

export const ValueListPage: React.FC<ValueListPageProps> = ({ items }) => {
  const [viewMode, setViewMode] = useState<"regular" | "permanent">("regular");
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("viewMode");
    if (saved) setViewMode(saved as "regular" | "permanent");
  }, []);

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 100);
    const t2 = setTimeout(() => setStage(2), 200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleAnimationComplete = () => {};

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-16 text-center">

      {stage >= 1 && (
        <SplitText
          text="AOT:R Value List"
          tag="h1"
          className="text-4xl sm:text-5xl font-extrabold text-[var(--gold-bright)] leading-tight drop-shadow-lg"
          delay={40}
          duration={1}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
        />
      )}

      <div className="h-0.5 w-20 bg-gradient-to-r from-[var(--gold-soft)] via-[var(--gold-bright)] to-transparent rounded-full mt-3 mx-auto" />

      <div className="mt-6">
        {stage >= 2 && (
          <BlurText
            text="Browse all values, understand trading basics, and explore item worth in one place."
            delay={200}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-lg text-gray-400 text-center max-w-xl"
          />
        )}
      </div>

      <div className="bg-[#0b0b0d]/80 border border-[#D4AF37]/30 rounded-xl p-5 mb-12 mt-10 text-left backdrop-blur">
        <GradientText
          variant="silver"
          className="text-sm leading-relaxed"
        >
          Browse our complete AOT:R value list ({items.length} items).{" "}
          <span className="text-red-400 font-semibold">Notice:</span>{" "}
          These values are{" "}
          <span className="text-yellow-400 font-semibold">
            UNOFFICIAL and currently OUTDATED
          </span>{" "}
          They are only shown to give a rough visual understanding of item worth.
          <br /><br />
          AOT:R trading is entirely{" "}
          <span className="text-white font-semibold">player-driven</span>{" "}
          and based on{" "}
          <span className="text-yellow-400 font-semibold">
            rarity, demand, and player needs
          </span>.
          <br /><br />
          Do not rely on value lists for exact pricing. Always negotiate trades yourself and{" "}
          <span className="text-yellow-400 font-semibold">
            join our Discord for the latest insights.
          </span>
        </GradientText>
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