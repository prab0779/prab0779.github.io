import React, { useState, useMemo } from "react";
import { ItemCard } from "./ItemCard";
import { SearchAndFilter } from "./SearchAndFilter";
import { Item } from "../types/Item";
import { AnimatedItem } from "../Shared/AnimatedList";
import { useFilteredItems } from "../hooks/useFilteredItems";

interface ItemFlipGridProps {
  items: Item[];
  mode: "regular" | "permanent";
}

export const ItemFlipGrid: React.FC<ItemFlipGridProps> = ({
  items,
  mode,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // 🔥 Shared filtering logic (no duplication anymore)
  const { filteredItems, categories } = useFilteredItems({
    items,
    searchTerm,
    selectedCategory,
    sortOrder,
  });

  // Vizard calculation (keep memo)
  const vizardValue = useMemo(() => {
    const vizard = items.find(
      (i) => i.name.toLowerCase() === "vizard mask"
    );
    return vizard?.value ?? 0;
  }, [items]);

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

      {/* ⚠️ Still non-virtualized — fine under ~100 items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
        {filteredItems.map((item, index) => {
          const shouldAnimate = index < 16; // limit animations

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

      {filteredItems.length === 0 && (
        <div className="text-center text-gray-400 py-10">
          No items found.
        </div>
      )}
    </div>
  );
};