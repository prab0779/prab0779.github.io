import React from "react";

export const VideoSlider = () => {
  const videos = [
    "AMfUlsWhtNc", // Only video ID -> safest option
  ];

  return (
    <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
      {videos.map((id, i) => (
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
  );
};
