import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Eye
} from "lucide-react";

import { AnimatedItem } from "../Shared/AnimatedList";
import BorderGlow from "../Shared/BorderGlow";
import GradientText from "../Shared/GradientText";

import { useTradeAds } from "../hooks/useTradeAds";
import { useAuth } from "../hooks/useAuth";
import { Item } from "../types/Item";

interface TradeAdsPageProps {
  items: Item[];
}

const AVAILABLE_TAGS = [
  "Upgrade","Downgrade","GP","Fair Trade","Quick Trade","Bulk Trade",
  "Rare Items","Limited Items","New Player Friendly","High Value",
  "Collection","Overpay","Underpay"
];

export const TradeAdsPage: React.FC<TradeAdsPageProps> = ({ items }) => {
  const { user, signInWithDiscord } = useAuth();
  const {
    tradeAds, loading,
    page, totalPages, setPage, total
  } = useTradeAds();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => setPage(1), [searchTerm, selectedTag]);

  const filteredTradeAds = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return tradeAds.filter((ad) => {
      const matchSearch =
        !q ||
        ad.authorName.toLowerCase().includes(q) ||
        ad.itemsOffering.some((i) => i.itemName.toLowerCase().includes(q)) ||
        ad.itemsWanted.some((i) => i.itemName.toLowerCase().includes(q));

      const matchTag = !selectedTag || ad.tags.includes(selectedTag);
      return matchSearch && matchTag;
    });
  }, [tradeAds, searchTerm, selectedTag]);

  const renderItemIcon = (emoji: string, name: string) => {
    if (!emoji) return <span>👹</span>;
    if (emoji.startsWith("/") || emoji.startsWith("./")) {
      return <img src={emoji} alt={name} className="w-6 h-6 object-contain" />;
    }
    return <span>{emoji}</span>;
  };

  const getRelativeTime = (d: string) => {
    const diff = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  if (loading)
    return <div className="text-center py-12 text-zinc-400">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-14 mt-20 space-y-10">

      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-4 flex flex-wrap justify-center">
         <GradientText variant="gold">
  Trade Ads
</GradientText>
        </h1>

        <p className="mb-6 flex flex-wrap justify-center text-sm">
         <GradientText variant="silver">
  Post and browse trade offers (broken)
</GradientText>
        </p>

        <button
          onClick={() => (!user ? signInWithDiscord() : setShowCreateForm(true))}
          className="px-6 py-3 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg border border-yellow-500/20"
        >
          {user ? "Post Trade Ad" : "Login with Discord"}
        </button>
      </div>

      {/* FILTER */}
      <div className="bg-[#0c0c0c] p-6 rounded-xl border border-white/5 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2 text-zinc-400 w-4 h-4" />
          <input
            className="w-full pl-9 py-2 bg-[#111] border border-zinc-800 rounded text-white"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="bg-[#111] border border-zinc-800 rounded px-3 text-white"
        >
          <option value="">All</option>
          {AVAILABLE_TAGS.map((t) => <option key={t}>{t}</option>)}
        </select>

        <div className="flex items-center px-3 bg-[#111] border border-zinc-800 rounded text-white">
          <Eye className="w-4 h-4 mr-1" />
          {total}
        </div>
      </div>

      {/* ADS */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredTradeAds.map((ad, index) => (
          <AnimatedItem key={ad.id} index={index} delay={(index % 2) * 0.1}>
            <BorderGlow
              edgeSensitivity={30}
              glowColor="40 80 80"
              backgroundColor="#0c0c0c"
              borderRadius={16}
              glowRadius={30}
              glowIntensity={1}
              coneSpread={25}
              animated={false}
              colors={['#FFD700', '#FFC94D', '#FFB347']}
            >
              <div className="p-6 rounded-xl">

                <div className="flex items-center mb-4 gap-2">
                  <img src={ad.authorAvatar} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="text-white text-sm">{ad.authorName}</p>
                    <p className="text-zinc-500 text-xs">{getRelativeTime(ad.createdAt)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#111] p-3 rounded border border-white/5">
                    <p className="text-sm mb-2 flex flex-wrap">
                      <GradientText variant="gold">
  Offering
</GradientText>
                    </p>
                    {ad.itemsOffering.map((i, idx) => (
                      <div key={idx} className="flex gap-2 text-sm">
                        {renderItemIcon(i.emoji, i.itemName)}
                        <span className="flex flex-wrap">
                          {i.itemName.split("").map((c, i2) => (
                            <span key={i2} className="silver-letter">
                              {c === " " ? "\u00A0" : c}
                            </span>
                          ))}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#111] p-3 rounded border border-white/5">
                    <p className="text-sm mb-2 flex flex-wrap">
                      {"Looking For".split("").map((c, i) => (
                        <span key={i} className="gold-letter">{c === " " ? "\u00A0" : c}</span>
                      ))}
                    </p>
                    {ad.itemsWanted.map((i, idx) => (
                      <div key={idx} className="flex gap-2 text-sm">
                        {renderItemIcon(i.emoji, i.itemName)}
                        <span className="flex flex-wrap">
                          {i.itemName.split("").map((c, i2) => (
                            <span key={i2} className="silver-letter">
                              {c === " " ? "\u00A0" : c}
                            </span>
                          ))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {ad.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-yellow-900/20 border border-yellow-700/30 rounded-full text-xs flex flex-wrap"
                    >
                      {tag.split("").map((c, i2) => (
                        <span key={i2} className="gold-letter">
                          {c === " " ? "\u00A0" : c}
                        </span>
                      ))}
                    </span>
                  ))}
                </div>

              </div>
            </BorderGlow>
          </AnimatedItem>
        ))}
      </div>

    </div>
  );
};