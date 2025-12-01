import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const StockRestocker: React.FC = () => {
  const [slots, setSlots] = useState([null, null, null, null]);
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  // 6-hour reset times (UK)
  const RESET_HOURS = [0, 6, 12, 18];

  // --- GET NEXT UK RESET TIME ---
  function getNextUKResetDate() {
    const now = new Date();
    const ukNow = new Date(
      now.toLocaleString("en-GB", { timeZone: "Europe/London" })
    );

    const currentHour = ukNow.getHours();
    const nextHour = RESET_HOURS.find(h => h > currentHour) ?? 24;

    const nextReset = new Date(ukNow);
    nextReset.setHours(nextHour === 24 ? 0 : nextHour, 0, 0, 0);

    if (nextHour === 24) nextReset.setDate(nextReset.getDate() + 1);

    return nextReset;
  }

  // --- COUNTDOWN TIMER ---
 function startTimer() {
  let target = getNextUKResetDate();

  const interval = setInterval(() => {
    const now = new Date().getTime();
    const diff = target.getTime() - now;

    // Reset reached
    if (diff <= 0) {
      clearInterval(interval);
      clearSlots();                // Clear items
      target = getNextUKResetDate(); // Get the NEXT reset, NOT the same one again
      startTimer();                // Restart fresh timer
      return;
    }

    // Convert ms to h:m:s
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    setTimeLeft(
      `${String(h).padStart(2, "0")}:${String(m).padStart(
        2,
        "0"
      )}:${String(s).padStart(2, "0")}`
    );
  }, 1000);
}

  // --- LOAD ITEMS FROM SUPABASE ---
  async function loadStock() {
    const { data, error } = await supabase
      .from("stock_rotation")
      .select("slot1, slot2, slot3, slot4")
      .eq("id", 1)
      .single();

    if (!data) return; // fallback: all nulls

    setSlots([
      data.slot1,
      data.slot2,
      data.slot3,
      data.slot4,
    ]);
  }

  // --- CLEAR ITEMS AUTOMATICALLY AT RESET ---
  async function clearSlots() {
    setSlots([null, null, null, null]);

    await supabase
      .from("stock_rotation")
      .update({
        slot1: null,
        slot2: null,
        slot3: null,
        slot4: null
      })
      .eq("id", 1);
  }

  // INITIAL LOAD / TIMER
  useEffect(() => {
    loadStock();
    startTimer();
  }, []);

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pb-10 md:pb-14 mt-10">

      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
        Cosmetic Market
      </h2>

      <p className="text-gray-400 mb-6">
        Next restock in: {timeLeft}
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
