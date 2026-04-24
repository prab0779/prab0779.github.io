import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Search, Eye } from "lucide-react";
import { AnimatedItem } from "../Shared/AnimatedList";
import BorderGlow from "../Shared/BorderGlow";
import GradientText from "../Shared/GradientText";
import SplitText from "../Shared/SplitText";
import BlurText from "../Shared/BlurText";
import { CreateTradeAdModal } from "./CreateTradeAd";
import { useTradeAds } from "../hooks/useTradeAds";
import { useAuth } from "../hooks/useAuth";
import { Item } from "../types/Item";
import { getItemImageUrl } from "../lib/supabase";

interface TradeAdsPageProps {
  items: Item[];
}

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(max-width: 768px)").matches
      );
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const lightweightItems = useMemo(
    () =>
      items.map(i => ({
        name: i.name,
        emoji: i.emoji,
        category: i.category,
        value: i.value
      })),
    [items]
  );

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 250);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const filteredTradeAds = useMemo(() => {
    const q = debouncedSearch.toLowerCase();

    return tradeAds.filter(ad =>
      !q ||
      ad.authorName.toLowerCase().includes(q) ||
      ad.itemsOffering.some(i => i.itemName.toLowerCase().includes(q)) ||
      ad.itemsWanted.some(i => i.itemName.toLowerCase().includes(q))
    );
  }, [tradeAds, debouncedSearch]);

  const renderItemIcon = useCallback((emoji: string, name: string) => {
    if (!emoji) return <span>👹</span>;

    if (
      emoji.startsWith("/") ||
      emoji.startsWith("./") ||
      emoji.startsWith("http")
    ) {
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
  }, []);

  const getRelativeTime = useCallback((d: string) => {
    const diff = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  }, []);

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isMobile) {
      return (
        <div className="bg-[#0c0c0c] border border-white/5 rounded-xl">
          {children}
        </div>
      );
    }

    return (
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
        {children}
      </BorderGlow>
    );
  };

  if (loading) {
    return <div className="text-center py-12 text-zinc-400">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 pt-32 pb-16 text-center">

      <SplitText
        text="Trade Ads"
        tag="h1"
        className="text-4xl sm:text-5xl font-extrabold text-[var(--gold-bright)]"
        delay={40}
        duration={0.8}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 30 }}
        to={{ opacity: 1, y: 0 }}
      />

      <div className="h-0.5 w-20 bg-gradient-to-r from-[var(--gold-soft)] via-[var(--gold-bright)] to-transparent rounded-full mt-3 mx-auto" />

      <div className="mt-6 max-w-xl mx-auto min-h-[80px]">
        <BlurText
          text={`Browse and post trade offers from players.\n\nFind upgrades, downgrades, and fair deals.`}
          delay={120}
          animateBy="words"
          direction="top"
          className="text-lg text-gray-400"
        />
      </div>

      <div className="mt-6 mb-8">
        <button
          onClick={() =>
            !user ? signInWithDiscord() : setShowCreateForm(true)
          }
          className="px-6 py-3 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg border border-yellow-500/20"
        >
          {user ? "Post Trade Ad" : "Login with Discord"}
        </button>
      </div>

      <div className="bg-[#0c0c0c] p-4 rounded-xl border border-white/5 flex gap-4 mb-10">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2 text-zinc-400 w-4 h-4" />
          <input
            className="w-full pl-9 py-2 bg-[#111] border border-zinc-800 rounded text-white"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center px-3 bg-[#111] border border-zinc-800 rounded text-white">
          <Eye className="w-4 h-4 mr-1" />
          {total}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 text-left">
        {filteredTradeAds.map((ad, index) => {
          const content = (
            <CardWrapper>
              <div className="p-6 space-y-4">

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

                <div>
                  <div className="flex justify-between mb-2">
                    <GradientText variant="gold">Offering</GradientText>
                    <span className="text-xs text-zinc-500">
                      {ad.itemsOffering.length} items
                    </span>
                  </div>

                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                    {ad.itemsOffering.map((i, idx) => (
                      <div
                        key={`${i.itemName}-${idx}`}
                        className="relative min-w-[120px] bg-[#121212] p-3 rounded-xl flex flex-col items-center"
                      >
                        {renderItemIcon(i.emoji, i.itemName)}

                        <p className="text-xs text-zinc-200 truncate w-full text-center">
                          {i.itemName}
                        </p>

                        {i.quantity > 1 && (
                          <span className="absolute top-1 left-1 text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-bold">
                            x{i.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <GradientText variant="gold">Looking For</GradientText>
                    <span className="text-xs text-zinc-500">
                      {ad.itemsWanted.length} items
                    </span>
                  </div>

                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                    {ad.itemsWanted.map((i, idx) => (
                      <div
                        key={`${i.itemName}-${idx}`}
                        className="relative min-w-[120px] bg-[#121212] p-3 rounded-xl flex flex-col items-center"
                      >
                        {renderItemIcon(i.emoji, i.itemName)}

                        <p className="text-xs text-zinc-200 truncate w-full text-center">
                          {i.itemName}
                        </p>

                        {i.quantity > 1 && (
                          <span className="absolute top-1 left-1 text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-bold">
                            x{i.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </CardWrapper>
          );

          return isMobile ? (
            <div key={ad.id}>{content}</div>
          ) : (
            <AnimatedItem key={ad.id} index={index}>
              {content}
            </AnimatedItem>
          );
        })}
      </div>

      <div className="flex justify-center gap-2 pt-10">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-[#111] border border-zinc-800 rounded text-white disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-zinc-400 px-4">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-[#111] border border-zinc-800 rounded text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {showCreateForm && user && (
        <CreateTradeAdModal
          items={lightweightItems}
          tags={[]}
          onClose={() => setShowCreateForm(false)}
          onSubmit={createTradeAd}
          authorName={user.user_metadata?.name || "User"}
          authorAvatar={user.user_metadata?.avatar_url || null}
        />
      )}
    </div>
  );
};