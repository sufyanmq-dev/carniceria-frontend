import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const productService = {
  // Lista todos los productos (con categoría)
  getAll: async () => {
    const { data } = await api.get(ENDPOINTS.products.getAll);
    return data;
  },

  // Obtener producto por ID
  getById: async (id) => {
    const { data } = await api.get(ENDPOINTS.products.getById(id));
    return data;
  },

  // Crear producto (admin)
  create: async (payload) => {
    const { data } = await api.post(ENDPOINTS.products.create, payload);
    return data;
  },

  // Actualizar producto
  update: async (id, payload) => {
    const { data } = await api.put(ENDPOINTS.products.update(id), payload);
    return data;
  },

  // Eliminar producto
  remove: async (id) => {
    const { data } = await api.delete(ENDPOINTS.products.remove(id));
    return data;
  },
};
