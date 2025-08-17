import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThumbsUp, Eye, ArrowLeft, Loader2 } from "lucide-react";
import Hls from "hls.js";
import { getVideoById } from "./VideoGrid";
import Comments from "./Comment";
import { getHlsUrl, getLikeVideoUrl, getViewVideoUrl } from "../http/VideoServiceUrls"; 
import { jwtDecode } from "jwt-decode";

const VideoPlayer = () => {
  const isFirstRender = useRef(true); 
  const { videoId } = useParams();
  console.log("Video ID from route:", videoId);
  const navigate = useNavigate();
  const [video, setVideo] = useState({
    title: "",
    thumbnail: "",
    videoUrl: "",
    views: 0, // Default 0 for views
    likes: 0, // Default 0 for likes
    creator: "",
    description: "",
    isLiked: false,
  });
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null); // Reference to the video element

  const handleViewCount = async () => {
    // const { videoId } = useParams();
    try {
      const response = await fetch(getViewVideoUrl(videoId), {
        method: "PUT",
        headers: { // Include token in Authorization header
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        console.log(`Video view count updated successfully`);
      } else {
        console.error("Failed to update view status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating view status:", error);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      handleViewCount(); // Trigger view count update on initial render
      isFirstRender.current = false; // Mark that the first render has occurred
    }
    const fetchVideo = async () => {
      try {
        const data = await getVideoById(videoId);  // Fetch video details based on ID from URL
        console.log("Fetched video data:", data); // Debug log
        setVideo({
          ...data, // Spread the fetched data
          views: data?.views || 0, // Ensure views default to 0 if not available
          likes: data?.likes || 0, // Ensure likes default to 0 if not available
          uploaderId: data?.uploaderId,
        });
      } catch (error) {
        console.error("Error fetching video:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId]);
  
  useEffect(() => {
    if (video && video.videoUrl && video.uploaderId && videoRef.current) {
      const videoUrl = getHlsUrl(video.uploaderId, videoId); 
      console.log(videoUrl);
  
      // Initialize HLS.js
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoUrl);  // Load HLS stream
        hls.attachMedia(videoRef.current);  // Attach to the video element
  
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("HLS manifest loaded, starting playback");
        });
  
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error:", data);
        });
  
        return () => {
          hls.destroy(); // Clean up HLS instance
        };
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        // For Safari or native HLS support
        videoRef.current.src = video.videoUrl;
      }
    }
  }, [video]);

  


  // Handle the like button click
  const handleLike = async () => {
    // const { videoId } = useParams();
    const authToken = localStorage.getItem("authToken");
    let userId;
  
    try {
      // Decode the JWT to extract the user ID
      const decodedToken = jwtDecode(authToken);
      userId = decodedToken.user_id; // Replace with the correct key for user ID in the token
    } catch (error) {
      console.error("Failed to decode authToken:", error);
      return;
    }
  
    try {
      const response = await fetch(getLikeVideoUrl(videoId, userId), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`, // Include token in Authorization header
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLiked: !prevVideo.isLiked,
          likes: prevVideo.isLiked ? prevVideo.likes - 1 : prevVideo.likes + 1,
        }));
        console.log(`Video like status updated successfully for user ID: ${userId}`);
      } else {
        console.error("Failed to update like status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Video not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <div className="bg-black rounded-xl overflow-hidden mb-6">
        <video
          ref={videoRef} // Attach ref for HLS.js
          controls
          className="w-full aspect-video h-[40rem] object-cover"
          poster={video.thumbnail}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-600">
              <Eye className="w-5 h-5 mr-1" />
              {video?.viewCount ? video.viewCount.toLocaleString() : "0"} views
            </div>
            <button
              onClick={handleLike}
              className={`flex items-center px-3 py-1 rounded-full ${
                video?.isLiked ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <ThumbsUp
                className={`w-5 h-5 mr-1 ${video?.isLiked ? "fill-current" : ""}`}
              />
              {video?.likeCount ? video.likeCount.toLocaleString() : "0"} likes
            </button>
          </div>
        </div>
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">{video.creator}</h3>
          <p className="text-gray-700">{video.description}</p>
        </div>
        <Comments videoId={video.videoId} />
      </div>
    </div>
  );
};

export default VideoPlayer;