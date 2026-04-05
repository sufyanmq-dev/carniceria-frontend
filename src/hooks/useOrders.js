import { useState, useEffect, useCallback } from "react";
import { orderService } from "@/services/orderService";
import { getErrorMessage } from "@/utils/errorMessages";

// Hook para pedidos (fetch + acciones)
export const useOrders = ({ autoFetch = true } = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  // Obtener pedidos (el backend filtra por rol)
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { orders } = await orderService.getAll();
      setOrders(orders);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar al montar si está activo
  useEffect(() => {
    if (autoFetch) fetchOrders();
  }, [autoFetch, fetchOrders]);

  // Crear pedido
  const createOrder = useCallback(async (payload) => {
    setLoading(true);
    setError(null);

    try {
      const { order } = await orderService.create(payload);
      return order;
    } catch (err) {
      setError(getErrorMessage(err));
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cambiar estado del pedido (sin refetch)
  const updateStatus = useCallback(async (orderId, status) => {
    setError(null);

    try {
      const { order } = await orderService.updateStatus(orderId, status);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: order.status } : o,
        ),
      );

      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    }
  }, []);

  return {
    orders,
    loading,
    error,
    refresh: fetchOrders,
    createOrder,
    updateStatus,
    clearError: () => setError(null),
  };
};
