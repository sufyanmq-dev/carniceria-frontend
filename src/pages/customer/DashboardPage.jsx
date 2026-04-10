import {
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
import { useNavigate } from "react-router-dom";
import { LuClipboardList, LuEuro, LuClock } from "react-icons/lu";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { fmtPrice, fmtDate, fmtOrderId } from "@/utils/formatters";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";

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
        <Text
          fontSize="xs"
          fontFamily="mono"
          color="brand.text"
          fontWeight={700}
        >
          {fmtOrderId(order.id)}
        </Text>
        <StatusBadge status={order.status} size="xs" />
      </Flex>
      <Flex justify="space-between" align="center">
        <Text fontSize="xs" color="text.muted">
          {fmtDate(order.created_at)}
        </Text>
        <Text fontSize="sm" fontWeight={700} color="text.primary">
          {fmtPrice(order.total)}
        </Text>
      </Flex>
    </Box>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { orders, loading } = useOrders();

  // Resumen de datos
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const lastOrder = orders[0];
  const recentOrders = orders.slice(0, 5);

  return (
    <Box>
      <PageHeader
        title={`Hola, ${user?.username} 👋`}
        subtitle="Resumen de tu actividad reciente"
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

      {/* Estadísticas */}
      <Grid
        templateColumns={{ base: "1fr", sm: "repeat(3, 1fr)" }}
        gap={4}
        mb={8}
      >
        <Skeleton loading={loading} borderRadius="lg">
          <StatCard
            label="Total gastado"
            value={fmtPrice(totalSpent)}
            subtext="todos tus pedidos"
            icon={LuEuro}
          />
        </Skeleton>
        <Skeleton loading={loading} borderRadius="lg">
          <StatCard
            label="Pedidos"
            value={orders.length}
            subtext="realizados"
            icon={LuClipboardList}
          />
        </Skeleton>
        <Skeleton loading={loading} borderRadius="lg">
          <StatCard
            label="Último pedido"
            value={lastOrder ? fmtDate(lastOrder.created_at) : "—"}
            subtext={
              lastOrder ? (
                <StatusBadge status={lastOrder.status} />
              ) : (
                "Sin pedidos aún"
              )
            }
            icon={LuClock}
          />
        </Skeleton>
      </Grid>

      {/* Últimos pedidos */}
      <Box
        bg="bg.surface"
        border="1px solid"
        borderColor="border.default"
        borderRadius="lg"
        overflow="hidden"
      >
        <Flex
          justify="space-between"
          align="center"
          px={5}
          py={4}
          borderBottom="1px solid"
          borderColor="border.default"
        >
          <Text fontWeight={600} fontSize="sm" color="text.primary">
            Últimos pedidos
          </Text>

          <Button
            variant="ghost"
            size="xs"
            color="brand.text"
            fontWeight={600}
            onClick={() => navigate("/cliente/pedidos")}
          >
            Ver todos →
          </Button>
        </Flex>

        {loading ? (
          <Box p={5}>
            <Skeleton h="120px" borderRadius="md" />
          </Box>
        ) : recentOrders.length === 0 ? (
          <EmptyState
            title="Sin pedidos aún"
            message="Haz tu primer pedido y aparecerá aquí."
            action={
              <Button
                size="sm"
                bg="brand.solid"
                color="white"
                _hover={{ bg: "brand.600" }}
                onClick={() => navigate("/cliente/nuevo")}
              >
                Hacer primer pedido
              </Button>
            }
          />
        ) : (
          <>
            {/* MÓVIL: lista compacta */}
            <Box display={{ base: "block", md: "none" }}>
              {recentOrders.map((order) => (
                <DashboardOrderRow
                  key={order.id}
                  order={order}
                  onClick={() => navigate("/cliente/pedidos")}
                />
              ))}
            </Box>

            {/* DESKTOP: tabla */}
            <Box display={{ base: "none", md: "block" }}>
              <Table.Root size="sm">
                <Table.Header>
                  <Table.Row bg="bg.subtle">
                    {["Nº pedido", "Fecha", "Estado", "Total"].map((h) => (
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
                  {recentOrders.map((order) => (
                    <Table.Row
                      key={order.id}
                      _hover={{ bg: "bg.subtle" }}
                      cursor="pointer"
                      onClick={() => navigate("/cliente/pedidos")}
                    >
                      <Table.Cell px={4} py={3}>
                        <Text
                          fontSize="xs"
                          fontFamily="mono"
                          color="brand.text"
                          fontWeight={600}
                        >
                          {fmtOrderId(order.id)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell px={4} py={3}>
                        <Text fontSize="sm" color="text.secondary">
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
                        >
                          {fmtPrice(order.total)}
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
