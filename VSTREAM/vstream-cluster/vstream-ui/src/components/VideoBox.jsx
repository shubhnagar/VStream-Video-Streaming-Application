import React from "react";

const VideoBox = ({ video }) => {
  return (
    <div className="border border-gray-300 rounded-lg shadow-lg overflow-hidden">
      <img
        src={`http://localhost:8080/thumbnails/${video.videoId}`}
        alt={video.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <p className="font-semibold text-lg">{video.title}</p>
        <p className="text-gray-500 text-sm">{video.time}</p>
        <p className="text-gray-700 mt-2">{video.likes} likes</p>
      </div>
    </div>
  );
};

export default VideoBox;
