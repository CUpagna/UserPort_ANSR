import axios from "axios";

// 1. Updated port to 8000 to match your Uvicorn FastAPI server
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request (Perfect for future-proofing!)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("uv_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("uv_token");
      localStorage.removeItem("uv_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// 2. Added the authAPI wrapper so your Login/Signup components can use it seamlessly
export const authAPI = {
  signup: async (userData) => {
    try {
      // Axios automatically parses JSON, so we just return response.data
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      // If the backend sends a 400 error, we catch it gracefully here
      return error.response?.data || { success: false, message: "Network error" };
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: "Network error" };
    }
  }
};

export default api;