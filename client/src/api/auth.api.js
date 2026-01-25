import api from "./axios";

export const loginApi = (data) => api.post("/auth/login", data);
