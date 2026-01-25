import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});
//https://hospital-management-api-kohl.vercel.app/
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Auth"] = token;
  return config;
});

export default api;
