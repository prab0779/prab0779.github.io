import React, { useCallback, useRef, useState, useEffect } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  sortOrder: "asc" | "desc";
  onSortOrderChange: (order: "asc" | "desc") => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = React.memo(({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  sortOrder,
  onSortOrderChange
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchTerm(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onSearchChange(value);
    }, 300);
  }, [onSearchChange]);

  return (
    <div className="bg-[#06060A]/90 backdrop-blur border border-gray-800 rounded-xl p-4 mb-6 shadow-lg">
      <div className="flex flex-col md:flex-row gap-4">

        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Search items..."
            value={localSearchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="
              w-full pl-10 pr-4 py-2
              bg-black/60
              border border-gray-800
              rounded-lg
              text-white placeholder-white/40
              focus:outline-none
              focus:border-white/40
              transition-all duration-200
            "
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-white/40" />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="
              bg-black/60
              border border-gray-800
              rounded-lg px-3 py-2
              text-white
              focus:outline-none
              focus:border-white/40
              transition-all duration-200
            "
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <button
          onClick={() =>
            onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
          }
          className="
            flex items-center space-x-2
            bg-black/60
            border border-gray-800
            rounded-lg px-3 py-2
            text-white
            hover:border-white/40
            transition-all duration-200
          "
        >
          <ArrowUpDown className="w-4 h-4" />
          <span>
            {sortOrder === "asc" ? "Low to High" : "High to Low"}
          </span>
        </button>
      </div>
    </div>
  );
});
