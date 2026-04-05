import {
  Badge,
  Box,
  Button,
  Dialog,
  Flex,
  Portal,
  Separator,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { orderService } from "@/services/orderService";
import {
  fmtPrice,
  fmtPriceWithUnit,
  fmtQuantity,
  fmtDate,
  fmtOrderId,
} from "@/utils/formatters";
import StatusBadge from "@/components/ui/StatusBadge";

export default function OrderDetailModal({
  orderId,
  open,
  onClose,
  onCancelled,
  canCancel = false,
}) {
  // estado del pedido
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  // carga el pedido al abrir el modal
  useEffect(() => {
    if (!open || !orderId) return;

    setLoading(true);
    setError("");

    orderService
      .getById(orderId)
      .then(({ order }) => setOrder(order))
      .catch(() => setError("No se pudo cargar el pedido."))
      .finally(() => setLoading(false));
  }, [open, orderId]);

  // cancela el pedido
  const handleCancel = async () => {
    setCancelling(true);
    try {
      await orderService.cancelOrder(orderId);
      onCancelled?.();
      onClose();
    } catch {
      setError("No se pudo cancelar el pedido.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => !e.open && onClose()}
      size="md"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Flex align="center" justify="space-between" w="full">
                <Dialog.Title
                  fontSize="md"
                  fontWeight={700}
                  color="text.primary"
                >
                  Detalle del pedido
                </Dialog.Title>
                {order && <StatusBadge status={order.status} />}
              </Flex>
            </Dialog.Header>

            <Dialog.Body>
              {loading ? (
                // skeleton mientras carga
                <VStack gap={3}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} h="48px" borderRadius="md" w="full" />
                  ))}
                </VStack>
              ) : error ? (
                // error de carga
                <Text fontSize="sm" color="red.500">
                  {error}
                </Text>
              ) : order ? (
                // contenido del pedido
                <VStack gap={4} align="stretch">
                  {/* info básica */}
                  <Flex gap={6} fontSize="sm" color="text.secondary">
                    <Box>
                      <Text fontSize="xs" color="text.muted" mb={0.5}>
                        Nº pedido
                      </Text>
                      <Text
                        fontFamily="mono"
                        fontWeight={600}
                        color="brand.text"
                      >
                        {fmtOrderId(order.id)}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="xs" color="text.muted" mb={0.5}>
                        Fecha
                      </Text>
                      <Text>{fmtDate(order.created_at)}</Text>
                    </Box>

                    {order.client_name && (
                      <Box>
                        <Text fontSize="xs" color="text.muted" mb={0.5}>
                          Cliente
                        </Text>
                        <Text>{order.client_name}</Text>
                      </Box>
                    )}
                  </Flex>

                  <Separator />

                  {/* lista de productos */}
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight={600}
                      color="text.secondary"
                      textTransform="uppercase"
                      letterSpacing="wider"
                      mb={3}
                    >
                      Productos
                    </Text>

                    <VStack gap={2} align="stretch">
                      {order.items?.map((item) => (
                        <Flex
                          key={item.id}
                          justify="space-between"
                          align="center"
                          p={3}
                          bg="bg.subtle"
                          borderRadius="md"
                        >
                          <Box>
                            <Text
                              fontSize="sm"
                              fontWeight={500}
                              color="text.primary"
                            >
                              {item.product_name}
                            </Text>
                            <Text fontSize="xs" color="text.secondary">
                              {fmtQuantity(item.quantity, item.unit)} ×{" "}
                              {fmtPriceWithUnit(item.price_at_order, item.unit)}
                            </Text>
                          </Box>

                          <Text
                            fontSize="sm"
                            fontWeight={700}
                            color="text.primary"
                          >
                            {fmtPrice(item.quantity * item.price_at_order)}
                          </Text>
                        </Flex>
                      ))}
                    </VStack>
                  </Box>

                  <Separator />

                  {/* total */}
                  <Flex justify="space-between" align="center">
                    <Text fontWeight={700} color="text.primary">
                      Total
                    </Text>
                    <Text fontWeight={800} fontSize="lg" color="brand.solid">
                      {fmtPrice(order.total)}
                    </Text>
                  </Flex>

                  {/* notas opcionales */}
                  {order.notes && (
                    <Box p={3} bg="bg.subtle" borderRadius="md">
                      <Text fontSize="xs" color="text.muted" mb={1}>
                        Notas
                      </Text>
                      <Text fontSize="sm" color="text.primary">
                        {order.notes}
                      </Text>
                    </Box>
                  )}
                </VStack>
              ) : null}
            </Dialog.Body>

            <Dialog.Footer>
              <Flex gap={3} justify="flex-end" w="full">
                {/* botón cancelar */}
                {canCancel && order?.status === "pendiente" && (
                  <Button
                    size="sm"
                    colorPalette="red"
                    variant="outline"
                    loading={cancelling}
                    loadingText="Cancelando…"
                    onClick={handleCancel}
                  >
                    Cancelar pedido
                  </Button>
                )}

                {/* cerrar modal */}
                <Button
                  size="sm"
                  variant="outline"
                  borderColor="border.default"
                  color="text.secondary"
                  onClick={onClose}
                >
                  Cerrar
                </Button>
              </Flex>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
