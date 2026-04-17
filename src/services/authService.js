import api from "./APIService";

export const signup = (data) => api.post("/api/auth/signup", data);

export const login = async (data) => {
    const res = await api.post("/api/auth/login", data);
    if (res.token) localStorage.setItem("token", res.token);
    return res;
};

export const logout = () => {
    localStorage.removeItem("token");
    return api.post("/api/auth/logout");
};

export const getMe = () => api.get("/api/auth/me");
