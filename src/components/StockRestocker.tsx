import React, { useEffect, useMemo, useState } from "react";
import { useStockRotation } from "../hooks/useStockRotation";
import { useItems } from "../hooks/useItems";
import BorderGlow from "../Shared/BorderGlow";
import Counter from "../Shared/Counter";
import GradientText from "../Shared/GradientText";
import { getItemImageUrl } from "../lib/supabase";

export const StockRestocker: React.FC = () => {
  const { rotation } = useStockRotation();
  const { items } = useItems();
  const [timeLeft, setTimeLeft] = useState(0);

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

  const getLondonParts = () => {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(new Date());

    const get = (type: string) =>
      Number(parts.find((p) => p.type === type)?.value ?? 0);

    return {
      hour: get("hour"),
      minute: get("minute"),
      second: get("second"),
    };
  };

  const updateCountdown = () => {
    const uk = getLondonParts();
    const nowSeconds = uk.hour * 3600 + uk.minute * 60 + uk.second;

    let nextHour = RESET_HOURS.find((h) => h > uk.hour);
    let secondsUntilNext = 0;

    if (nextHour !== undefined) {
      secondsUntilNext = nextHour * 3600 - nowSeconds;
    } else {
      secondsUntilNext = 24 * 3600 - nowSeconds;
    }

    setTimeLeft(Math.max(0, secondsUntilNext));
  };

  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pb-10 md:pb-14 mt-10">

      <h2 className="text-2xl md:text-3xl font-bold mb-3">
        <GradientText
          variant="gold"
          animationSpeed={6}
        >
          Cosmetic Market
        </GradientText>
      </h2>

      <div className="mb-6 flex items-center gap-3">

  <GradientText variant="silver" animationSpeed={6}>
    Next restock in:
  </GradientText>

  <div className="flex items-center gap-2">

    <Counter
      value={hours}
      places={[10, 1]}
      fontSize={20}
      textColor="#d1d5db"
      digitStyle={{ width: "1ch", display: "inline-block" }}
      gradientFrom="transparent"
      gradientTo="transparent"
    />

    <GradientText variant="silver">:</GradientText>

    <Counter
      value={minutes}
      places={[10, 1]}
      fontSize={20}
      textColor="#d1d5db"
      digitStyle={{ width: "1ch", display: "inline-block" }}
      gradientFrom="transparent"
      gradientTo="transparent"
    />

    <GradientText variant="silver">:</GradientText>

    <Counter
      value={seconds}
      places={[10, 1]}
      fontSize={20}
      textColor="#d1d5db"
      digitStyle={{ width: "1ch", display: "inline-block" }}
      gradientFrom="transparent"
      gradientTo="transparent"
    />

  </div>
</div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {activeItems.map((item, i) => (
          <BorderGlow
            key={i}
            edgeSensitivity={30}
            glowColor="40 80 80"
            backgroundColor="#0c0c0c"
            borderRadius={20}
            glowRadius={30}
            glowIntensity={1}
            coneSpread={25}
            animated={false}
            colors={["#FFD700", "#FFC94D", "#FFB347"]}
          >
            <div className="relative rounded-xl p-5 flex flex-col items-center justify-between transition hover:scale-[1.02]">

              {item ? (
                <>
                  {typeof item.emoji === "string" && (item.emoji.startsWith("/") || item.emoji.startsWith("./") || item.emoji.startsWith("http")) ? (
                    <img
                      src={getItemImageUrl(item.emoji)}
                      alt={item.name}
                      className="w-16 h-16 object-contain mb-4"
                    />
                  ) : (
                    <span className="text-5xl mb-4">{item.emoji}</span>
                  )}

                  <div className="text-lg font-bold mb-4 text-center">
                    <GradientText
                      variant="gold"
                    >
                      {item.name}
                    </GradientText>
                  </div>

                  <div className="bg-gray-800 text-blue-300 text-center font-bold py-2 rounded-md w-full">
                    In Stock
                  </div>
                </>
              ) : (
                <>
                  <div className="text-lg font-bold mb-4 text-center">
                    <GradientText variant="gold">?</GradientText>
                  </div>

                  <div className="bg-gray-800 text-blue-300 text-center font-bold py-2 rounded-md w-full">
                    ?
                  </div>
                </>
              )}

            </div>
          </BorderGlow>
        ))}
      </div>
    </section>
  );
};