import { useState, useEffect, useCallback } from "react";
import { userService } from "@/services/userService";
import { getErrorMessage } from "@/utils/errorMessages";

// Hook para usuarios (admin) con CRUD y roles
export const useUsers = ({ autoFetch = true } = {}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  // Obtener todos los usuarios
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { users } = await userService.getAll();
      setUsers(users);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar al montar si autoFetch
  useEffect(() => {
    if (autoFetch) fetchUsers();
  }, [autoFetch, fetchUsers]);

  // Cambiar rol de un usuario
  const updateRole = useCallback(async (userId, roleName) => {
    setError(null);

    try {
      const { user } = await userService.updateRole(userId, roleName);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: roleName } : u)),
      );
      return user;
    } catch (err) {
      setError(getErrorMessage(err));
      return undefined;
    }
  }, []);

  // Eliminar usuario del estado
  const removeUser = useCallback(async (userId) => {
    setError(null);

    try {
      await userService.remove(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    }
  }, []);

  return {
    users,
    loading,
    error,
    refresh: fetchUsers,
    updateRole,
    removeUser,
    clearError: () => setError(null),
  };
};
