import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Upload,
  Trash2,
  Edit2,
  X,
  User,
  Film,
  Eye,
  Play,
  ThumbsUp,
  Clock,
} from "lucide-react";
import { getUploadVideoUrl } from "../http/VideoServiceUrls";
import { useNavigate } from "react-router-dom";
import { getVideosUrlUserId, getVideoByIdUrl, getThumbnailUrl } from "../http/VideoServiceUrls";

export const getVideos = () => {
  return new Promise((resolve, reject) => {
    const authToken = localStorage.getItem("authToken");
    let uploaderId;
    var videos;

    try {
      // Decode the JWT to extract user information
      const decodedToken = jwtDecode(authToken);
      uploaderId = decodedToken.user_id; // Replace with the correct key for uploaderId
    } catch (error) {
      console.error("Failed to decode authToken:", error);
      return;
    }
    fetch(getVideosUrlUserId(false, uploaderId))
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
          views: 0, // Assuming views will be handled later or fetched separately
          likes: 0, // Assuming likes will be handled later or fetched separately
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


const UserPage = () => {
  
  const authToken = localStorage.getItem("authToken");
  const decodedToken = jwtDecode(authToken);
  const [userInfo, setUserInfo] = useState({
    name: decodedToken.full_name,
    email: decodedToken.username,
    // bio: "Video creator and editor",
  });
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    video: null,
    thumbnail: null,
  });

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getVideos();
        setVideos(Array.isArray(data) ? data : []); // Set videos or fallback to empty array
      } catch (error) {
        console.error("Error fetching videos:", error);
        setVideos([]); // Fallback to an empty array in case of an error
      }
    };
    fetchVideos();
  }, []);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24)),
      "day"
    );
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    // Get the authToken from localStorage
    const authToken = localStorage.getItem("authToken");
    let uploaderId;

    try {
      // Decode the JWT to extract user information
      const decodedToken = jwtDecode(authToken);
      uploaderId = decodedToken.user_id; // Replace with the correct key for uploaderId
    } catch (error) {
      console.error("Failed to decode authToken:", error);
      return;
    }

    const formData = new FormData();
    formData.append("title", uploadData.title);
    formData.append("description", uploadData.description);
    formData.append("videoFile", uploadData.video); // Attach the video file
    formData.append("thumbnailFile", uploadData.thumbnail); // Attach the thumbnail file
    formData.append("uploaderId", uploaderId); // Include uploaderId

    try {
      const response = await fetch(getUploadVideoUrl(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`, // Include authToken in headers
        },
        body: formData,
      });

      

      if (response.ok) {
        let savedVideo = {};
        try {
          // Attempt to parse the JSON response
          savedVideo = await response.json();
        } catch (parseError) {
          console.warn("Response body is empty or invalid JSON:", parseError);
        }
        setIsModalOpen(false);
        setUploadData({
          title: "",
          description: "",
          video: null,
          thumbnail: null,
        });
      } else {
        console.error("Failed to upload video");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    // Get the authToken from localStorage
    const authToken = localStorage.getItem("authToken");
    let uploaderId;

    try {
      // Decode the JWT to extract user information
      const decodedToken = jwtDecode(authToken);
      uploaderId = decodedToken.user_id; // Replace with the correct key for uploaderId
    } catch (error) {
      console.error("Failed to decode authToken:", error);
      return;
    }

    const formData = new FormData();
    formData.append("title", uploadData.title);
    formData.append("description", uploadData.description);
    formData.append("videoFile", uploadData.video); // Attach the video file
    formData.append("thumbnailFile", uploadData.thumbnail); // Attach the thumbnail file
    formData.append("uploaderId", uploaderId); // Include uploaderId

    try {
      const response = await fetch(getUploadVideoUrl(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`, // Include authToken in headers
        },
        body: formData,
      });

      

      if (response.ok) {
        let savedVideo = {};
        try {
          // Attempt to parse the JSON response
          savedVideo = await response.json();
        } catch (parseError) {
          console.warn("Response body is empty or invalid JSON:", parseError);
        }
        setIsModalOpen(false);
        setUploadData({
          title: "",
          description: "",
          video: null,
          thumbnail: null,
        });
      } else {
        console.error("Failed to upload video");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };
  
  

  const handleDeleteVideo = async (videoId) => {
    // e.preventDefault();

    // Get the authToken from localStorage
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await fetch(getVideoByIdUrl(videoId), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`, // Include authToken in headers
        }
      });

      if (response.ok) {
        console.log("video deleted successfuly")
        window.location.reload();
      } else {
        console.error("Failed to upload video");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
    setVideos(videos.filter((video) => video.id !== videoId));
  };

  const handleUpdateVideo = (videoId, updatedData) => {
    setVideos(
      videos.map((video) =>
        video.id === videoId ? { ...video, ...updatedData } : video
      )
    );
    setEditingVideo(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-24">
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            {!isEditingProfile ? (
              <div>
                <h2 className="text-2xl font-bold">{userInfo.name}</h2>
                <p className="text-gray-600">{userInfo.email}</p>
                <p className="text-gray-700 mt-2">{userInfo.bio}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, name: e.target.value })
                  }
                  className="block w-full px-3 py-2 border rounded-lg"
                  placeholder="Name"
                />
                <input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, email: e.target.value })
                  }
                  className="block w-full px-3 py-2 border rounded-lg"
                  placeholder="Email"
                />
                <textarea
                  value={userInfo.bio}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, bio: e.target.value })
                  }
                  className="block w-full px-3 py-2 border rounded-lg"
                  placeholder="Bio"
                  rows="3"
                />
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            {/* {!isEditingProfile ? (
              // <button
              //   onClick={() => setIsEditingProfile(true)}
              //   className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              // >
                
              // </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    handleUpdateUser(userInfo);
                    setIsEditingProfile(false);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </>
            )} */}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Your Videos</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Video</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => navigate(`/video/${video.videoId}`)}
            className="group bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
          >
            <div className="relative aspect-video">
              <img
                src={getThumbnailUrl(video.videoId)}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play
                  className="w-16 h-16 text-white drop-shadow-lg"
                  fill="white"
                />
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-sm rounded-md flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {video.duration}
              </div>
              <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingVideo(video);
                  }}
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteVideo(video.videoId);
                  }}
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                {video.title}
              </h3>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {video.views.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {video.likes.toLocaleString()}
                  </div>
                </div>
                <div className="text-gray-400">
                  {formatDate(video.createdAt)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-2xl m-4">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold">Upload New Video</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleUpload} className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Video File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-indigo-500 transition">
                <div className="flex flex-col items-center">
                  <Film className="w-12 h-12 text-gray-400 mb-4" />
                  <div className="text-center">
                    {uploadData.video ? (
                      <p className="text-sm text-gray-600">
                        Selected: {uploadData.video.name}
                      </p>
                    ) : (
                      <label className="cursor-pointer">
                        <span className="text-indigo-600 hover:text-indigo-700">
                          Browse files
                        </span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) =>
                            setUploadData({
                              ...uploadData,
                              video: e.target.files[0],
                            })
                          }
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Thumbnail
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition">
                <div className="flex flex-col items-center">
                  {uploadData.thumbnail ? (
                    <p className="text-sm text-gray-600">
                      Selected: {uploadData.thumbnail.name}
                    </p>
                  ) : (
                    <label className="cursor-pointer">
                      <span className="text-indigo-600 hover:text-indigo-700">
                        Select thumbnail
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          setUploadData({
                            ...uploadData,
                            thumbnail: e.target.files[0],
                          })
                        }
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={uploadData.title}
                onChange={(e) =>
                  setUploadData({ ...uploadData, title: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={uploadData.description}
                onChange={(e) =>
                  setUploadData({
                    ...uploadData,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                rows="4"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                disabled={!uploadData.video || !uploadData.title}
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

      {editingVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl m-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Edit Video</h2>
              <button
                onClick={() => setEditingVideo(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={editingVideo.title}
                  onChange={(e) =>
                    setEditingVideo({ ...editingVideo, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={editingVideo.description}
                  onChange={(e) =>
                    setEditingVideo({
                      ...editingVideo,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Thumbnail
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-center">
                    <img
                      src={editingVideo.thumbnail}
                      alt="Current thumbnail"
                      className="h-32 object-cover rounded"
                    />
                    <label className="ml-4 cursor-pointer">
                      <span className="text-indigo-600 hover:text-indigo-700">
                        Change thumbnail
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setEditingVideo({
                              ...editingVideo,
                              thumbnail: URL.createObjectURL(file),
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 p-6">
                <button
                  onClick={() => setEditingVideo(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleUpdateVideo(editingVideo.id, editingVideo)
                  }
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
