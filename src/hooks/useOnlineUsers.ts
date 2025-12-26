import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// One ID per browser (shared across tabs). If you want per-tab, keep sessionStorage.
const getClientId = () => {
  const key = "aotr_client_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `client_${crypto.randomUUID?.() ?? `${Date.now()}_${Math.random().toString(36).slice(2)}`}`;
    localStorage.setItem(key, id);
  }
  return id;
};

export const useOnlineUsers = () => {
  const [onlineCount, setOnlineCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const clientId = getClientId();

    const channel = supabase.channel("online_users", {
      config: { presence: { key: clientId } },
    });

    const updateCount = () => {
      const state = channel.presenceState();
      setOnlineCount(Object.keys(state).length);
      setLoading(false);
    };

    channel
      .on("presence", { event: "sync" }, updateCount)
      .on("presence", { event: "join" }, updateCount)
      .on("presence", { event: "leave" }, updateCount);

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        // Track ONCE
        await channel.track({ online_at: new Date().toISOString() });
        updateCount();
      }
    });

    const onVisibilityChange = async () => {
      if (!document.hidden) {
        // Only refresh presence when user comes back
        try {
          await channel.track({ online_at: new Date().toISOString() });
        } catch {}
      }
    };

    window.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("visibilitychange", onVisibilityChange);
      // This is enough; untrack is optional but fine
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, []);

  return { onlineCount, loading };
};
