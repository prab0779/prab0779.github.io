import { useMemo } from "react";
import { Item } from "../types/Item";

interface FilterOptions {
  items: Item[];
  searchTerm: string;
  selectedCategory: string;
  sortOrder: "asc" | "desc";
}

export const useFilteredItems = ({
  items,
  searchTerm,
  selectedCategory,
  sortOrder,
}: FilterOptions) => {
  // Categories
  const categories = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.category))).sort();
  }, [items]);

  // Filter + sort (single source of truth)
  const filteredItems = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();

    const filtered = items.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(lowerSearch);

      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    return [...filtered].sort((a, b) =>
      sortOrder === "asc" ? a.value - b.value : b.value - a.value
    );
  }, [items, searchTerm, selectedCategory, sortOrder]);

  return { filteredItems, categories };
};