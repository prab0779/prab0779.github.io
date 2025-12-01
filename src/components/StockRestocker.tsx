import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getNextReset } from "../types/getNextReset";

export const StockRestocker: React.FC = () => {
  const [stock, setStock] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  useEffect(() => {
    loadStock();
    const interval = setInterval(loadStock, 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadStock() {
    console.log("Loading stock…");

    const { data, error } = await supabase
      .from("stock_rotation")
      .select("*")
      .eq("id", 1)
      .single();

    console.log("Supabase Data:", data);
    console.log("Supabase Error:", error);

    // If no row → DO NOT hide the UI, just show placeholder
    if (!data) {
      console.log("No stock data found.");
      setStock(null);
      return;
    }

    // Check expiry
    const now = new Date();
    const expiry = new Date(data.expires_at);

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
          expires_at: next,
        })
        .eq("id", 1);

      setStock({
        slot1: null,
        slot2: null,
        slot3: null,
        slot4: null,
        expires_at: next,
      });

      setTimer(next);
      return;
    }

    setStock(data);
    setTimer(data.expires_at);
  }

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

  // ALWAYS display UI (with placeholders if needed)
  const slots = stock
    ? [stock.slot1, stock.slot2, stock.slot3, stock.slot4]
    : [null, null, null, null];

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pb-10 md:pb-14 mt-10">

      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
        Stock Restocker
      </h2>

      <p className="text-gray-400 mb-6">
        Next restock in: {stock ? timeLeft : "loading…"}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {slots.map((item, i) => (
          <div
            key={i}
            className="relative bg-black border border-yellow-600 rounded-xl p-5 shadow-xl flex flex-col items-center justify-between transition hover:scale-[1.02]"
          >
            <div className="text-yellow-300 text-lg font-bold mb-4 tracking-wide">
              {item ?? "?"}
            </div>

            <div className="w-full">
              <div className="bg-gray-800 text-blue-300 text-center font-bold py-2 rounded-md">
                {item ? "In Stock" : "?"}
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
