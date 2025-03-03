import axios from "axios";
const api = axios.create({
  baseURL: "https://elearningnew.cybersoft.edu.vn/api",
});
api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers.TokenCybersoft =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA3OCIsIkhldEhhblN0cmluZyI6IjI3LzA3LzIwMjUiLCJIZXRIYW5UaW1lIjoiMTc1MzU3NDQwMDAwMCIsIm5iZiI6MTcyNjA3NDAwMCwiZXhwIjoxNzUzNzIyMDAwfQ.BTmM2iB4rp2M5zBswdnAhImSAoSPeaxquN5mTgxFzaQ";

  const storedData = localStorage.getItem("listCourse");
  const accessToken = storedData ? JSON.parse(storedData)?.accessToken : null;
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

export default api;
