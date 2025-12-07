import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const StockRestocker: React.FC = () => {
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null]);
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  const RESET_HOURS = [0, 6, 12, 18];

  // Load stock from Supabase
  async function loadStock() {
    const { data, error } = await supabase
      .from("stock_rotation")
      .select("slot1, slot2, slot3, slot4")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("Error loading stock_rotation:", error);
      return;
    }

    if (!data) return setSlots([null, null, null, null]);

    setSlots([data.slot1, data.slot2, data.slot3, data.slot4]);
  }

  // Countdown timer
  function updateCountdown() {
    const now = new Date();
    const ukNow = new Date(
      now.toLocaleString("en-GB", { timeZone: "Europe/London" })
    );

    const currentHour = ukNow.getHours();
    let nextHour = RESET_HOURS.find((h) => h > currentHour);

    const nextReset = new Date(ukNow);
    if (nextHour === undefined) {
      nextHour = 0;
      nextReset.setDate(nextReset.getDate() + 1);
    }

    nextReset.setHours(nextHour, 0, 0, 0);

    const diffMs = nextReset.getTime() - ukNow.getTime();
    const h = Math.floor(diffMs / 3600000);
    const m = Math.floor((diffMs % 3600000) / 60000);
    const s = Math.floor((diffMs % 60000) / 1000);

    const pad = (n: number) => String(n).padStart(2, "0");

    setTimeLeft(`${pad(h)}:${pad(m)}:${pad(s)}`);
  }

  useEffect(() => {
    loadStock();
    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper to extract parts
  const parseItem = (entry: string | null) => {
    if (!entry) return { img: null, name: null };
    const parts = entry.split(" ");
    const img = parts[0]; // `/aincradblade.png`
    const name = parts.slice(1).join(" "); // `Aincrad Blade`
    return { img, name };
  };

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pb-10 md:pb-14 mt-10">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
        Cosmetic Market
      </h2>

      <p className="text-gray-400 mb-6">Next restock in: {timeLeft}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {slots.map((item, i) => {
          const { img, name } = parseItem(item);

          return (
            <div
              key={i}
              className="relative bg-black border border-yellow-600 rounded-xl p-5 shadow-xl flex flex-col items-center justify-between transition hover:scale-[1.02]"
            >
              {/* Display image + name */}
              {img ? (
                <>
                  <img
                    src={img}
                    alt={name ?? ""}
                    className="w-20 h-20 object-contain mb-3"
                  />

                  <div className="text-yellow-300 text-lg font-bold text-center">
                    {name}
                  </div>
                </>
              ) : (
                <div className="text-yellow-300 text-3xl font-bold mb-3">?</div>
              )}

              {/* Bottom bar */}
              <div className="w-full">
                <div className="bg-gray-800 text-blue-300 text-center font-bold py-2 rounded-md">
                  {item ? "In Stock" : "?"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
