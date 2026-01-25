import api from "./axios";

export const getUsers = () => api.get("/user");
export const getUserById = (id) => api.get(`/user/${id}`);
export const deleteUser = (id) => api.delete(`/user/delete/${id}`);
export const updateUser = (id, data) =>
  api.put(`/user/update/${id}`, data);
