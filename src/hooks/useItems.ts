import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Item } from '../types/Item';

const CACHE_KEY = 'aotr_items_cache';
const CACHE_TTL = 60 * 60 * 1000; // ✅ 1 hour cache

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformItems = useCallback((data: any[]): Item[] => {
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
    } catch {
      // Ignore errors
    }
  }, []);

  const fetchItems = useCallback(async () => {
    const cached = getCachedItems();
    if (cached) {
      setItems(cached);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('items')
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
        .order('value', { ascending: false })
        .range(0, 199); // ✅ Limit to 200 items for safety

      if (error) throw error;

      const transformedItems = transformItems(data);
      setItems(transformedItems);
      setCachedItems(transformedItems);
      setError(null);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, [transformItems, getCachedItems, setCachedItems]);

  const createItem = async (item: Omit<Item, 'id'>) => {
    try {
      const id = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const { data, error } = await supabase
        .from('items')
        .insert([
          {
            id,
            name: item.name,
            value: item.value,
            demand: item.demand,
            rate_of_change: item.rateOfChange,
            prestige: item.prestige,
            status: item.status,
            obtained_from: item.obtainedFrom,
            gem_tax: item.gemTax,
            gold_tax: item.goldTax,
            category: item.category,
            rarity: item.rarity,
            emoji: item.emoji,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      await fetchItems();
      return { data, error: null };

    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create item';
      return { data: null, error };
    }
  };

  const updateItem = async (id: string, updates: Partial<Item>) => {
    try {
      const { data: currentItem, error: fetchError } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const { data, error } = await supabase
        .from('items')
        .update({
          name: updates.name,
          value: updates.value,
          demand: updates.demand,
          rate_of_change: updates.rateOfChange,
          prestige: updates.prestige,
          status: updates.status,
          obtained_from: updates.obtainedFrom,
          gem_tax: updates.gemTax,
          gold_tax: updates.goldTax,
          category: updates.category,
          rarity: updates.rarity,
          emoji: updates.emoji,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const hasValueChange = currentItem.value !== updates.value;
      const hasDemandChange = currentItem.demand !== updates.demand;
      const hasRateChange = currentItem.rate_of_change !== updates.rateOfChange;

      if (hasValueChange || hasDemandChange || hasRateChange) {
        let changeType: 'increase' | 'decrease' | 'stable' = 'stable';
        let percentageChange = 0;

        if (hasValueChange && updates.value !== undefined) {
          if (updates.value > currentItem.value) changeType = 'increase';
          else if (updates.value < currentItem.value) changeType = 'decrease';

          percentageChange =
            ((updates.value - currentItem.value) / currentItem.value) * 100;
        }

        await supabase.from('value_changes').insert([
          {
            id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            item_id: id,
            item_name: updates.name || currentItem.name,
            emoji: updates.emoji || currentItem.emoji,
            old_value: currentItem.value,
            new_value: updates.value || currentItem.value,
            old_demand: currentItem.demand,
            new_demand: updates.demand || currentItem.demand,
            old_rate_of_change: currentItem.rate_of_change,
            new_rate_of_change: updates.rateOfChange || currentItem.rate_of_change,
            change_date: new Date().toISOString(),
            change_type: changeType,
            percentage_change: percentageChange,
          },
        ]);
      }

      await fetchItems();
      return { data, error: null };

    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update item';
      return { data: null, error };
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchItems();
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete item';
      return { error };
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  };
};
