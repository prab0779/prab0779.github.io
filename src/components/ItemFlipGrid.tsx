import React, { useState, useMemo, useEffect, useRef } from "react";
import { ItemCard } from "./ItemCard";
import { SearchAndFilter } from "./SearchAndFilter";
import { Item } from "../types/Item";
import { AnimatedItem } from "../Shared/AnimatedList";
import { useFilteredItems } from "../hooks/useFilteredItems";

interface ItemFlipGridProps {
  items: Item[];
  mode: "regular" | "permanent";
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

  const vizardValue = useMemo(() => {
    const vizard = items.find((i) => i.name.toLowerCase() === "vizard mask");
    return vizard?.value ?? 0;
  }, [items]);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
        {visibleItems.map((item, index) => {
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
                vizardValue={vizardValue}
                index={index}
              />
            </AnimatedItem>
          );
        })}
      </div>

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
