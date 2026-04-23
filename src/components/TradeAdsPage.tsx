import React, { useState, useMemo, useEffect } from "react";
import { Search, Eye } from "lucide-react";
import { AnimatedItem } from "../Shared/AnimatedList";
import BorderGlow from "../Shared/BorderGlow";
import GradientText from "../Shared/GradientText";
import { CreateTradeAdModal } from "./CreateTradeAd";
import { useTradeAds } from "../hooks/useTradeAds";
import { useAuth } from "../hooks/useAuth";
import { Item } from "../types/Item";
import { getItemImageUrl } from "../lib/supabase";

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
    tradeAds,
    loading,
    page,
    totalPages,
    setPage,
    total,
    createTradeAd
  } = useTradeAds();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const lightweightItems = useMemo(
    () => items.map(i => ({ name: i.name, emoji: i.emoji, category: i.category, value: i.value })),
    [items]
  );

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 250);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedTag]);

  const filteredTradeAds = useMemo(() => {
    const q = debouncedSearch.toLowerCase();

    return tradeAds.filter((ad) => {
      const matchSearch =
        !q ||
        ad.authorName.toLowerCase().includes(q) ||
        ad.itemsOffering.some((i) => i.itemName.toLowerCase().includes(q)) ||
        ad.itemsWanted.some((i) => i.itemName.toLowerCase().includes(q));

      const matchTag =
        !selectedTag || ad.tags.includes(selectedTag);

      return matchSearch && matchTag;
    });
  }, [tradeAds, debouncedSearch, selectedTag]);

  const renderItemIcon = (emoji: string, name: string) => {
    if (!emoji) return <span>👹</span>;
    if (emoji.startsWith("/") || emoji.startsWith("./") || emoji.startsWith("http")) {
      return (
        <img
          src={getItemImageUrl(emoji)}
          alt={name}
          loading="lazy"
          width={48}
          height={48}
          className="w-12 h-12 object-contain"
        />
      );
    }
    return <span className="text-xl">{emoji}</span>;
  };

  const getRelativeTime = (d: string) => {
    const diff = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  if (loading) {
    return <div className="text-center py-12 text-zinc-400">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-14 mt-20 space-y-10">

      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-4 flex justify-center">
          <GradientText variant="gold">Trade Ads</GradientText>
        </h1>

        <p className="mb-6 text-sm flex justify-center">
          <GradientText variant="silver">
            Post and browse trade offers
          </GradientText>
        </p>

        <button
          onClick={() =>
            !user ? signInWithDiscord() : setShowCreateForm(true)
          }
          className="px-6 py-3 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg border border-yellow-500/20"
        >
          {user ? "Post Trade Ad" : "Login with Discord"}
        </button>
      </div>

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
          {AVAILABLE_TAGS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <div className="flex items-center px-3 bg-[#111] border border-zinc-800 rounded text-white">
          <Eye className="w-4 h-4 mr-1" />
          {total}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {filteredTradeAds.map((ad, index) => (
          <AnimatedItem key={ad.id} index={index}>
            <BorderGlow
              edgeSensitivity={30}
              glowColor="40 80 80"
              backgroundColor="#0c0c0c"
              borderRadius={16}
              glowRadius={30}
              glowIntensity={1}
              coneSpread={25}
              animated={false}
              colors={["#FFD700","#FFC94D","#FFB347"]}
            >
              <div className="p-6 rounded-xl space-y-4">

                <div className="flex items-center gap-2">
                  <img
                    src={ad.authorAvatar}
                    className="w-8 h-8 rounded-full"
                    alt={ad.authorName}
                  />
                  <div>
                    <p className="text-white text-sm">{ad.authorName}</p>
                    <p className="text-zinc-500 text-xs">
                      {getRelativeTime(ad.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">

                  <div className="bg-[#111] p-4 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <GradientText variant="gold">Offering</GradientText>
                      <span className="text-xs text-zinc-500">
                        {ad.itemsOffering.length} {ad.itemsOffering.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>

                   <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                      {ad.itemsOffering.map((i, idx) => (
                        <div
                          key={idx}
                          className="relative min-w-[120px] bg-[#121212] border border-white/10 hover:border-yellow-500/40 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all duration-200">
                        
                          <div className="mb-2">
                            {renderItemIcon(i.emoji, i.itemName)}
                          </div>
                          <p className="text-xs text-zinc-200 truncate w-full px-1">
                            {i.itemName}
                          </p>
                          {i.quantity && i.quantity > 1 && (
                            <span className="absolute top-1 left-1 text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-bold shadow">
                              x{i.quantity}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#111] p-4 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <GradientText variant="gold">Looking For</GradientText>
                      <span className="text-xs text-zinc-500">
                        {ad.itemsWanted.length} {ad.itemsWanted.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                      {ad.itemsWanted.map((i, idx) => (
                        <div
                          key={idx}
                          className="min-w-[120px] bg-[#121212] border border-white/10 hover:border-yellow-500/40 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all duration-200"
                        >
                          <div className="mb-2">
                            {renderItemIcon(i.emoji, i.itemName)}
                          </div>
                          <p className="text-xs text-zinc-200 truncate w-full px-1">
                            {i.itemName}
                          </p>
                          {i.quantity && i.quantity > 1 && (
                            <span className="text-[10px] text-yellow-400 mt-1 font-semibold">
                              x{i.quantity}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {ad.tags && ad.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {ad.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-yellow-700/20 text-yellow-400 text-xs rounded border border-yellow-700/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                </div>

              </div>
            </BorderGlow>
          </AnimatedItem>
        ))}
      </div>

      <div className="flex justify-center gap-2 pt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-[#111] border border-zinc-800 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition"
        >
          Prev
        </button>

        <span className="text-zinc-400 text-sm flex items-center px-4">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-[#111] border border-zinc-800 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition"
        >
          Next
        </button>
      </div>

      {showCreateForm && user && (
        <CreateTradeAdModal
          items={lightweightItems}
          tags={AVAILABLE_TAGS}
          onClose={() => setShowCreateForm(false)}
          onSubmit={createTradeAd}
          authorName={user.user_metadata?.name || "User"}
          authorAvatar={user.user_metadata?.avatar_url || null}
        />
      )}

    </div>
  );
};
