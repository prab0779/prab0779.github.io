import React, { useState, useMemo } from "react";
import { ItemCard } from "./ItemCard";
import { SearchAndFilter } from "./SearchAndFilter";
import { Item } from "../types/Item";
import { AnimatedItem } from "../Shared/AnimatedList";

interface ItemFlipGridProps {
  items: Item[];
  mode: "regular" | "permanent";
}

export const ItemFlipGrid: React.FC<ItemFlipGridProps> = ({ items, mode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // 🔍 Get Vizard Mask value safely
  const vizardMask = useMemo(
    () => items.find((i) => i.name.toLowerCase() === "vizard mask"),
    [items]
  );

  const vizardValue = vizardMask?.value ?? 0;

  // 📂 Categories (sorted + unique)
  const categories = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.category))).sort();
  }, [items]);

  // 🔎 Filtering + sorting
  const filteredItems = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();

    const filtered = items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(lowerSearch);
      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) =>
      sortOrder === "asc" ? a.value - b.value : b.value - a.value
    );
  }, [items, searchTerm, selectedCategory, sortOrder]);

  return (
    <div className="space-y-6">
      {/* 🔎 Search + Filters */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      {/* 🧱 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
        {filteredItems.map((item, index) => (
          <AnimatedItem
            key={item.id}
            index={index}
            delay={(index % 4) * 0.08} // 🔥 stagger animation
          >
            <ItemCard
              item={item}
              mode={mode}
              vizardValue={vizardValue}
              index={index} // 🔥 required for animations
            />
          </AnimatedItem>
        ))}
      </div>

      {/* 💤 Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center text-gray-400 py-10">
          No items found.
        </div>
      )}
    </div>
  );
};
