import React, { useState, useEffect, useCallback, useRef } from "react";
import { ItemFlipGrid } from "./ItemFlipGrid";
import { Item } from "../types/Item";
import SplitText from "../Shared/SplitText";
import BlurText from "../Shared/BlurText";
import GradientText from "../Shared/GradientText";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const AdUnit: React.FC = () => {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!pushed.current && adRef.current) {
      pushed.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (_) {}
    }
  }, []);

  return (
    <div className="my-8 w-full flex justify-center">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format="fluid"
        data-ad-layout-key="-ef+6k-30-ac+ty"
        data-ad-client="ca-pub-5953527115992840"
        data-ad-slot="5404515310"
      />
    </div>
  );
};

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

      <AdUnit />

      <div className="mb-12 mt-10">
        <h3 className="font-semibold mb-3">
          <GradientText variant="gold">
            Default View Mode
          </GradientText>
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