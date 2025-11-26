import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface CreateScamLogInput {
  robloxId: string;
  discordId?: string;
  reason: string;
  evidenceUrl?: string;
}

export const useScamLogsAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createScamLog = useCallback(async (data: CreateScamLogInput) => {
    try {
      setLoading(true);
      setError(null);

      // evidence is JSONB → must store an object
      const evidenceJson =
        data.evidenceUrl && data.evidenceUrl.trim() !== ""
          ? { url: data.evidenceUrl }
          : {};

      const { data: result, error: err } = await supabase
        .from("scam_logs")
        .insert([
          {
            roblox_id: data.robloxId,
            discord_id: data.discordId || null,
            reason: data.reason,
            evidence: evidenceJson,   // FIXED
          },
        ])
        .select();

      if (err) throw err;

      return { data: result, error: null };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create scam log";
      setError(message);
      return { data: null, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteScamLog = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: err } = await supabase
        .from("scam_logs")
        .delete()
        .eq("id", id);

      if (err) throw err;

      return { error: null };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete scam log";
      setError(message);
      return { error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createScamLog,
    deleteScamLog,
  };
};
