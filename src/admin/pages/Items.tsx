import React, { useState, useMemo } from "react";
import { Plus, Edit3, Trash2, Search, Filter, ArrowUpDown } from "lucide-react";

import { useItems } from "../../hooks/useItems";
import { Item } from "../../types/Item";

// Import the shared ItemForm modal
import ItemFormModal from "../compnents/ItemFormModal";

export default function Items() {
  const { items, loading, error, createItem, updateItem, deleteItem } = useItems();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortField, setSortField] = useState<"name" | "value" | "demand" | "prestige">("value");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [creating, setCreating] = useState<boolean>(false);

  const categories = useMemo(() => {
    return [...new Set(items.map(item => item.category))].sort();
  }, [items]);

  const filtered = useMemo(() => {
    let data = items.filter(i => {
      const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !category || i.category === category;
      return matchSearch && matchCategory;
    });

    data.sort((a, b) => {
      const A = a[sortField];
      const B = b[sortField];
      if (A < B) return sortOrder === "asc" ? -1 : 1;
      if (A > B) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [items, search, category, sortField, sortOrder]);

  const getEmoji = (emoji: string) => {
    if (!emoji) return "👹";
    if (emoji.startsWith("/") || emoji.startsWith("./"))
      return (
        <img
          src={emoji.replace("./", "/")}
          alt=""
          className="w-7 h-7 object-contain rounded"
        />
      );
    return emoji;
  };

  const handleDelete = async (item: Item) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    await deleteItem(item.id);
  };

  return (
    <div className="text-white">

      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-red-400">Items</h1>
          <p className="text-gray-500">Manage every item in AOT:R</p>
        </div>

        <button
          onClick={() => setCreating(true)}
          className="flex items-center space-x-2 bg-red-700 hover:bg-red-800 px-5 py-2 rounded"
        >
          <Plus className="w-5 h-5" />
          <span>Create Item</span>
        </button>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="bg-[#0e0e0e] border border-red-900 rounded p-5 mb-8">

        <div className="flex flex-col lg:flex-row gap-4">

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              className="w-full bg-black border border-red-800 rounded px-10 py-2 text-white"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-black border border-red-800 rounded px-3 py-2 text-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Sort Field */}
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as any)}
            className="bg-black border border-red-800 rounded px-3 py-2 text-white"
          >
            <option value="name">Sort: Name</option>
            <option value="value">Sort: Value</option>
            <option value="demand">Sort: Demand</option>
            <option value="prestige">Sort: Prestige</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center bg-black border border-red-800 rounded px-4 py-2"
          >
            <ArrowUpDown className="w-5 h-5 text-gray-300" />
            <span className="ml-2 text-sm">
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </span>
          </button>
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div className="bg-[#0e0e0e] border border-red-900 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-black">
              <tr className="text-red-300 border-b border-red-900">
                <th className="px-5 py-3 text-left">Item</th>
                <th className="px-5 py-3 text-left">Value</th>
                <th className="px-5 py-3 text-left">Demand</th>
                <th className="px-5 py-3 text-left">Category</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-red-900 hover:bg-red-900/10 transition"
                >
                  <td className="px-5 py-4 flex space-x-3 items-center">
                    <div className="text-2xl">{getEmoji(item.emoji)}</div>
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-gray-500 text-xs">{item.prestige} ★ Prestige</p>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-red-300">🔑 {item.value}</td>
                  <td className="px-5 py-4 text-gray-300">{item.demand}/10</td>
                  <td className="px-5 py-4 text-gray-400">{item.category}</td>

                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="px-3 py-1 bg-red-700 hover:bg-red-800 rounded"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(item)}
                      className="px-3 py-1 bg-red-900 hover:bg-red-800 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-600">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      {creating && (
        <ItemFormModal
          onClose={() => setCreating(false)}
          onSubmit={createItem}
        />
      )}

      {editingItem && (
        <ItemFormModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={(data) => updateItem(editingItem.id, data)}
        />
      )}
    </div>
  );
}
