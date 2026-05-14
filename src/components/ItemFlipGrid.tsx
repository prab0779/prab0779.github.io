import React, { useState, useEffect, useRef } from "react";
import { ItemCard } from "./ItemCard";
import { SearchAndFilter } from "./SearchAndFilter";
import { Item } from "../types/Item";
import { AnimatedItem } from "../Shared/AnimatedList";
import { useFilteredItems } from "../hooks/useFilteredItems";
import { DisplayAd } from "./DisplayAd";

const AD_EVERY = 16;

interface ItemFlipGridProps {
  items: Item[];
  mode: "viz" | "scroll";
}

const BATCH_SIZE = 20;

export const ItemFlipGrid: React.FC<ItemFlipGridProps> = ({ items, mode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { filteredItems, categories } = useFilteredItems({
    items,
    searchTerm,
    selectedCategory,
    sortOrder,
  });


  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [searchTerm, selectedCategory, sortOrder]);

  // Load next batch when sentinel comes into view
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredItems.length));
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredItems.length]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  return (
    <div className="space-y-6">
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      {(() => {
        const rows: React.ReactNode[] = [];
        let adKey = 0;

        for (let i = 0; i < visibleItems.length; i += AD_EVERY) {
          const batch = visibleItems.slice(i, i + AD_EVERY);

          rows.push(
            <div
              key={`batch-${i}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16"
            >
              {batch.map((item, batchIndex) => {
                const index = i + batchIndex;
                const shouldAnimate = index < 16;
                return (
                  <AnimatedItem
                    key={item.id}
                    index={index}
                    delay={shouldAnimate ? (index % 4) * 0.08 : 0}
                  >
                    <ItemCard
                      item={item}
                      mode={mode}
                      index={index}
                    />
                  </AnimatedItem>
                );
              })}
            </div>
          );

          if (i + AD_EVERY < visibleItems.length) {
            rows.push(<DisplayAd key={`ad-${adKey++}`} className="my-6" />);
          }
        }

        return rows;
      })()}

      {/* Sentinel — triggers next batch load */}
      <div ref={sentinelRef} className="h-1" />

      {hasMore && (
        <div className="text-center text-gray-500 text-sm pb-4">
          Showing {visibleCount} of {filteredItems.length} items
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center text-gray-400 py-10">No items found.</div>
      )}
    </div>
  );
};
