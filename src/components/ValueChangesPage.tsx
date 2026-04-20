import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useValueChanges } from "../hooks/useValueChanges";
import { AnimatedItem } from "../Shared/AnimatedList";
import BorderGlow from "../Shared/BorderGlow";
import GradientText from "../Shared/GradientText";

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
        <h1 className="text-4xl font-extrabold">
          <GradientText variant="gold">
            Value Changes
          </GradientText>
        </h1>

        <p className="mt-3 text-sm">
          <GradientText variant="silver">
            Track item value updates and market trends
          </GradientText>
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

                    <span className="text-sm font-semibold truncate">
                      <GradientText variant="gold">
                        {change.itemName}
                      </GradientText>
                    </span>
                  </div>

                  <div className="bg-[#111] rounded-lg p-2 text-center text-sm flex items-center justify-center">
                    <GradientText variant="silver">
                      {change.oldValue}
                    </GradientText>

                    <span className="mx-2 text-zinc-500">→</span>

                    <GradientText variant="gold">
                      {change.newValue}
                    </GradientText>
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