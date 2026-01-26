import axios from "axios";

const api = axios.create({
  baseURL: "https://hospital-management-api-kohl.vercel.app/api",
  headers: { "Content-Type": "application/json" },
});
//https://hospital-management-api-kohl.vercel.app/
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Auth"] = token;
  return config;
});

export default api;
