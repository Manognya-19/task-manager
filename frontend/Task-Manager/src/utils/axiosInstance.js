import axios from "axios";
// import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: "https://task-manager-backend-7av7.onrender.com",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ ONLY ONE request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
