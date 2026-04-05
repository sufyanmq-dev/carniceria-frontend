import {
  Badge,
  Box,
  Button,
  Flex,
  NativeSelect,
  Skeleton,
  Table,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuClipboardList, LuRefreshCw } from "react-icons/lu";
import { useOrders } from "@/hooks/useOrders";
import { fmtPrice, fmtDate, fmtOrderId } from "@/utils/formatters";
import PageHeader from "@/components/ui/PageHeader";
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

  // Render de los botones de filtro
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

  // Render de la tabla de pedidos
  const renderTable = () => (
    <Table.Root size="sm">
      <Table.Header>
        <Table.Row bg="bg.subtle">
          {["Nº pedido", "Cliente", "Fecha", "Total", "Estado", ""].map((h) => (
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
              <Text fontSize="sm" color="text.secondary" whiteSpace="nowrap">
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
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
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
  );

  return (
    <Box>
      {/* Header con botón de refresh */}
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

      {/* Filtros de estado */}
      <Flex gap={2} mb={5} flexWrap="wrap">
        {renderFilters()}
      </Flex>

      {/* Tabla de pedidos / Skeleton / EmptyState */}
      <Box
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
          renderTable()
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
