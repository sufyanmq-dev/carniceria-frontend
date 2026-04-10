import {
  Avatar,
  Box,
  Flex,
  Grid,
  Input,
  Separator,
  Skeleton,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useUsers } from "@/hooks/useUsers";
import { LuUsers, LuMail, LuPhone, LuMapPin } from "react-icons/lu";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import { fmtDate, fmtInitials } from "@/utils/formatters";
import { useState } from "react";

// ── Card móvil/tablet de cliente
function ClientCard({ user: u }) {
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
    >
      {/* Cabecera: avatar + nombre + fecha */}
      <Flex
        align="center"
        gap={3}
        px={4}
        py={3}
        bg="bg.subtle"
        borderBottom="1px solid"
        borderColor="border.default"
      >
        <Avatar.Root size="sm" bg="brand.subtle" flexShrink={0}>
          <Avatar.Fallback color="brand.text" fontWeight={700} fontSize="xs">
            {fmtInitials(u.username)}
          </Avatar.Fallback>
        </Avatar.Root>
        <Box flex={1} minW={0}>
          <Text
            fontSize="sm"
            fontWeight={700}
            color="text.primary"
            lineClamp={1}
          >
            {u.username}
          </Text>
        </Box>
        <Box textAlign="right" flexShrink={0}>
          <Text
            fontSize="xs"
            color="text.muted"
            fontWeight={600}
            textTransform="uppercase"
            letterSpacing="wider"
          >
            Registro
          </Text>
          <Text fontSize="xs" color="text.secondary">
            {fmtDate(u.created_at)}
          </Text>
        </Box>
      </Flex>

      {/* Cuerpo: email + teléfono en dos columnas */}
      <Grid templateColumns="1fr 1fr" px={4} py={3} gap={2}>
        <Box minW={0}>
          <Text
            fontSize="xs"
            color="text.muted"
            fontWeight={600}
            textTransform="uppercase"
            letterSpacing="wider"
            mb={1}
          >
            Email
          </Text>
          <Text
            fontSize="xs"
            color="text.secondary"
            fontWeight={500}
            lineClamp={1}
          >
            {u.email}
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
            Teléfono
          </Text>
          <Text fontSize="xs" color="text.secondary" fontWeight={500}>
            {u.phone ?? "—"}
          </Text>
        </Box>
      </Grid>

      {/* Dirección si existe */}
      {u.address && (
        <>
          <Separator />
          <Flex align="center" gap={2} px={4} py={2.5}>
            <Text fontSize="xs" color="text.muted" lineClamp={1}>
              {u.address}
            </Text>
          </Flex>
        </>
      )}
    </Box>
  );
}

export default function EmployeeClientsPage() {
  const { users: allUsers, loading } = useUsers();
  const [search, setSearch] = useState("");

  // Solo clientes
  const users = allUsers.filter((u) => u.role === "cliente");

  // Filtro por nombre o email
  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Box>
      {/* Header */}
      <PageHeader
        title="Clientes"
        subtitle={`${users.length} clientes registrados`}
      />

      {/* Buscador */}
      <Input
        placeholder="Buscar por nombre o email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        maxW="300px"
        size="sm"
        mb={5}
      />

      {/* ── MÓVIL/TABLET: cards */}
      <Box display={{ base: "block", md: "none" }}>
        {loading ? (
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={3}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} h="120px" borderRadius="xl" />
            ))}
          </Grid>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={LuUsers}
            title="Sin clientes"
            message="No hay clientes que coincidan con la búsqueda."
          />
        ) : (
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={3}>
            {filtered.map((u) => (
              <ClientCard key={u.id} user={u} />
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
            <Skeleton h="200px" borderRadius="md" />
          </Box>
        ) : filtered.length === 0 ? (
          // Sin resultados
          <EmptyState
            icon={LuUsers}
            title="Sin clientes"
            message="No hay clientes que coincidan con la búsqueda."
          />
        ) : (
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="bg.subtle">
                {["Cliente", "Email", "Teléfono", "Dirección", "Registro"].map(
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
              {filtered.map((u) => (
                <Table.Row key={u.id} _hover={{ bg: "bg.subtle" }}>
                  {/* Avatar + usuario */}
                  <Table.Cell px={4} py={3}>
                    <Flex align="center" gap={3}>
                      <Avatar.Root size="sm" bg="brand.subtle">
                        <Avatar.Fallback
                          color="brand.text"
                          fontWeight={700}
                          fontSize="xs"
                        >
                          {fmtInitials(u.username)}
                        </Avatar.Fallback>
                      </Avatar.Root>
                      <Text fontSize="sm" fontWeight={500} color="text.primary">
                        {u.username}
                      </Text>
                    </Flex>
                  </Table.Cell>

                  {/* Email */}
                  <Table.Cell px={4} py={3}>
                    <Text fontSize="sm" color="text.secondary">
                      {u.email}
                    </Text>
                  </Table.Cell>

                  {/* Teléfono */}
                  <Table.Cell px={4} py={3}>
                    <Text fontSize="sm" color="text.secondary">
                      {u.phone ?? "—"}
                    </Text>
                  </Table.Cell>

                  {/* Dirección */}
                  <Table.Cell px={4} py={3}>
                    <Text
                      fontSize="sm"
                      color="text.secondary"
                      maxW="200px"
                      truncate
                    >
                      {u.address ?? "—"}
                    </Text>
                  </Table.Cell>

                  {/* Fecha de registro */}
                  <Table.Cell px={4} py={3}>
                    <Text
                      fontSize="sm"
                      color="text.secondary"
                      whiteSpace="nowrap"
                    >
                      {fmtDate(u.created_at)}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Box>
    </Box>
  );
}
