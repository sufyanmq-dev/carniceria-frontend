import {
  Box,
  Button,
  Flex,
  Grid,
  Skeleton,
  Table,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LuClipboardList, LuClock, LuShoppingCart } from "react-icons/lu";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { useOrders } from "@/hooks/useOrders";
import { fmtPrice, fmtDate, fmtOrderId } from "@/utils/formatters";

// ── Fila compacta para el resumen del dashboard en móvil
function DashboardOrderRow({ order, onClick }) {
  return (
    <Box
      px={4}
      py={3}
      borderBottom="1px solid"
      borderColor="border.default"
      cursor="pointer"
      _hover={{ bg: "bg.subtle" }}
      transition="background 0.15s"
      onClick={onClick}
      _last={{ borderBottom: "none" }}
    >
      <Flex justify="space-between" align="center" mb={1}>
        <Text fontSize="sm" fontWeight={600} color="text.primary" lineClamp={1}>
          {order.client_name}
        </Text>
        <StatusBadge status={order.status} size="xs" />
      </Flex>
      <Flex justify="space-between" align="center">
        <Text
          fontSize="xs"
          fontFamily="mono"
          color="brand.text"
          fontWeight={600}
        >
          {fmtOrderId(order.id)}
        </Text>
        <Text fontSize="sm" fontWeight={700} color="text.primary">
          {fmtPrice(order.total)}
        </Text>
      </Flex>
    </Box>
  );
}

export default function EmployeeDashboardPage() {
  const navigate = useNavigate();
  const { orders, loading } = useOrders();

  // Filtrados rápidos
  const pending = orders.filter((o) => o.status === "pendiente");
  const inProgress = orders.filter((o) => o.status === "en_preparacion");
  const recent = orders.slice(0, 6);

  return (
    <Box>
      {/* Header con acción */}
      <PageHeader
        title="Panel de empleado"
        subtitle="Resumen de actividad y pedidos pendientes"
        action={
          <Button
            size="sm"
            bg="brand.solid"
            color="white"
            _hover={{ bg: "brand.600" }}
            fontWeight={600}
            onClick={() => navigate("/empleado/nuevo-pedido")}
          >
            + Nuevo pedido
          </Button>
        }
      />

      {/* Estadísticas */}
      <Grid
        templateColumns={{ base: "1fr", sm: "repeat(3, 1fr)" }}
        gap={4}
        mb={8}
      >
        <Skeleton loading={loading} borderRadius="lg">
          <StatCard
            label="Total pedidos"
            value={orders.length}
            subtext="en el sistema"
            icon={LuClipboardList}
          />
        </Skeleton>
        <Skeleton loading={loading} borderRadius="lg">
          <StatCard
            label="Pendientes"
            value={pending.length}
            subtext="esperando preparación"
            icon={LuClock}
            iconColor="yellow.500"
          />
        </Skeleton>
        <Skeleton loading={loading} borderRadius="lg">
          <StatCard
            label="En preparación"
            value={inProgress.length}
            subtext="en curso ahora"
            icon={LuShoppingCart}
            iconColor="blue.500"
          />
        </Skeleton>
      </Grid>

      {/* Pedidos recientes */}
      <Box
        bg="bg.surface"
        border="1px solid"
        borderColor="border.default"
        borderRadius="lg"
        overflow="hidden"
      >
        {/* Encabezado */}
        <Flex
          justify="space-between"
          align="center"
          px={5}
          py={4}
          borderBottom="1px solid"
          borderColor="border.default"
        >
          <Text fontWeight={600} fontSize="sm" color="text.primary">
            Pedidos recientes
          </Text>
          <Button
            variant="ghost"
            size="xs"
            color="brand.text"
            fontWeight={600}
            onClick={() => navigate("/empleado/pedidos")}
          >
            Ver todos →
          </Button>
        </Flex>

        {loading ? (
          <Box p={5}>
            <Skeleton h="160px" borderRadius="md" />
          </Box>
        ) : recent.length === 0 ? (
          <EmptyState
            title="Sin pedidos"
            message="No hay pedidos registrados aún."
          />
        ) : (
          <>
            {/* MÓVIL: lista compacta */}
            <Box display={{ base: "block", md: "none" }}>
              {recent.map((o) => (
                <DashboardOrderRow
                  key={o.id}
                  order={o}
                  onClick={() => navigate("/empleado/pedidos")}
                />
              ))}
            </Box>

            {/* DESKTOP: tabla */}
            <Box display={{ base: "none", md: "block" }}>
              <Table.Root size="sm">
                <Table.Header>
                  <Table.Row bg="bg.subtle">
                    {["Nº pedido", "Cliente", "Fecha", "Estado", "Total"].map(
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
                  {recent.map((o) => (
                    <Table.Row
                      key={o.id}
                      _hover={{ bg: "bg.subtle" }}
                      cursor="pointer"
                      onClick={() => navigate("/empleado/pedidos")}
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
                        <Text fontSize="sm" color="text.primary">
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
                        <StatusBadge status={o.status} />
                      </Table.Cell>
                      <Table.Cell px={4} py={3}>
                        <Text
                          fontSize="sm"
                          fontWeight={700}
                          color="text.primary"
                        >
                          {fmtPrice(o.total)}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
