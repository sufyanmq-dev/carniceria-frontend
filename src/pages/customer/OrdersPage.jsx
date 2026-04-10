import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Separator,
  Skeleton,
  Table,
  Text,
  VStack,
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

// ── Card para móvil y tablet
function OrderCard({ order, onView }) {
  return (
    <Box
      bg="bg.surface"
      border="1px solid"
      borderColor="border.default"
      borderRadius="xl"
      overflow="hidden"
      _hover={{
        borderColor: "brand.solid",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={() => onView(order.id)}
    >
      {/* Cabecera: nº pedido + estado */}
      <Flex
        justify="space-between"
        align="center"
        px={4}
        py={3}
        bg="bg.subtle"
        borderBottom="1px solid"
        borderColor="border.default"
      >
        <Text
          fontSize="xs"
          fontFamily="mono"
          fontWeight={700}
          color="brand.text"
          letterSpacing="wide"
        >
          {fmtOrderId(order.id)}
        </Text>
        <StatusBadge status={order.status} />
      </Flex>

      {/* Cuerpo: fecha + total en dos columnas */}
      <Grid templateColumns="1fr 1fr" px={4} py={3} gap={2}>
        <Box>
          <Text
            fontSize="xs"
            color="text.muted"
            fontWeight={600}
            textTransform="uppercase"
            letterSpacing="wider"
            mb={1}
          >
            Fecha
          </Text>
          <Text fontSize="sm" color="text.secondary" fontWeight={500}>
            {fmtDate(order.created_at)}
          </Text>
        </Box>
        <Box textAlign="right">
          <Text
            fontSize="xs"
            color="text.muted"
            fontWeight={600}
            textTransform="uppercase"
            letterSpacing="wider"
            mb={1}
          >
            Total
          </Text>
          <Text fontSize="md" fontWeight={800} color="text.primary">
            {fmtPrice(order.total)}
          </Text>
        </Box>
      </Grid>

      <Separator />

      {/* Botón acción */}
      <Box px={4} py={3}>
        <Button
          w="full"
          size="sm"
          variant="outline"
          borderColor="border.strong"
          color="text.secondary"
          fontWeight={600}
          _hover={{
            bg: "brand.subtle",
            borderColor: "brand.solid",
            color: "brand.text",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onView(order.id);
          }}
        >
          Ver Detalles
        </Button>
      </Box>
    </Box>
  );
}

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

      {/* ── MÓVIL: cards */}
      <Box display={{ base: "block", md: "none" }}>
        {loading ? (
          <VStack gap={3}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} h="140px" borderRadius="lg" w="full" />
            ))}
          </VStack>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={LuClipboardList}
            title="Sin pedidos"
            message={
              filter === "all"
                ? "Aún no has realizado ningún pedido."
                : "No tienes pedidos en este estado."
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
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={3}>
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} onView={setViewId} />
            ))}
          </Grid>
        )}
      </Box>

      {/* ── DESKTOP: tabla */}
      <Box
        display={{ base: "none", md: "block" }}
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
                : "No tienes pedidos en este estado."
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
