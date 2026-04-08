import React, { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, Calendar, Filter, Search } from "lucide-react";
import { useValueChanges } from "../hooks/useValueChanges";

export const ValueChangesPage: React.FC = () => {
  const { valueChanges, loading, error } = useValueChanges();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChangeType, setSelectedChangeType] = useState<string>("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all");

  const renderItemIcon = (emoji: string, itemName: string) => {
    if (!emoji || typeof emoji !== "string") {
      return <span className="text-2xl">👹</span>;
    }

    if (emoji.startsWith("/") || emoji.startsWith("./")) {
      return (
        <div className="w-8 h-8 flex items-center justify-center">
          <img
            src={emoji.startsWith("./") ? emoji.slice(2) : emoji.slice(1)}
            alt={itemName}
            className="w-8 h-8 object-contain"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      );
    }

    return <span className="text-2xl">{emoji}</span>;
  };

  const filteredChanges = useMemo(() => {
    return valueChanges.filter((change) => {
      const matchesSearch = change.itemName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !selectedChangeType || change.changeType === selectedChangeType;
      return matchesSearch && matchesType;
    });
  }, [valueChanges, searchTerm, selectedChangeType]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-20 text-center">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-zinc-400">Loading value changes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto mt-20 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-14 mt-16 space-y-10">
      {/* Header */}
      <div className="text-center">
        <h1
          className="text-4xl font-extrabold"
          style={{ color: "var(--gold-bright)", textShadow: "0 0 12px rgba(255,180,0,0.4)" }}
        >
          Value Changes
        </h1>
        <p className="text-zinc-400 mt-2">Track item value updates and market trends</p>
      </div>

      {/* Filters */}
      <div className="bg-[#0c0c0c] border border-white/5 rounded-xl p-4 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#111] border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none"
          />
        </div>

        <select
          value={selectedChangeType}
          onChange={(e) => setSelectedChangeType(e.target.value)}
          className="bg-[#111] border border-zinc-800 rounded-lg px-3 py-2 text-white"
        >
          <option value="">All</option>
          <option value="increase">Increase</option>
          <option value="decrease">Decrease</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-4">
          <p className="text-green-400 text-sm">Increases</p>
          <p className="text-white text-xl font-bold">
            {filteredChanges.filter((c) => c.changeType === "increase").length}
          </p>
        </div>

        <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">Decreases</p>
          <p className="text-white text-xl font-bold">
            {filteredChanges.filter((c) => c.changeType === "decrease").length}
          </p>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-4">
          <p className="text-yellow-400 text-sm">Total</p>
          <p className="text-white text-xl font-bold">{filteredChanges.length}</p>
        </div>
      </div>

      {/* Cards */}
      {filteredChanges.length === 0 ? (
        <div className="text-center text-zinc-500 py-20">
          No changes found
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredChanges.map((change) => (
            <div
              key={change.id}
              className="bg-[#0c0c0c] border border-white/5 rounded-xl p-4 hover:border-white/10 transition"
            >
              <div className="flex items-center gap-2 mb-3">
                {renderItemIcon(change.emoji, change.itemName)}
                <span className="text-white text-sm font-semibold truncate">
                  {change.itemName}
                </span>
              </div>

              <div className="bg-[#111] rounded-lg p-2 text-center text-sm">
                <span className="text-zinc-400">🔑 {change.oldValue}</span>
                <span className="mx-2 text-zinc-500">→</span>
                <span className="text-yellow-400 font-bold">
                  🔑 {change.newValue}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
