// urls.js

const BASE_URL = "http://localhost:8080/vstream-video-service";
// const BASE_URL = "http://10.42.0.225:8001/vstream_gateway";

export const getHlsUrl = (uploaderId, videoId) =>
  `${BASE_URL}/videos/hls/${uploaderId}/${videoId}/index.m3u8`;

export const getUploadVideoUrl = () =>
  `${BASE_URL}/videos/upload`;

export const getVideosUrl = (uploadInProgress = false) =>
  `${BASE_URL}/videos?uploadInProgress=${uploadInProgress}`;

export const getVideosUrlUserId = (uploadInProgress = false, userId) =>
  `${BASE_URL}/videos?uploadInProgress=${uploadInProgress}&userId=${userId}`;

export const getVideoByIdUrl = (videoId) =>
  `${BASE_URL}/videos/${videoId}`;

export const getLikeVideoUrl = (videoId, userId) =>
  `${BASE_URL}/videos/${videoId}/likes?userId=${userId}`;

export const getViewVideoUrl = (videoId) =>
  `${BASE_URL}/videos/${videoId}/views`;

export const getUploadCountByUserUrl = () =>
  `${BASE_URL}/videos/upload-count-by-user`;

export const getVideoUploadTrendUrl = (period) =>
  `${BASE_URL}/videos/video-upload-trends?period=${period}`;

export const getThumbnailUrl = (videoId) =>
  `${BASE_URL}/thumbnails/${videoId}`;

// http://10.17.35.84:8080/vstream-video-service/thumbnails/${videoId}

export const getViewVsLikes = (period) =>
  `${BASE_URL}/videos/views-vs-likes`;

export const getLikeCountDist = (period) =>
  `${BASE_URL}/videos/like-count-distribution`;

export const getAddCommentUrl = () =>
  `${BASE_URL}/comments`;

export const getCommentByIdUrl = (commentId) =>
  `${BASE_URL}/comments/${commentId}`;

export const getCommentsUrl = (videoId) =>
  `${BASE_URL}/comments/video/${videoId}`;



