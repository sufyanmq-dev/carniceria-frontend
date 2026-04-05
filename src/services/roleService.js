import api from "@/api/axios";

// Este servicio requiere el endpoint GET /api/roles en el backend.
// Ver resumen de cambios al final de la generación.
export const roleService = {
  getAll: async () => {
    const { data } = await api.get("/roles");
    return data; // { roles: [{ id, name }] }
  },
};
