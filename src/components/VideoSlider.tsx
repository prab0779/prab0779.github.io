import React, { useEffect, useRef, useState } from "react";

export const VideoSlider = () => {
  const videos = [
    "AMfUlsWhtNc",
    "fS2u_FNFt84",
    "_HoItTdLc5k",
    "PXkMKWzhNZk",
    "8mz3dUJXhdc",
    "EEAh7q1NcA8",
  ];

  const loop = [...videos, ...videos];
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="overflow-hidden w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex gap-6 slider-animation"
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {loop.map((id, i) => (
          <VideoCard key={i} id={id} />
        ))}
      </div>
    </div>
  );
};

const VideoCard = ({ id }: { id: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="min-w-[260px] md:min-w-[360px] bg-black border border-gray-700 rounded-xl shadow-lg overflow-hidden"
    >
      {isVisible ? (
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          className="w-full h-40 md:h-56"
          allow="encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <img
          src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
          className="w-full h-40 md:h-56 object-cover"
          loading="lazy"
        />
      )}
    </div>
  );
};