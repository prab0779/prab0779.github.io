import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { TradeAd, CreateTradeAdData } from "../types/TradeAd";

export const useTradeAds = () => {
  const [tradeAds, setTradeAds] = useState<TradeAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 50;

  const [total, setTotal] = useState(0);

  const fetchTradeAds = useCallback(async (pageToLoad = page) => {
    try {
      setLoading(true);

      const from = (pageToLoad - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from("trade_ads")
        .select(
          "id, title, items_wanted, items_offering, tags, author_name, author_avatar, contact_info, created_at",
          { count: "exact" }
        )
        .eq("status", "active")
        .gte("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      const transformedAds: TradeAd[] = (data || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        itemsWanted: row.items_wanted || [],
        itemsOffering: row.items_offering || [],
        tags: row.tags || [],
        authorName: row.author_name,
        authorAvatar: row.author_avatar,
        contactInfo: row.contact_info,
        createdAt: row.created_at,
      }));

      setTradeAds(transformedAds);
      setTotal(count ?? 0);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch trade ads");
      console.error("Error fetching trade ads:", err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  const createTradeAd = async (adData: CreateTradeAdData) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) return { data: null, error: "Not authenticated" };

      const userId = sessionData.session.user.id;
      const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from("trade_ads")
        .insert([
          {
            title: adData.title,
            description: adData.description,
            items_wanted: adData.itemsWanted,
            items_offering: adData.itemsOffering,
            tags: adData.tags,
            author_name: adData.authorName,
            author_avatar: adData.authorAvatar,
            contact_info: adData.contactInfo,
            user_id: userId,
            status: "active",
            expires_at: expiresAt,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // If you're on page 1, prepend instantly. Otherwise just bump total.
      setTotal((t) => t + 1);
      if (page === 1) {
        setTradeAds((prev) => {
          if (prev.some((a) => a.id === data.id)) return prev;
          const mapped: TradeAd = {
            id: data.id,
            title: data.title,
            itemsWanted: data.items_wanted || [],
            itemsOffering: data.items_offering || [],
            tags: data.tags || [],
            authorName: data.author_name,
            authorAvatar: data.author_avatar,
            contactInfo: data.contact_info,
            createdAt: data.created_at,
          };
          return [mapped, ...prev].slice(0, pageSize);
        });
      }

      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to create trade ad";
      console.error("Insert error:", err);
      return { data: null, error };
    }
  };

  const updateTradeAdStatus = async (id: string, status: "completed" | "cancelled") => {
    try {
      const { error } = await supabase.from("trade_ads").update({ status }).eq("id", id);
      if (error) throw error;

      setTradeAds((prev) => prev.filter((ad) => ad.id !== id));
      setTotal((t) => Math.max(0, t - 1));
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to update trade ad";
      return { error };
    }
  };

  // Fetch whenever page changes
  useEffect(() => {
    fetchTradeAds(page);
  }, [page, fetchTradeAds]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    tradeAds,
    loading,
    error,

    page,
    pageSize,
    total,
    totalPages,
    setPage,

    fetchTradeAds,
    createTradeAd,
    updateTradeAdStatus,
  };
};
