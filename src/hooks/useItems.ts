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

  const getCachedItems = useCallback((): Item[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > CACHE_TTL) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return data;
    } catch {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  }, []);

  const setCachedItems = useCallback((items: Item[]) => {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: items,
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
          .select(
            `
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
          `
          )
          .order("value", { ascending: false })
          .range(from, to);

        if (error) throw error;

        const transformed = transformItems(data);

        setItems((prev) =>
          append ? [...prev, ...transformed] : transformed
        );

        setHasMore(transformed.length === PAGE_SIZE);
        setPage(pageToFetch);

        if (pageToFetch === 0) {
          setCachedItems(transformed);
        }

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
    [transformItems, setCachedItems]
  );

  const fetchItems = useCallback(async () => {
    const cached = getCachedItems();

    if (cached) {
      setItems(cached);
      setLoading(false);
      setHasMore(true);
      return;
    }

    await fetchPage(0);
  }, [getCachedItems, fetchPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    fetchPage(page + 1, true);
  }, [page, hasMore, loadingMore, fetchPage]);

  const refresh = useCallback(async () => {
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