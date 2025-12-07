import React, { useEffect, useState } from "react";
import { useStockRotation } from "../hooks/useStockRotation";
import { useItems } from "../hooks/useItems";

export const StockRestocker: React.FC = () => {
  const { rotation } = useStockRotation();
  const { items } = useItems();

  const [timeLeft, setTimeLeft] = useState("00:00:00");

  const RESET_HOURS = [0, 6, 12, 18];

  const getDisplayItem = (id: string | null) => {
    if (!id) return null;
    return items.find((i) => i.id === id) || null;
  };

  const activeItems = [
    getDisplayItem(rotation.slot1_id),
    getDisplayItem(rotation.slot2_id),
    getDisplayItem(rotation.slot3_id),
    getDisplayItem(rotation.slot4_id),
  ];

  function updateCountdown() {
    const now = new Date();
    const ukNow = new Date(now.toLocaleString("en-GB", { timeZone: "Europe/London" }));
    const currentHour = ukNow.getHours();

    let nextHour = RESET_HOURS.find((h) => h > currentHour);
    const nextReset = new Date(ukNow);

    if (!nextHour && nextHour !== 0) {
      nextHour = 0;
      nextReset.setDate(nextReset.getDate() + 1);
    }

    nextReset.setHours(nextHour!, 0, 0, 0);

    const diffMs = nextReset.getTime() - ukNow.getTime();

    const h = Math.floor(diffMs / 3600000);
    const m = Math.floor((diffMs % 3600000) / 60000);
    const s = Math.floor((diffMs % 60000) / 1000);

    const pad = (n: number) => String(n).padStart(2, "0");
    setTimeLeft(`${pad(h)}:${pad(m)}:${pad(s)}`);
  }

  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
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
        {activeItems.map((item, i) => (
          <div
            key={i}
            className="relative bg-black border border-yellow-600 rounded-xl p-5 shadow-xl flex flex-col items-center justify-between transition hover:scale-[1.02]"
          >
            {item ? (
              <>
                {/* ICON / PNG */}
                {item.emoji.startsWith("/") ? (
                  <img
                    src={item.emoji}
                    alt={item.name}
                    className="w-16 h-16 object-contain mb-4"
                  />
                ) : (
                  <span className="text-5xl mb-4">{item.emoji}</span>
                )}

                {/* NAME */}
                <div className="text-yellow-300 text-lg font-bold mb-4 tracking-wide text-center">
                  {item.name}
                </div>

                {/* STATUS */}
                <div className="bg-gray-800 text-blue-300 text-center font-bold py-2 rounded-md w-full">
                  In Stock
                </div>
              </>
            ) : (
              <>
                <div className="text-yellow-300 text-lg font-bold mb-4 tracking-wide text-center">
                  ?
                </div>
                <div className="bg-gray-800 text-blue-300 text-center font-bold py-2 rounded-md w-full">
                  ?
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
