import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { Item } from "../types/Item";

const CACHE_KEY = "aotr_items_cache_v3";
const CACHE_TTL = 1 * 60 * 1000; // 1 minute
const BATCH_SIZE = 1000; // PostgREST default max

const SELECT_COLS = `
  id, name, value, demand, rate_of_change, prestige, status,
  obtained_from, gem_tax, gold_tax, category, rarity, emoji
`;

function transform(data: any[]): Item[] {
  return (data || []).map(row => ({
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
}

function getCache(): Item[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data as Item[];
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function setCache(items: Item[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: items, timestamp: Date.now() }));
  } catch {}
}

async function fetchAllItems(): Promise<Item[]> {
  const all: Item[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from("items")
      .select(SELECT_COLS)
      .order("value", { ascending: false })
      .range(offset, offset + BATCH_SIZE - 1);

    if (error) throw error;

    all.push(...transform(data ?? []));

    if ((data?.length ?? 0) < BATCH_SIZE) break;
    offset += BATCH_SIZE;
  }

  return all;
}

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (bust = false) => {
    if (bust) localStorage.removeItem(CACHE_KEY);

    const cached = bust ? null : getCache();
    if (cached) {
      setItems(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const all = await fetchAllItems();
      setCache(all);
      setItems(all);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => load(true), [load]);

  useEffect(() => { load(); }, []);

  return { items, loading, error, refresh };
};
