import {
  Box,
  Button,
  Flex,
  Grid,
  Skeleton,
  Table,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuClipboardList, LuPackage, LuUsers, LuEuro } from "react-icons/lu";
import { orderService } from "@/services/orderService";
import { productService } from "@/services/productService";
import { userService } from "@/services/userService";
import { fmtPrice, fmtDate, fmtOrderId } from "@/utils/formatters";

import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch inicial de datos
  useEffect(() => {
    Promise.all([
      orderService.getAll(),
      productService.getAll(),
      userService.getAll(),
    ])
      .then(([{ orders }, { products }, { users }]) => {
        setOrders(orders);
        setProducts(products);
        setUsers(users);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Cálculos de resumen
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const recentOrders = orders.slice(0, 5);

  return (
    <Box>
      <PageHeader
        title="Panel de administración"
        subtitle="Resumen global del sistema"
      />

      {/* ── Estadísticas principales */}
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
        gap={4}
        mb={8}
      >
        <Skeleton isLoaded={!loading} borderRadius="lg">
          <StatCard
            label="Ingresos totales"
            value={fmtPrice(totalRevenue)}
            icon={LuEuro}
          />
        </Skeleton>
        <Skeleton isLoaded={!loading} borderRadius="lg">
          <StatCard
            label="Pedidos"
            value={orders.length}
            icon={LuClipboardList}
          />
        </Skeleton>
        <Skeleton isLoaded={!loading} borderRadius="lg">
          <StatCard
            label="Productos"
            value={products.length}
            subtext={`${products.filter((p) => !p.is_active).length} inactivos`}
            icon={LuPackage}
          />
        </Skeleton>
        <Skeleton isLoaded={!loading} borderRadius="lg">
          <StatCard
            label="Usuarios"
            value={users.length}
            subtext={`${users.filter((u) => u.role === "cliente").length} clientes`}
            icon={LuUsers}
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
        <Flex
          justify="space-between"
          align="center"
          px={5}
          py={4}
          borderBottom="1px solid"
          borderColor="border.default"
        >
          <Text fontWeight={600} fontSize="sm">
            Pedidos recientes
          </Text>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => navigate("/admin/pedidos")}
          >
            Ver todos →
          </Button>
        </Flex>

        {loading ? (
          <Box p={5}>
            <Skeleton h="180px" />
          </Box>
        ) : recentOrders.length === 0 ? (
          <EmptyState title="Sin pedidos" message="No hay pedidos aún." />
        ) : (
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                {["Nº pedido", "Cliente", "Fecha", "Estado", "Total"].map(
                  (h) => (
                    <Table.ColumnHeader key={h}>{h}</Table.ColumnHeader>
                  ),
                )}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {recentOrders.map((o) => (
                <Table.Row key={o.id}>
                  <Table.Cell>{fmtOrderId(o.id)}</Table.Cell>
                  <Table.Cell>{o.client_name}</Table.Cell>
                  <Table.Cell>{fmtDate(o.created_at)}</Table.Cell>
                  <Table.Cell>
                    <StatusBadge status={o.status} />
                  </Table.Cell>
                  <Table.Cell>{fmtPrice(o.total)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Box>
    </Box>
  );
}
