import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("❌ VITE_API_BASE_URL is not defined in .env file");
}

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // allows cookies if needed (safe for auth)
  headers: {
    "Content-Type": "application/json",
  },
});

/** Attach JWT to every request
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Global Error Handling
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("⚠️ Session expired. Redirecting to login.");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    if (status === 403) {
      console.warn("⛔ Access denied");
    }

    return Promise.reject(error);
  },
);

export default API;
