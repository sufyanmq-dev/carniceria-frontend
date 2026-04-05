import { useState, useEffect, useCallback } from "react";
import { productService } from "@/services/productService";
import { getErrorMessage } from "@/utils/errorMessages";

// Hook para productos (fetch + CRUD)
export const useProducts = ({ autoFetch = true } = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  // Obtener productos
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { products } = await productService.getAll();
      setProducts(products);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar al montar si está activo
  useEffect(() => {
    if (autoFetch) fetchProducts();
  }, [autoFetch, fetchProducts]);

  // Crear producto y añadirlo al estado
  const createProduct = useCallback(async (payload) => {
    setError(null);

    try {
      const { product } = await productService.create(payload);

      // mantener orden alfabético
      setProducts((prev) =>
        [product, ...prev].sort((a, b) => a.name.localeCompare(b.name)),
      );

      return product;
    } catch (err) {
      setError(getErrorMessage(err));
      return undefined;
    }
  }, []);

  // Actualizar producto en el estado
  const updateProduct = useCallback(async (id, payload) => {
    setError(null);

    try {
      const { product } = await productService.update(id, payload);

      setProducts((prev) => prev.map((p) => (p.id === id ? product : p)));

      return product;
    } catch (err) {
      setError(getErrorMessage(err));
      return undefined;
    }
  }, []);

  // Eliminar producto del estado
  const removeProduct = useCallback(async (id) => {
    setError(null);

    try {
      await productService.remove(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    }
  }, []);

  return {
    products,
    loading,
    error,
    refresh: fetchProducts,
    createProduct,
    updateProduct,
    removeProduct,
    clearError: () => setError(null),
  };
};
