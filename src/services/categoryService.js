import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const categoryService = {
  // Obtener todas las categorías
  getAll: async () => {
    const { data } = await api.get(ENDPOINTS.categories.getAll);
    return data;
  },

  // Crear categoría
  create: async (payload) => {
    const { data } = await api.post(ENDPOINTS.categories.create, payload);
    return data;
  },

  // Actualizar categoría
  update: async (id, payload) => {
    const { data } = await api.put(ENDPOINTS.categories.update(id), payload);
    return data;
  },

  // Eliminar categoría
  remove: async (id) => {
    const { data } = await api.delete(ENDPOINTS.categories.remove(id));
    return data;
  },
};
