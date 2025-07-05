import React, { useState, useMemo } from 'react';
import { ItemCard } from './ItemCard';
import { SearchAndFilter } from './SearchAndFilter';
import { Item } from '../types/Item';

interface ItemListProps {
  items: Item[];
}

export const ItemList: React.FC<ItemListProps> = ({ items }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // Get unique categories in alphabetical order
  const categories = useMemo(() => {
    return Array.from(new Set(items.map(item => item.category))).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    let filtered = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort by value
    filtered.sort((a, b) => {
      return sortOrder === 'asc' ? a.value - b.value : b.value - a.value;
    });

    return filtered;
  }, [items, searchTerm, selectedCategory, sortOrder]);

  const handleItemToggle = (itemId: string) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
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
      
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <ItemCard 
              key={item.id} 
              item={item} 
              isExpanded={expandedItemId === item.id}
              onToggle={() => handleItemToggle(item.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};