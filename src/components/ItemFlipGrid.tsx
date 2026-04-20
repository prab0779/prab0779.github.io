import React, { useState, useMemo } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
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

  const vizardMask = useMemo(
    () => items.find((i) => i.name.toLowerCase() === "vizard mask"),
    [items]
  );

  const vizardValue = vizardMask?.value ?? 0;

  const categories = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.category))).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();

    return items
      .filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(lowerSearch);
        const matchesCategory =
          !selectedCategory || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .slice()
      .sort((a, b) =>
        sortOrder === "asc" ? a.value - b.value : b.value - a.value
      );
  }, [items, searchTerm, selectedCategory, sortOrder]);

  const COLUMN_COUNT = 4;
  const COLUMN_WIDTH = 260;
  const ROW_HEIGHT = 340;

  const rowCount = Math.ceil(filteredItems.length / COLUMN_COUNT);

  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * COLUMN_COUNT + columnIndex;
    if (index >= filteredItems.length) return null;

    const item = filteredItems[index];

    return (
      <div style={style} className="p-3">
        <ItemCard
          item={item}
          mode={mode}
          vizardValue={vizardValue}
          index={index}
        />
      </div>
    );
  };

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

      <div style={{ height: "75vh" }}>
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
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center text-gray-400 py-10">
          No items found.
        </div>
      )}
    </div>
  );
};