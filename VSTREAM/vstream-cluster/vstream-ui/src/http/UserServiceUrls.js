// urls.js

const BASE_URL = "http://192.168.223.176:8000/vstream-user-service";
// const BASE_URL = "http://10.42.0.225:8001/vstream_gateway";

export const getLoginUrl = (uploaderId, videoId) =>
  `${BASE_URL}/login/`;

export const getRegisterUrl = () =>
  `${BASE_URL}/register/`;

export const getUsernameUrl = (userId) =>
  `${BASE_URL}/get_full_name?user_id=${userId}`;


