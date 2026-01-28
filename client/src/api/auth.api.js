import api from "./axios";

export const loginApi = (data) => api.post("/auth/login", data);
export const createUser = (data) => api.post("/auth/create-user", data);
