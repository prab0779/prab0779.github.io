import React, { useState } from "react";

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

  return (
    <div className="overflow-hidden w-full">
      <div className="flex gap-6 slider-animation">
        {loop.map((id, i) => (
          <VideoCard key={i} id={id} />
        ))}
      </div>
    </div>
  );
};

const VideoCard = ({ id }: { id: string }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="min-w-[260px] md:min-w-[360px] bg-black border border-gray-700 rounded-xl shadow-lg overflow-hidden">
      {!loaded ? (
        <div
          className="relative w-full h-40 md:h-56 cursor-pointer group"
          onClick={() => setLoaded(true)}
        >
          <img
            src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
            alt="thumbnail"
            className="w-full h-full object-cover"
            loading="lazy"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
              ▶
            </div>
          </div>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1`}
          className="w-full h-40 md:h-56"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};