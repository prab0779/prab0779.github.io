import React, { useEffect, useMemo, useState } from "react";
import { useStockRotation } from "../hooks/useStockRotation";
import { useItems } from "../hooks/useItems";

export const StockRestocker: React.FC = () => {
  const { rotation } = useStockRotation();
  const { items } = useItems();
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  const RESET_HOURS = [0, 6, 12, 18];

  const getDisplayItem = (id: string | null) => {
    if (!id) return null;
    return items.find((i) => String(i.id) === String(id)) || null;
  };

  const activeItems = useMemo(
    () => [
      getDisplayItem(rotation.slot1_id),
      getDisplayItem(rotation.slot2_id),
      getDisplayItem(rotation.slot3_id),
      getDisplayItem(rotation.slot4_id),
    ],
    [rotation, items]
  );

  // ✅ reliable London time parts (no Date parsing)
  const getLondonParts = () => {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(new Date());

    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);

    return {
      year: get("year"),
      month: get("month"),
      day: get("day"),
      hour: get("hour"),
      minute: get("minute"),
      second: get("second"),
    };
  };

  const updateCountdown = () => {
    const uk = getLondonParts();
    const nowSeconds = uk.hour * 3600 + uk.minute * 60 + uk.second;

    // find next reset hour
    let nextHour = RESET_HOURS.find((h) => h > uk.hour);
    let secondsUntilNext = 0;

    if (nextHour !== undefined) {
      // later today
      secondsUntilNext = nextHour * 3600 - nowSeconds;
    } else {
      // tomorrow at 00:00
      secondsUntilNext = 24 * 3600 - nowSeconds;
    }

    // safety
    secondsUntilNext = Math.max(0, secondsUntilNext);

    const h = Math.floor(secondsUntilNext / 3600);
    const m = Math.floor((secondsUntilNext % 3600) / 60);
    const s = Math.floor(secondsUntilNext % 60);

    const pad = (n: number) => String(n).padStart(2, "0");
    setTimeLeft(`${pad(h)}:${pad(m)}:${pad(s)}`);
  };

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

      <p className="text-gray-400 mb-6">Next restock in: {timeLeft}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {activeItems.map((item, i) => (
          <div
            key={i}
            className="relative bg-black border border-yellow-600 rounded-xl p-5 shadow-xl flex flex-col items-center justify-between transition hover:scale-[1.02]"
          >
            {item ? (
              <>
                {typeof item.emoji === "string" && item.emoji.startsWith("/") ? (
                  <img
                    src={item.emoji}
                    alt={item.name}
                    className="w-16 h-16 object-contain mb-4"
                  />
                ) : (
                  <span className="text-5xl mb-4">{item.emoji}</span>
                )}

                <div className="text-yellow-300 text-lg font-bold mb-4 tracking-wide text-center">
                  {item.name}
                </div>

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
