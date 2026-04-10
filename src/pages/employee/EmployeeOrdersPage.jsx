import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  NativeSelect,
  Separator,
  Skeleton,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuClipboardList, LuRefreshCw } from "react-icons/lu";
import { useOrders } from "@/hooks/useOrders";
import { fmtPrice, fmtDate, fmtOrderId } from "@/utils/formatters";
import PageHeader from "@/components/ui/PageHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import OrderDetailModal from "@/components/ui/OrderDetailModal";

const STATUSES = ["pendiente", "en_preparacion", "entregado", "cancelado"];
const STATUS_LABELS = {
  pendiente: "Pendiente",
  en_preparacion: "En preparación",
  entregado: "Entregado",
  cancelado: "Cancelado",
};
const FILTERS = [
  { label: "Todos", value: "all" },
  { label: "Pendiente", value: "pendiente" },
  { label: "En preparación", value: "en_preparacion" },
  { label: "Entregado", value: "entregado" },
  { label: "Cancelado", value: "cancelado" },
];

// ── Card para móvil y tablet
function OrderCard({ order, onView, onStatusChange, updating }) {
  const isUpdating = updating === order.id;

  return (
    <Box
      bg="bg.surface"
      border="1px solid"
      borderColor="border.default"
      borderRadius="xl"
      overflow="hidden"
      opacity={isUpdating ? 0.6 : 1}
      transition="all 0.2s"
    >
      {/* Cabecera: nº pedido + cliente */}
      <Flex
        justify="space-between"
        align="center"
        px={4}
        py={3}
        bg="bg.subtle"
        borderBottom="1px solid"
        borderColor="border.default"
        gap={2}
      >
        <Text
          fontSize="sm"
          fontWeight={700}
          color="text.primary"
          lineClamp={1}
          flex={1}
        >
          {order.client_name}
        </Text>
        <Text
          fontSize="xs"
          fontFamily="mono"
          fontWeight={700}
          color="brand.text"
          flexShrink={0}
          letterSpacing="wide"
        >
          {fmtOrderId(order.id)}
        </Text>
      </Flex>

      {/* Cuerpo: fecha + total */}
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

      {/* Select de estado — acción principal siempre visible */}
      <Box px={4} pt={3} pb={2}>
        <Text
          fontSize="xs"
          color="text.muted"
          fontWeight={600}
          textTransform="uppercase"
          letterSpacing="wider"
          mb={1.5}
        >
          Estado
        </Text>
        <NativeSelect.Root size="sm" disabled={isUpdating}>
          <NativeSelect.Field
            value={order.status}
            onChange={(e) => onStatusChange(order.id, e.target.value)}
            borderColor="border.default"
            fontSize="sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Box>

      {/* Botón ver detalle */}
      <Box px={4} pb={4}>
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
          onClick={() => onView(order.id)}
        >
          Ver Detalles
        </Button>
      </Box>
    </Box>
  );
}

export default function EmployeeOrdersPage() {
  const { orders, loading, refresh, updateStatus } = useOrders();
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState(null);
  const [viewId, setViewId] = useState(null);

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  // Cambia el estado de un pedido
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    await updateStatus(orderId, newStatus);
    setUpdating(null);
  };

  // Filtros compartidos
  const renderFilters = () =>
    FILTERS.map((f) => {
      const isActive = filter === f.value;
      const count =
        f.value === "all"
          ? orders.length
          : orders.filter((o) => o.status === f.value).length;
      return (
        <Button
          key={f.value}
          size="sm"
          variant={isActive ? "solid" : "outline"}
          bg={isActive ? "brand.solid" : "transparent"}
          color={isActive ? "white" : "text.secondary"}
          borderColor={isActive ? "brand.solid" : "border.default"}
          fontWeight={isActive ? 600 : 400}
          _hover={{ bg: isActive ? "brand.600" : "bg.subtle" }}
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
    });

  return (
    <Box>
      <PageHeader
        title="Gestión de pedidos"
        subtitle={`${orders.length} pedidos en total`}
        action={
          <Button
            size="sm"
            variant="outline"
            borderColor="border.default"
            color="text.secondary"
            onClick={refresh}
          >
            <LuRefreshCw size={16} /> Actualizar
          </Button>
        }
      />

      <Flex gap={2} mb={5} flexWrap="wrap">
        {renderFilters()}
      </Flex>

      {/* ── MÓVIL: cards */}
      <Box display={{ base: "block", md: "none" }}>
        {loading ? (
          <VStack gap={3}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} h="168px" borderRadius="lg" w="full" />
            ))}
          </VStack>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={LuClipboardList}
            title="Sin pedidos"
            message="No hay pedidos con este filtro."
          />
        ) : (
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={3}>
            {filtered.map((o) => (
              <OrderCard
                key={o.id}
                order={o}
                onView={setViewId}
                onStatusChange={handleStatusChange}
                updating={updating}
              />
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
        {loading ? (
          <Box p={5}>
            <Skeleton h="240px" borderRadius="md" />
          </Box>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={LuClipboardList}
            title="Sin pedidos"
            message="No hay pedidos con este filtro."
          />
        ) : (
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="bg.subtle">
                {["Nº pedido", "Cliente", "Fecha", "Total", "Estado", ""].map(
                  (h) => (
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
                  ),
                )}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filtered.map((o) => (
                <Table.Row
                  key={o.id}
                  _hover={{ bg: "bg.subtle" }}
                  opacity={updating === o.id ? 0.6 : 1}
                  transition="opacity 0.15s"
                >
                  <Table.Cell px={4} py={3}>
                    <Text
                      fontSize="xs"
                      fontFamily="mono"
                      color="brand.text"
                      fontWeight={600}
                    >
                      {fmtOrderId(o.id)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell px={4} py={3}>
                    <Text fontSize="sm" color="text.primary" fontWeight={500}>
                      {o.client_name}
                    </Text>
                  </Table.Cell>
                  <Table.Cell px={4} py={3}>
                    <Text
                      fontSize="sm"
                      color="text.secondary"
                      whiteSpace="nowrap"
                    >
                      {fmtDate(o.created_at)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell px={4} py={3}>
                    <Text fontSize="sm" fontWeight={700} color="text.primary">
                      {fmtPrice(o.total)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell px={4} py={3}>
                    <NativeSelect.Root
                      size="xs"
                      w="150px"
                      disabled={updating === o.id}
                    >
                      <NativeSelect.Field
                        value={o.status}
                        onChange={(e) =>
                          handleStatusChange(o.id, e.target.value)
                        }
                        borderColor="border.default"
                        fontSize="xs"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Table.Cell>
                  <Table.Cell px={4} py={3}>
                    <Button
                      size="xs"
                      variant="outline"
                      borderColor="border.default"
                      color="text.secondary"
                      onClick={() => setViewId(o.id)}
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
        open={!!viewId}
        onClose={() => setViewId(null)}
      />
    </Box>
  );
}
