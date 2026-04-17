import api from "./APIService";

export const saveCard = (data) => api.post("/api/cards", data);

export const getMyCards = () => api.get("/api/cards/my");

export const deleteMyCard = (id) => api.delete(`/api/cards/my/${id}`);

export const getAllCards = () => api.get("/api/cards");

export const adminDeleteCard = (id) => api.delete(`/api/cards/${id}`);
