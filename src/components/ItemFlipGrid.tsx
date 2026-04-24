import React, { useState, useMemo, useCallback, useRef } from "react";
import { Grid, useGridRef } from "react-window";
import { AutoSizer } from "react-virtualized-auto-sizer";
import { ItemCard } from "./ItemCard";
import { SearchAndFilter } from "./SearchAndFilter";
import { Item } from "../types/Item";
import { useFilteredItems } from "../hooks/useFilteredItems";

interface ItemFlipGridProps {
  items: Item[];
  mode: "regular" | "permanent";
}

const CARD_HEIGHT = 420;
const GAP = 24;

function getColumnCount(width: number): number {
  if (width >= 1280) return 4;
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

interface CellData {
  filteredItems: Item[];
  columnCount: number;
  mode: "regular" | "permanent";
  vizardValue: number;
  columnWidth: number;
}

interface CellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: CellData;
}

const Cell: React.FC<CellProps> = ({ columnIndex, rowIndex, style, data }) => {
  const { filteredItems, columnCount, mode, vizardValue, columnWidth } = data;
  const index = rowIndex * columnCount + columnIndex;
  if (index >= filteredItems.length) return null;
  const item = filteredItems[index];

  return (
    <div
      style={{
        ...style,
        left: Number(style.left) + columnIndex * GAP,
        width: columnWidth - GAP,
        top: Number(style.top) + GAP / 2,
        height: CARD_HEIGHT,
        padding: 0,
      }}
    >
      <ItemCard
        item={item}
        mode={mode}
        vizardValue={vizardValue}
        index={index}
      />
    </div>
  );
};

const MemoCell = React.memo(Cell);

export const ItemFlipGrid: React.FC<ItemFlipGridProps> = ({ items, mode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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

  const prevFiltersRef = useRef({ searchTerm, selectedCategory, sortOrder });
  const gridRef = useGridRef();

  // Scroll to top when filters change
  const filtersChanged =
    prevFiltersRef.current.searchTerm !== searchTerm ||
    prevFiltersRef.current.selectedCategory !== selectedCategory ||
    prevFiltersRef.current.sortOrder !== sortOrder;

  if (filtersChanged) {
    prevFiltersRef.current = { searchTerm, selectedCategory, sortOrder };
    // Defer to avoid setState-during-render
    setTimeout(() => gridRef.current?.scrollTo({ scrollTop: 0 }), 0);
  }

  const buildCellData = useCallback(
    (columnCount: number, columnWidth: number): CellData => ({
      filteredItems,
      columnCount,
      mode,
      vizardValue,
      columnWidth,
    }),
    [filteredItems, mode, vizardValue]
  );

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

      {filteredItems.length === 0 ? (
        <div className="text-center text-gray-400 py-10">No items found.</div>
      ) : (
        <div style={{ height: "80vh", minHeight: 400 }}>
          <AutoSizer>
            {({ width, height }: { width: number; height: number }) => {
              const columnCount = getColumnCount(width);
              const rowCount = Math.ceil(filteredItems.length / columnCount);
              const columnWidth = Math.floor(width / columnCount);
              const rowHeight = CARD_HEIGHT + GAP;
              const cellData = buildCellData(columnCount, columnWidth);

              return (
                <Grid
                  gridRef={gridRef}
                  columnCount={columnCount}
                  columnWidth={columnWidth}
                  height={height}
                  rowCount={rowCount}
                  rowHeight={rowHeight}
                  width={width}
                  cellProps={cellData}
                  overscanCount={2}
                  cellComponent={MemoCell}
                />
              );
            }}
          </AutoSizer>
        </div>
      )}
    </div>
  );
};
