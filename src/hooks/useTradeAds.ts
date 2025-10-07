import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TradeAd, CreateTradeAdData } from '../types/TradeAd';

export const useTradeAds = () => {
  const [tradeAds, setTradeAds] = useState<TradeAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTradeAds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trade_ads')
        .select('*')
        .eq('status', 'active')
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform database rows to TradeAd interface
      const transformedAds: TradeAd[] = (data || []).map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        itemsWanted: row.items_wanted || [],
        itemsOffering: row.items_offering || [],
        tags: row.tags || [],
        status: row.status,
        authorName: row.author_name,
        contactInfo: row.contact_info,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        expiresAt: row.expires_at,
      }));

      setTradeAds(transformedAds);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trade ads');
      console.error('Error fetching trade ads:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTradeAd = async (adData: CreateTradeAdData) => {
    try {
      const id = `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { data, error } = await supabase
        .from('trade_ads')
        .insert([{
          id,
          title: adData.title,
          description: adData.description,
          items_wanted: adData.itemsWanted,
          items_offering: adData.itemsOffering,
          tags: adData.tags,
          author_name: adData.authorName,
          contact_info: adData.contactInfo,
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchTradeAds(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create trade ad';
      return { data: null, error };
    }
  };

  const updateTradeAdStatus = async (id: string, status: 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('trade_ads')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      await fetchTradeAds(); // Refresh the list
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update trade ad';
      return { error };
    }
  };

  useEffect(() => {
    fetchTradeAds();
  }, []);

  return {
    tradeAds,
    loading,
    error,
    fetchTradeAds,
    createTradeAd,
    updateTradeAdStatus,
  };
};