import React from "react";

export const VideoSlider = () => {
  const videos = [
    "AMfUlsWhtNc",
    "fS2u_FNFt84",
    "_HoItTdLc5k",
    "PXkMKWzhNZk",
  ];

  // Duplicate for infinite loop
  const loop = [...videos, ...videos];

  return (
    <div className="overflow-hidden w-full">
      <div className="flex gap-6 slider-animation">
        {loop.map((id, i) => (
          <div
            key={i}
            className="min-w-[260px] md:min-w-[360px] bg-black border border-gray-700 rounded-xl shadow-lg overflow-hidden"
          >
            <iframe
              src={`https://www.youtube.com/embed/${id}`}
              className="w-full h-40 md:h-56"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ))}
      </div>
    </div>
  );
};

