import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ValueChange } from '../types/Item';

export const useValueChanges = () => {
  const [valueChanges, setValueChanges] = useState<ValueChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchValueChanges = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('value_changes')
        .select('*')
        .order('change_date', { ascending: false });

      if (error) throw error;

      // Transform database rows to ValueChange interface
      const transformedChanges: ValueChange[] = (data || []).map(row => ({
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

      setValueChanges(transformedChanges);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch value changes');
      console.error('Error fetching value changes:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteValueChange = async (id: string) => {
    try {
      const { error } = await supabase
        .from('value_changes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchValueChanges(); // Refresh the list
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete value change';
      return { error };
    }
  };

  useEffect(() => {
    fetchValueChanges();
  }, []);

  return {
    valueChanges,
    loading,
    error,
    fetchValueChanges,
    deleteValueChange,
  };
};