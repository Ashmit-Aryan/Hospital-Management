import api from "./axios";

export const getBillings = () => api.get("/billings");
export const getBillingById = (id) => api.get(`/billings/${id}`);
export const createBilling = (data) => api.post("/billings", data);
export const updateBilling = (id, data) =>
  api.put(`/billings/update/${id}`, data);
export const deleteBilling = (id) =>
  api.delete(`/billings/delete/${id}`);
