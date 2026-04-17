import axios from "axios";

// ✅ Sirf yahan URL change karo jab deploy karo
const BASE_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Request interceptor - har request mein token attach karo
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Response interceptor - 401 pe logout
api.interceptors.response.use(
    (res) => res.data,
    (err) => {
        const message = err.response?.data?.message || err.message || "Something went wrong";
        if (err.response?.status === 401) {
            localStorage.removeItem("token");
        }
        return Promise.reject(new Error(message));
    }
);

export default api;
