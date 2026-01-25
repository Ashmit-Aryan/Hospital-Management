import api from "./axios";

export const getDoctors = () => api.get("/doctors");
export const getDoctorById = (id) => api.get(`/doctors/${id}`);
export const createDoctor = (data) => api.post("/doctors", data);
export const updateDoctor = (id, data) =>
  api.put(`/doctors/update/${id}`, data);
export const deleteDoctor = (id) =>
  api.delete(`/doctors/delete/${id}`);
