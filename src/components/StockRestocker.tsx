import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getNextReset } from "../types/getNextReset";

export const StockRestocker: React.FC = () => {
  const [stock, setStock] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  // Auto-load stock
  useEffect(() => {
    loadStock();
    const interval = setInterval(loadStock, 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadStock() {
    // Check if expired
    const { data } = await supabase
      .from("stock_rotation")
      .select("*")
      .eq("id", 1)
      .single();

    console.log("SUPABASE RESPONSE:", data);
    console.log("SUPABASE ERROR:", error);

    if (!data) return;

    const now = new Date();
    const expiry = new Date(data.expires_at);

    // If expired → reset
    if (now >= expiry) {
      const next = getNextReset();
      await supabase
        .from("stock_rotation")
        .update({
          slot1: null,
          slot2: null,
          slot3: null,
          slot4: null,
          updated_for_cycle: false,
          expires_at: next
        })
        .eq("id", 1);

      setStock({
        slot1: null,
        slot2: null,
        slot3: null,
        slot4: null,
        expires_at: next
      });

      setTimer(next);
      return;
    }

    setStock(data);
    setTimer(data.expires_at);
  }

  // Countdown Timer
  function setTimer(expiresAt: string) {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();

      const diff = expiry - now;
      if (diff <= 0) {
        setTimeLeft("00:00:00");
        clearInterval(interval);
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(
          2,
          "0"
        )}:${String(s).padStart(2, "0")}`
      );
    }, 1000);
  }

  if (!stock) return null;

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pb-10 md:pb-14">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
        Stock Restocker
      </h2>

      <p className="text-gray-400 mb-6">Next restock in: {timeLeft}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[stock.slot1, stock.slot2, stock.slot3, stock.slot4].map(
          (item, i) => (
            <div
              key={i}
              className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 flex justify-center items-center text-white text-xl font-bold"
            >
              {item ?? "?"}
            </div>
          )
        )}
      </div>
    </section>
  );
};
