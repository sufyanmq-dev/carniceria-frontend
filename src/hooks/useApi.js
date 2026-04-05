import { useState, useCallback } from "react";
import { getErrorMessage } from "@/utils/errorMessages";

// Hook base para llamadas a la API (maneja loading + error)
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ejecuta una función async controlando estados
  const execute = useCallback(async (fn) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fn();
      return result;
    } catch (err) {
      const message = getErrorMessage(err); // obtener mensaje legible
      setError(message);
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  // Resetear error manualmente
  const clearError = useCallback(() => setError(null), []);

  return { loading, error, execute, clearError };
};
