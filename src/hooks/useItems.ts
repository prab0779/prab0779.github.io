import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { Item } from "../types/Item";

const CACHE_KEY = "aotr_items_cache";
const CACHE_TTL = 60 * 60 * 1000;

const PAGE_SIZE = 50;

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const transformItems = useCallback((data: any[]): Item[] => {
    return (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      value: row.value,
      demand: row.demand,
      rateOfChange: row.rate_of_change,
      prestige: row.prestige,
      status: row.status,
      obtainedFrom: row.obtained_from,
      gemTax: row.gem_tax,
      goldTax: row.gold_tax,
      category: row.category,
      rarity: row.rarity,
      emoji: row.emoji,
    }));
  }, []);

  const getCache = useCallback(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);

      if (Date.now() - parsed.timestamp > CACHE_TTL) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return parsed;
    } catch {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  }, []);

  const setCache = useCallback((allItems: Item[]) => {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: allItems,
          timestamp: Date.now(),
        })
      );
    } catch {}
  }, []);

  const fetchPage = useCallback(
    async (pageToFetch: number, append = false) => {
      try {
        if (pageToFetch === 0 && !append) setLoading(true);
        else setLoadingMore(true);

        const from = pageToFetch * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const { data, error } = await supabase
          .from("items")
          .select(`
            id,
            name,
            value,
            demand,
            rate_of_change,
            prestige,
            status,
            obtained_from,
            gem_tax,
            gold_tax,
            category,
            rarity,
            emoji
          `)
          .order("value", { ascending: false })
          .range(from, to);

        if (error) throw error;

        const transformed = transformItems(data);

        setItems((prev) => {
          const updated = append ? [...prev, ...transformed] : transformed;
          setCache(updated);
          return updated;
        });

        setHasMore(transformed.length === PAGE_SIZE);
        setPage(pageToFetch);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch items"
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [transformItems, setCache]
  );

  const fetchItems = useCallback(async () => {
    const cached = getCache();

    if (cached?.data?.length) {
      setItems(cached.data);

      const cachedPages = Math.ceil(cached.data.length / PAGE_SIZE);
      setPage(cachedPages - 1);
      setHasMore(true);

      setLoading(false);
      return;
    }

    await fetchPage(0);
  }, [getCache, fetchPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    fetchPage(page + 1, true);
  }, [page, hasMore, loadingMore, fetchPage]);

  const refresh = useCallback(async () => {
    localStorage.removeItem(CACHE_KEY);
    await fetchPage(0);
  }, [fetchPage]);

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
  };
};