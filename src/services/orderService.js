import api from "./APIService";

export const placeOrder = (data) => api.post("/api/orders", data);

export const getMyOrders = () => api.get("/api/orders/my");

export const getAllOrders = () => api.get("/api/orders");

export const updateOrderStatus = (id, status) => api.put(`/api/orders/${id}/status`, { status });

export const deleteOrder = (id) => api.delete(`/api/orders/${id}`);
