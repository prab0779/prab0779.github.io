import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useValueChanges } from "../hooks/useValueChanges";
import { AnimatedItem } from "../Shared/AnimatedList";
import BorderGlow from "../Shared/BorderGlow";

export const ValueChangesPage: React.FC = () => {
  const { valueChanges, loading, error } = useValueChanges();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChangeType, setSelectedChangeType] = useState<string>("");

  const renderItemIcon = (emoji: string, itemName: string) => {
    if (!emoji || typeof emoji !== "string") {
      return <span className="text-2xl">👹</span>;
    }

    if (emoji.startsWith("/") || emoji.startsWith("./")) {
      const src = emoji.startsWith("./") ? emoji.slice(2) : emoji;

      return (
        <div className="w-8 h-8 flex items-center justify-center">
          <img
            src={src}
            alt={itemName}
            className="w-8 h-8 object-contain"
            style={{ imageRendering: "pixelated" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      );
    }

    return <span className="text-2xl">{emoji}</span>;
  };

  const filteredChanges = useMemo(() => {
    return valueChanges.filter((change) => {
      const matchesSearch = change.itemName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        !selectedChangeType || change.changeType === selectedChangeType;
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
    <div className="max-w-6xl mx-auto px-4 py-14 mt-20 space-y-10">
      {/* Header */}
      <div className="text-center mt-16">
        <h1 className="text-4xl font-extrabold flex flex-wrap justify-center">
          {"Value Changes".split("").map((c, i) => (
            <span key={i} className="gold-letter">
              {c === " " ? "\u00A0" : c}
            </span>
          ))}
        </h1>

        <p className="mt-3 flex flex-wrap justify-center text-sm">
          {"Track item value updates and market trends"
            .split(" ")
            .map((w, i, arr) => (
              <span key={i} className="silver-letter">
                {w}
                {i < arr.length - 1 && "\u00A0"}
              </span>
            ))}
        </p>
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

      {/* Cards */}
      {filteredChanges.length === 0 ? (
        <div className="text-center text-zinc-500 py-20">
          No changes found
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredChanges.map((change, index) => (
            <AnimatedItem key={change.id} index={index} delay={(index % 4) * 0.08}>
              <BorderGlow
                edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="#0c0c0c"
                borderRadius={16}
                glowRadius={30}
                glowIntensity={1}
                coneSpread={25}
                animated={false}
                colors={["#FFD700", "#FFC94D", "#FFB347"]}
              >
                <div className="rounded-xl p-4 transition">
                  <div className="flex items-center gap-2 mb-3">
                    {renderItemIcon(change.emoji, change.itemName)}

                    <span className="text-sm font-semibold truncate flex flex-wrap">
                      {change.itemName.split("").map((c, i) => (
                        <span key={i} className="gold-letter">
                          {c === " " ? "\u00A0" : c}
                        </span>
                      ))}
                    </span>
                  </div>

                  <div className="bg-[#111] rounded-lg p-2 text-center text-sm flex items-center justify-center">
                    <span className="flex flex-wrap">
                      {("🔑 " + change.oldValue).split("").map((c, i) => (
                        <span key={i} className="silver-letter">
                          {c === " " ? "\u00A0" : c}
                        </span>
                      ))}
                    </span>

                    <span className="mx-2 text-zinc-500">→</span>

                    <span className="font-bold flex flex-wrap">
                      {("🔑 " + change.newValue).split("").map((c, i) => (
                        <span key={i} className="gold-letter">
                          {c === " " ? "\u00A0" : c}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
              </BorderGlow>
            </AnimatedItem>
          ))}
        </div>
      )}
    </div>
  );
};