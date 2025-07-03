import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Item } from '../types/Item';

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('value', { ascending: false });

      if (error) throw error;

      // Transform database rows to Item interface
      const transformedItems: Item[] = (data || []).map(row => ({
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

      setItems(transformedItems);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (item: Omit<Item, 'id'>) => {
    try {
      const id = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { data, error } = await supabase
        .from('items')
        .insert([{
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
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchItems(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create item';
      return { data: null, error };
    }
  };

  const updateItem = async (id: string, updates: Partial<Item>) => {
    try {
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

      await fetchItems(); // Refresh the list
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

      await fetchItems(); // Refresh the list
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