import axios from "axios";

//const { VITE_BASE_URL } = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL: "VITE_BASE_URL", // API의 기본 URL
  timeout: 10000, // 요청 타임아웃 설정 (밀리초 단위)
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
