import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://prepmind-ai-og66.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;

  // Let browser set Content-Type if sending FormData
  if (config.data instanceof FormData) delete config.headers["Content-Type"];
  else config.headers["Content-Type"] = "application/json";

  return config;
});

export default api;

