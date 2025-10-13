import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key.ts";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 인터셉터로 토큰을 동적으로 추가
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  if (token) {
    // JSON.parse로 문자열을 파싱 (useLocalStorage에서 JSON.stringify로 저장했으므로)
    const parsedToken = JSON.parse(token);
    config.headers.Authorization = `Bearer ${parsedToken}`;
    console.log("헤더에 추가된 토큰:", parsedToken);
  }
  return config;
});

export default axiosInstance;
