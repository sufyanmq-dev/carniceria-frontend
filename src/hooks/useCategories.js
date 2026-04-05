import { useState, useEffect, useCallback } from "react";
import { categoryService } from "@/services/categoryService";
import { getErrorMessage } from "@/utils/errorMessages";

// Hook para gestionar categorías (fetch + CRUD)
export const useCategories = ({ autoFetch = true } = {}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  // Obtener todas las categorías
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { categories } = await categoryService.getAll();
      setCategories(categories);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar al montar si está activo
  useEffect(() => {
    if (autoFetch) fetchCategories();
  }, [autoFetch, fetchCategories]);

  // Crear categoría y añadirla al estado
  const createCategory = useCallback(async (payload) => {
    setError(null);

    try {
      const { category } = await categoryService.create(payload);

      // mantener orden alfabético
      setCategories((prev) =>
        [...prev, category].sort((a, b) => a.name.localeCompare(b.name)),
      );

      return category;
    } catch (err) {
      setError(getErrorMessage(err));
      return undefined;
    }
  }, []);

  // Actualizar categoría en el estado
  const updateCategory = useCallback(async (id, payload) => {
    setError(null);

    try {
      const { category } = await categoryService.update(id, payload);

      setCategories((prev) => prev.map((c) => (c.id === id ? category : c)));

      return category;
    } catch (err) {
      setError(getErrorMessage(err));
      return undefined;
    }
  }, []);

  // Eliminar categoría del estado
  const removeCategory = useCallback(async (id) => {
    setError(null);

    try {
      await categoryService.remove(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    }
  }, []);

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
    createCategory,
    updateCategory,
    removeCategory,
    clearError: () => setError(null),
  };
};
