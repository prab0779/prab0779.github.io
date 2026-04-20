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
    const t1 = setTimeout(() => setStage(1), 100); // heading
    const t2 = setTimeout(() => setStage(2), 200); // description
    const t3 = setTimeout(() => setStage(3), 300); // rest

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
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
            text={`Browse our complete AOT:R value list (${items.length} items). Notice: These values are UNOFFICIAL and currently OUTDATED. They are only shown to give a rough visual understanding of item worth.

AOT:R trading is entirely player-driven and based on rarity, demand, and player needs.

Do not rely on value lists for exact pricing. Always negotiate trades yourself and join our Discord for the latest insights.`}
            delay={200}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-lg text-gray-400 mx-auto max-w-xl text-center block"
          />
        )}
      </div>

      {stage >= 3 && (
        <>
          <div className="p-3 mb-3 mt-1" />

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
        </>
      )}
    </div>
  );
};