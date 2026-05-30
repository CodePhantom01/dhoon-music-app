import axios from "axios";

export const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://dhoon-music-app.onrender.com";

export const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
