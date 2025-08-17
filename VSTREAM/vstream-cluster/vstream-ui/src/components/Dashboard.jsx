import React, { useState } from "react";
import VideoGrid from "./VideoGrid";
import { Upload, X, Video, Film, Type, AlignLeft } from "lucide-react";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    video: null,
    thumbnail: null,
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Here you would typically send the data to your backend
    console.log("Upload data:", uploadData);

    setIsUploading(false);
    setIsModalOpen(false);
    setUploadData({
      title: "",
      description: "",
      video: null,
      thumbnail: null,
    });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setUploadData((prev) => ({
        ...prev,
        [type]: file,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 pt-20">
      {/* Header section */}
      <div className="max-w-7xl mx-auto  flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Your Videos</h1>
        {/* <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Video</span>
        </button> */}
      </div>

      {/* Video Grid */}
      <VideoGrid />

      {/* Upload Modal */}
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
              {/* Video Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Video File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                  <div className="flex flex-col items-center">
                    <Film className="w-12 h-12 text-gray-400 mb-4" />
                    <div className="text-center">
                      {uploadData.video ? (
                        <p className="text-sm text-gray-600">
                          Selected: {uploadData.video.name}
                        </p>
                      ) : (
                        <>
                          <p className="text-sm text-gray-600">
                            Drag and drop your video or
                          </p>
                          <label className="mt-2 cursor-pointer">
                            <span className="text-indigo-600 hover:text-indigo-700">
                              Browse files
                            </span>
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, "video")}
                            />
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Thumbnail
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
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
                          onChange={(e) => handleFileChange(e, "thumbnail")}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) =>
                    setUploadData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter video title"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) =>
                    setUploadData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter video description"
                />
              </div>

              {/* Submit Button */}
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
                  disabled={
                    isUploading || !uploadData.video || !uploadData.title
                  }
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition
                    ${
                      isUploading || !uploadData.video || !uploadData.title
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                >
                  {isUploading ? (
                    <>
                      <span>Uploading...</span>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Upload</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
