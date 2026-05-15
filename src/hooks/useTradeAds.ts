import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { TradeAd, CreateTradeAdData } from "../types/TradeAd";

function sanitizeText(input: string, maxLength = 100): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:/gi, '')
    .trim()
    .slice(0, maxLength);
}

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
          "id, items_wanted, items_offering, tags, status, author_name, author_avatar, contact_info, created_at, updated_at, expires_at",
          { count: "estimated" }
        )
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      const transformedAds: TradeAd[] = (data || []).map((row: any) => ({
        id: row.id,
        itemsWanted: row.items_wanted || [],
        itemsOffering: row.items_offering || [],
        tags: row.tags || [],
        status: row.status || "active",
        authorName: row.author_name?.endsWith("#0") ? row.author_name.slice(0, -2) : (row.author_name ?? ""),
        authorAvatar: row.author_avatar,
        contactInfo: row.contact_info,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        expiresAt: row.expires_at,
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
      if (!sessionData?.session) {
        return { data: null, error: "Not authenticated" };
      }

      const userId = sessionData.session.user.id;

      // Server-side rate limit check (1 ad per 5 minutes = 300 seconds)
      const { data: allowed, error: rlError } = await supabase.rpc(
        'check_rate_limit',
        { action_name: 'trade_ad_create', max_requests: 1, window_seconds: 300 }
      );

      if (rlError) {
        console.warn('Rate limit check failed:', rlError.message);
      } else if (allowed === false) {
        return { data: null, error: "You're posting too fast. Please wait a few minutes." };
      }

      const { data: banRecord } = await supabase
        .from("banned_trade_users")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (banRecord) {
        return { data: null, error: "You are banned from posting trade ads." };
      }

      const expiresAt = new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ).toISOString();

      const { data, error } = await supabase
  .from("trade_ads")
  .insert([
    {
      user_id: userId,
      items_wanted: adData.itemsWanted.slice(0, 20),
      items_offering: adData.itemsOffering.slice(0, 20),
      tags: adData.tags.slice(0, 10),
      author_name: sanitizeText(
        adData.authorName.endsWith("#0") ? adData.authorName.slice(0, -2) : adData.authorName,
        50
      ),
      author_avatar: adData.authorAvatar?.startsWith('https://') ? adData.authorAvatar : null,
      contact_info: sanitizeText(adData.contactInfo || '', 200),
      status: "active",
      expires_at: expiresAt,
    },
  ])
  .select()
  .single();

      if (error) {
        const errorMsg = error.message || "";
        if (errorMsg.includes("violates row level security policy")) {
          return {
            data: null,
            error: "Unable to post. Please try logging out and back in.",
          };
        }
        throw error;
      }

      setTotal((t) => t + 1);

      if (page === 1) {
        setTradeAds((prev) => {
          if (prev.some((a) => a.id === data.id)) return prev;

          const mapped: TradeAd = {
            id: data.id,
            itemsWanted: data.items_wanted || [],
            itemsOffering: data.items_offering || [],
            tags: data.tags || [],
            status: data.status || "active",
            authorName: data.author_name?.endsWith("#0") ? data.author_name.slice(0, -2) : (data.author_name ?? ""),
            authorAvatar: data.author_avatar,
            contactInfo: data.contact_info,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            expiresAt: data.expires_at,
          };

          return [mapped, ...prev].slice(0, pageSize);
        });
      }

      return { data, error: null };
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to create trade ad";
      console.error("Insert error:", err);
      return { data: null, error };
    }
  };

  const updateTradeAdStatus = async (
    id: string,
    status: "completed" | "cancelled"
  ) => {
    try {
      const { error } = await supabase
        .from("trade_ads")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setTradeAds((prev) => prev.filter((ad) => ad.id !== id));
      setTotal((t) => Math.max(0, t - 1));

      return { error: null };
    } catch (err) {
      const error =
        err instanceof Error
          ? err.message
          : "Failed to update trade ad";
      return { error };
    }
  };

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