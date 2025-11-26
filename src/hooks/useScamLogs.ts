import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ScamLog } from '../types/ScamLog';

export const useScamLogs = () => {
  const [scamLogs, setScamLogs] = useState<ScamLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformScamLogs = useCallback((data: any[]): ScamLog[] => {
    return (data || []).map(row => ({
      id: row.id,
      robloxId: row.roblox_id,
      discordId: row.discord_id,
      reason: row.reason,
      evidenceUrl: row.evidence_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }, []);

  const fetchScamLogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('scam_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedLogs = transformScamLogs(data);
      setScamLogs(transformedLogs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch scam logs');
      console.error('Error fetching scam logs:', err);
    } finally {
      setLoading(false);
    }
  }, [transformScamLogs]);

  useEffect(() => {
    fetchScamLogs();
  }, [fetchScamLogs]);

  return {
    scamLogs,
    loading,
    error,
    fetchScamLogs,
  };
};
