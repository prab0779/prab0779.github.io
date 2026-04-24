import React, { useEffect, useRef, useState } from "react";

export const VideoSlider = () => {
  const videos = [
    "AMfUlsWhtNc",
    "fS2u_FNFt84",
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
          <VideoCard key={`${id}-${i}`} id={id} />
        ))}
      </div>
    </div>
  );
};

const VideoCard = ({ id }: { id: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "200px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="min-w-[260px] md:min-w-[360px] bg-black border border-gray-700 rounded-xl shadow-lg overflow-hidden"
    >
      <div className="relative w-full aspect-video">
        {shouldLoad ? (
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            className="absolute inset-0 w-full h-full"
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <img
            src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            alt=""
          />
        )}
      </div>
    </div>
  );
};