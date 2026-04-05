import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const authService = {
  // Login → guarda JWT en cookie (backend)
  login: async (credentials) => {
    const { data } = await api.post(ENDPOINTS.auth.login, credentials);
    return data;
  },

  // Registro de usuario (cliente por defecto)
  register: async (payload) => {
    const { data } = await api.post(ENDPOINTS.auth.register, payload);
    return data;
  },

  // Logout → limpia sesión en servidor
  logout: async () => {
    await api.post(ENDPOINTS.auth.logout);
  },

  // Usuario actual autenticado
  me: async () => {
    const { data } = await api.get(ENDPOINTS.auth.me);
    return data;
  },
};
