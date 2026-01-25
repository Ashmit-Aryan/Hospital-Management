import api from "./axios";

export const getAppointments = () => api.get("/appointments");
export const getAppointmentById = (id) => api.get(`/appointments/${id}`);
export const createAppointment = (data) => api.post("/appointments", data);
export const updateAppointment = (id, data) =>
  api.put(`/appointments/update/${id}`, data);
export const deleteAppointment = (id) =>
  api.delete(`/appointments/delete/${id}`);
