import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";
import { ValueChange } from "../types/Item";

const PAGE_SIZE = 50;
const CACHE_KEY = "aotr_value_changes_cache";
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

function getCachedChanges(): ValueChange[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    sessionStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function setCachedChanges(changes: ValueChange[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: changes, timestamp: Date.now() }));
  } catch {}
}

export const useValueChanges = () => {
  const [valueChanges, setValueChanges] = useState<ValueChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const initialFetchDone = useRef(false);

  const fetchPage = useCallback(async (pageToFetch: number, append = false) => {
    try {
      if (pageToFetch === 0 && !append) setLoading(true);
      else setLoadingMore(true);

      const from = pageToFetch * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from("value_changes")
        .select(`
          id,
          item_id,
          item_name,
          emoji,
          old_value,
          new_value,
          old_demand,
          new_demand,
          old_rate_of_change,
          new_rate_of_change,
          change_date,
          change_type,
          percentage_change
        `)
        .order("change_date", { ascending: false })
        .range(from, to);

      if (error) throw error;

      const transformed: ValueChange[] = (data || []).map((row) => ({
        id: row.id,
        itemId: row.item_id,
        itemName: row.item_name,
        emoji: row.emoji,
        oldValue: row.old_value,
        newValue: row.new_value,
        oldDemand: row.old_demand,
        newDemand: row.new_demand,
        oldRateOfChange: row.old_rate_of_change,
        newRateOfChange: row.new_rate_of_change,
        changeDate: row.change_date,
        changeType: row.change_type,
        percentageChange: row.percentage_change,
      }));

      const updated = append
        ? [...valueChanges, ...transformed]
        : transformed;

      setValueChanges(updated);
      if (pageToFetch === 0 && !append) setCachedChanges(transformed);

      setHasMore(transformed.length === PAGE_SIZE);
      setPage(pageToFetch);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch value changes"
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [valueChanges]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    fetchPage(page + 1, true);
  }, [page, hasMore, loadingMore, fetchPage]);

  const refresh = useCallback(async () => {
    sessionStorage.removeItem(CACHE_KEY);
    await fetchPage(0);
  }, [fetchPage]);

  const deleteValueChange = async (id: string) => {
    const previous = valueChanges;

    setValueChanges((prev) => prev.filter((item) => item.id !== id));

    try {
      const { error } = await supabase
        .from("value_changes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      sessionStorage.removeItem(CACHE_KEY);
      return { error: null };
    } catch (err) {
      setValueChanges(previous);

      return {
        error:
          err instanceof Error
            ? err.message
            : "Failed to delete value change",
      };
    }
  };

  useEffect(() => {
    if (initialFetchDone.current) return;
    initialFetchDone.current = true;

    const cached = getCachedChanges();
    if (cached) {
      setValueChanges(cached);
      setHasMore(cached.length === PAGE_SIZE);
      setLoading(false);
      return;
    }
    fetchPage(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    valueChanges,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
    deleteValueChange,
  };
};
