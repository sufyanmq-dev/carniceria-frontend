import {
  Badge,
  Box,
  Button,
  Flex,
  Skeleton,
  Table,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuClipboardList } from "react-icons/lu";
import { useOrders } from "@/hooks/useOrders";
import { fmtPrice, fmtDate, fmtOrderId } from "@/utils/formatters";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import OrderDetailModal from "@/components/ui/OrderDetailModal";

// Opciones de filtro por estado
const FILTERS = [
  { label: "Todos", value: "all" },
  { label: "Pendiente", value: "pendiente" },
  { label: "En preparación", value: "en_preparacion" },
  { label: "Entregado", value: "entregado" },
  { label: "Cancelado", value: "cancelado" },
];

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders, loading, refresh } = useOrders(); // pedidos + recarga
  const [filter, setFilter] = useState("all"); // estado activo del filtro
  const [viewId, setViewId] = useState(null); // id del pedido a ver

  // Aplica filtro seleccionado
  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <Box>
      <PageHeader
        title="Mis pedidos"
        subtitle={`${orders.length} pedidos realizados`}
        action={
          <Button
            size="sm"
            bg="brand.solid"
            color="white"
            _hover={{ bg: "brand.600" }}
            fontWeight={600}
            onClick={() => navigate("/cliente/nuevo")}
          >
            + Nuevo pedido
          </Button>
        }
      />

      {/* Botones de filtro */}
      <Flex gap={2} mb={5} flexWrap="wrap">
        {FILTERS.map((f) => {
          const isActive = filter === f.value;

          // Cuenta pedidos por estado
          const count =
            f.value === "all"
              ? orders.length
              : orders.filter((o) => o.status === f.value).length;

          return (
            <Button
              key={f.value}
              size="sm"
              bg={isActive ? "brand.solid" : "transparent"}
              color={isActive ? "white" : "text.secondary"}
              borderColor={isActive ? "brand.solid" : "border.default"}
              variant={isActive ? "solid" : "outline"}
              _hover={{ bg: isActive ? "brand.600" : "bg.subtle" }}
              fontWeight={isActive ? 600 : 400}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
              <Badge
                ml={1}
                size="xs"
                borderRadius="full"
                bg={isActive ? "whiteAlpha.300" : "bg.subtle"}
                color={isActive ? "white" : "text.muted"}
              >
                {count}
              </Badge>
            </Button>
          );
        })}
      </Flex>

      <Box
        bg="bg.surface"
        border="1px solid"
        borderColor="border.default"
        borderRadius="lg"
        overflow="hidden"
      >
        {/* Cargando */}
        {loading ? (
          <Box p={5}>
            <Skeleton h="200px" borderRadius="md" />
          </Box>
        ) : filtered.length === 0 ? (
          // Sin resultados
          <EmptyState
            icon={LuClipboardList}
            title="Sin pedidos"
            message={
              filter === "all"
                ? "Aún no has realizado ningún pedido."
                : `No tienes pedidos en este estado.`
            }
            action={
              filter === "all" && (
                <Button
                  size="sm"
                  bg="brand.solid"
                  color="white"
                  _hover={{ bg: "brand.600" }}
                  onClick={() => navigate("/cliente/nuevo")}
                >
                  Hacer primer pedido
                </Button>
              )
            }
          />
        ) : (
          // Tabla de pedidos
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="bg.subtle">
                {["Nº pedido", "Fecha", "Estado", "Total", ""].map((h) => (
                  <Table.ColumnHeader
                    key={h}
                    color="text.secondary"
                    fontSize="xs"
                    fontWeight={600}
                    textTransform="uppercase"
                    letterSpacing="wider"
                    py={3}
                    px={4}
                  >
                    {h}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filtered.map((order) => (
                <Table.Row key={order.id} _hover={{ bg: "bg.subtle" }}>
                  <Table.Cell px={4} py={3}>
                    <Text
                      fontSize="xs"
                      fontFamily="mono"
                      color="brand.text"
                      fontWeight={600}
                    >
                      {fmtOrderId(order.id)} {/* ID formateado */}
                    </Text>
                  </Table.Cell>

                  <Table.Cell px={4} py={3}>
                    <Text
                      fontSize="sm"
                      color="text.secondary"
                      whiteSpace="nowrap"
                    >
                      {fmtDate(order.created_at)}
                    </Text>
                  </Table.Cell>

                  <Table.Cell px={4} py={3}>
                    <StatusBadge status={order.status} />
                  </Table.Cell>

                  <Table.Cell px={4} py={3}>
                    <Text
                      fontSize="sm"
                      fontWeight={700}
                      color="text.primary"
                      whiteSpace="nowrap"
                    >
                      {fmtPrice(order.total)}
                    </Text>
                  </Table.Cell>

                  <Table.Cell px={4} py={3}>
                    <Button
                      size="xs"
                      variant="outline"
                      borderColor="border.default"
                      color="text.secondary"
                      onClick={() => setViewId(order.id)} // abre modal
                    >
                      Ver
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Box>

      {/* Modal de detalle */}
      <OrderDetailModal
        orderId={viewId}
        open={!!viewId} // abierto si hay id
        onClose={() => setViewId(null)} // cerrar modal
        onCancelled={refresh} // refrescar tras cancelar
        canCancel // permite cancelar
      />
    </Box>
  );
}
