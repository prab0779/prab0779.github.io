import React, { useEffect, useRef } from "react";

type AdSlot = "leaderboard" | "rectangle" | "inline";

interface AdBannerProps {
  slot: AdSlot;
  className?: string;
}

const slotDimensions: Record<AdSlot, { w: number; h: number; label: string }> = {
  leaderboard: { w: 728, h: 90, label: "728 × 90" },
  rectangle:   { w: 336, h: 280, label: "336 × 280" },
  inline:      { w: 468, h: 60,  label: "468 × 60"  },
};

export const AdBanner: React.FC<AdBannerProps> = ({ slot, className = "" }) => {
  const ref = useRef<HTMLInsElement>(null);

  useEffect(() => {
    // Push AdSense ad unit when the script is present
    if (typeof (window as any).adsbygoogle !== "undefined") {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch {
        // already pushed
      }
    }
  }, []);

  const { w, h } = slotDimensions[slot];

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{ minHeight: h, maxWidth: "100%" }}
      aria-label="Advertisement"
    >
      {/* Replace data-ad-client and data-ad-slot with your AdSense values */}
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block", width: w, height: h, maxWidth: "100%" }}
        data-ad-client="ca-pub-5953527115992840"
        data-ad-slot="f08c47fec0942fa0"
        data-ad-format={slot === "leaderboard" ? "horizontal" : "rectangle"}
        data-full-width-responsive="true"
      />
    </div>
  );
};
