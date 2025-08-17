import { useNavigate } from "react-router-dom";
import { Play, ThumbsUp, Eye } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getVideosUrl, getVideoByIdUrl, getThumbnailUrl } from "../http/VideoServiceUrls";

var videos;

export const getVideos = () => {
  return new Promise((resolve, reject) => {
    fetch(getVideosUrl(false))
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }
        return response.json();
      })
      .then((data) => {
        // Map the response to match the required video structure
        videos = data.map((video) => ({
          videoId: video.videoId, 
          title: video.title,
          description: video.description || "No description available", // Handle if description is null
          uploaderId: video.uploaderId,
          thumbnail: video.thumbnailUrl, // Placeholder thumbnail or update with actual logic
          views: video.viewCount, // Assuming views will be handled later or fetched separately
          likes: video.likeCount, // Assuming likes will be handled later or fetched separately
          creator: "Unknown", // Assuming you have a way to fetch the creator information
          createdAt: video.uploadDate, // Date when the video was uploaded
        }));
        resolve(videos);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getVideoById = (videoId) => {
  return new Promise((resolve, reject) => {
    fetch(getVideoByIdUrl(videoId))
      .then((response) => {
        if (!response.ok) {
          throw new Error("Video not found");
        }
        return response.json();
      })
      .then((data) => {
        resolve(data); // Video found, resolve with data
      })
      .catch((error) => {
        reject(error); // Video not found or error in fetching
      });
  });
};

const VideoBox = ({ video }) => {
  const navigate = useNavigate();
  const { videoId, title, thumbnail, views, likes, creator, createdAt } = video;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24)),
      "day"
    );
  };

  return (
    <div
      onClick={() => navigate(`/video/${videoId}`)}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105 hover:shadow-lg"
    >
      <div className="relative">
        <img src={getThumbnailUrl(videoId)} alt={title} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-12 h-12 text-white" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span className="font-medium"></span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {views.toLocaleString()}
          </div>
          <div className="flex items-center">
            <ThumbsUp className="w-4 h-4 mr-1" />
            {likes.toLocaleString()}
          </div>
          <div>{formatDate(createdAt)}</div>
        </div>
      </div>
    </div>
  );
};

const VideoGrid = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoBox key={video.videoId} video={video} />
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;