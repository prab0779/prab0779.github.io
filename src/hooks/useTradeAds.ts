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
      .select('id, title, items_wanted, items_offering, tags, author_name, author_avatar, contact_info, created_at')
      .eq('status', 'active')
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .range(0, 29); // 🔥 loads only 30 ads instead of whole database

    if (error) throw error;

    const transformedAds: TradeAd[] = (data || []).map(row => ({
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
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData?.session) {
      return { data: null, error: "Not authenticated" };
    }

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
          author_avatar: adData.authorAvatar, // after you rename DB column
          contact_info: adData.contactInfo,

          user_id: userId,                   // ✅ ADD THIS
          status: "active",
          expires_at: expiresAt,
        }
      ])
      .select()
      .single();

    if (error) throw error;

    await fetchTradeAds();
    return { data, error: null };

  } catch (err) {
    const error = err instanceof Error ? err.message : "Failed to create trade ad";
    console.error("Insert error:", err);
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

      await fetchTradeAds();
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
