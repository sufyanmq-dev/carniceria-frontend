import {
  Avatar,
  Box,
  Flex,
  Input,
  Skeleton,
  Table,
  Text,
} from "@chakra-ui/react";
import { useUsers } from "@/hooks/useUsers";
import { LuUsers } from "react-icons/lu";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import { fmtDate, fmtInitials } from "@/utils/formatters";
import { useState } from "react";

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

      <Box
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
