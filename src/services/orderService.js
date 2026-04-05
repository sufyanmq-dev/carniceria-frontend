import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const orderService = {
  // Lista todos los pedidos
  getAll: async () => {
    const { data } = await api.get(ENDPOINTS.orders.getAll);
    return data;
  },

  // Detalle de un pedido
  getById: async (id) => {
    const { data } = await api.get(ENDPOINTS.orders.getById(id));
    return data;
  },

  // Crear nuevo pedido
  create: async (payload) => {
    const { data } = await api.post(ENDPOINTS.orders.create, payload);
    return data;
  },

  // Cambiar estado (pendiente → entregado, etc.)
  updateStatus: async (id, status) => {
    const { data } = await api.put(ENDPOINTS.orders.updateStatus(id), {
      status,
    });
    return data;
  },

  // Cancelar pedido
  cancelOrder: async (id) => {
    const { data } = await api.patch(ENDPOINTS.orders.cancel(id));
    return data;
  },
};
