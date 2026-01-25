import api from "./axios";

export const getPatientsList = () => api.get("/patients");
export const getDoctorsList = () => api.get("/doctors");
export const getAppointmentsList = () => api.get("/appointments");
