import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";

export const userService = {
  // Lista todos los usuarios
  getAll: async () => {
    const { data } = await api.get(ENDPOINTS.users.getAll);
    return data;
  },

  // Cambiar rol (admin/empleado/cliente)
  updateRole: async (id, roleName) => {
    const { data } = await api.put(ENDPOINTS.users.updateRole(id), {
      role_name: roleName,
    });
    return data;
  },

  // Actualizar perfil propio
  updateMe: async (payload) => {
    const { data } = await api.patch(ENDPOINTS.users.updateMe, payload);
    return data;
  },

  // Eliminar usuario
  remove: async (id) => {
    const { data } = await api.delete(ENDPOINTS.users.remove(id));
    return data;
  },
};
