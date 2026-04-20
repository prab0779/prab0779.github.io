import React, { useState, useEffect, useMemo } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Item } from "../types/Item";
import GradientText from "../Shared/GradientText";
import SplitText from "../Shared/SplitText";
import BlurText from "../Shared/BlurText";
import { ItemFlipCard } from "./ItemFlipCard"; // assume single item component

interface ValueListPageProps {
  items: Item[];
}

export const ValueListPage: React.FC<ValueListPageProps> = ({ items }) => {
  const [viewMode, setViewMode] = useState<"regular" | "permanent">("regular");
  const [stage, setStage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ Memoized items (prevents unnecessary recalculation)
  const memoizedItems = useMemo(() => items, [items]);

  useEffect(() => {
    const saved = localStorage.getItem("viewMode");
    if (saved) setViewMode(saved as "regular" | "permanent");
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 100);
    const t2 = setTimeout(() => setStage(2), 200);
    const t3 = setTimeout(() => setStage(3), 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // ✅ Grid settings
  const COLUMN_COUNT = 4;
  const ROW_HEIGHT = 260;
  const COLUMN_WIDTH = 220;

  const rowCount = Math.ceil(memoizedItems.length / COLUMN_COUNT);

  // ✅ Cell renderer (ONLY renders visible items)
  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * COLUMN_COUNT + columnIndex;
    if (index >= memoizedItems.length) return null;

    const item = memoizedItems[index];

    return (
      <div style={style} className="p-2">
        <ItemFlipCard item={item} mode={viewMode} />
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-16 text-center">
      {/* Heading */}
      {stage >= 1 && (
        <SplitText
          text="AOT:R Value List"
          tag="h1"
          className="text-4xl sm:text-5xl font-extrabold text-[var(--gold-bright)]"
          delay={40}
          duration={1}
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
        />
      )}

      <div className="h-0.5 w-20 bg-gradient-to-r from-[var(--gold-soft)] via-[var(--gold-bright)] to-transparent rounded-full mt-3 mx-auto" />

      {/* Description */}
      {stage >= 2 && (
        <div className="mt-6">
          <BlurText
            text={`Browse ${items.length} items. Values are unofficial and may be outdated.`}
            delay={200}
            animateBy="words"
            className="text-lg text-gray-400 max-w-xl mx-auto"
          />
        </div>
      )}

      {/* Controls */}
      {stage >= 3 && (
        <>
          <div className="mb-12 mt-6">
            <h3 className="font-semibold mb-3">
              <GradientText variant="gold">
                Default View Mode
              </GradientText>
            </h3>

            <div className="inline-flex bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("regular")}
                className={`px-6 py-2 ${
                  viewMode === "regular"
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                Keys
              </button>

              <button
                onClick={() => setViewMode("permanent")}
                className={`px-6 py-2 ${
                  viewMode === "permanent"
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                Vizard
              </button>
            </div>
          </div>

          {/* ✅ Virtualized Grid */}
          <div style={{ height: "70vh" }}>
            {!isLoaded ? (
              <div className="text-gray-400">Loading...</div>
            ) : (
              <AutoSizer>
                {({ height, width }) => (
                  <Grid
                    columnCount={COLUMN_COUNT}
                    columnWidth={COLUMN_WIDTH}
                    height={height}
                    rowCount={rowCount}
                    rowHeight={ROW_HEIGHT}
                    width={width}
                  >
                    {Cell}
                  </Grid>
                )}
              </AutoSizer>
            )}
          </div>
        </>
      )}
    </div>
  );
};