import React, { useState, useMemo } from "react";
import { ItemCard } from "./ItemCard";
import { SearchAndFilter } from "./SearchAndFilter";
import { Item } from "../types/Item";

interface ItemFlipGridProps {
  items: Item[];
  mode: "regular" | "permanent";
}

export const ItemFlipGrid: React.FC<ItemFlipGridProps> = ({ items, mode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Find Vizard Mask value
  const vizardMask = items.find((i) => i.name.toLowerCase() === "vizard mask");
  const vizardValue = vizardMask ? vizardMask.value : 0;

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))).sort(),
    [items]
  );

  const filteredItems = useMemo(() => {
    let f = items.filter((item) => {
      const s = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const c = !selectedCategory || item.category === selectedCategory;
      return s && c;
    });

    f.sort((a, b) =>
      sortOrder === "asc" ? a.value - b.value : b.value - a.value
    );

    return f;
  }, [items, searchTerm, selectedCategory, sortOrder]);

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

     <div
  className="
    grid 
    justify-center 
    gap-4 sm:gap-6 
    grid-cols-[repeat(auto-fit,minmax(170px,1fr))]
  "
>
  {filteredItems.map((i) => (
    <div className="flex justify-center">
      <ItemCard key={i.id} item={i} mode={mode} vizardValue={vizardValue} />
    </div>
  ))}
</div>


    </div>
  );
};
