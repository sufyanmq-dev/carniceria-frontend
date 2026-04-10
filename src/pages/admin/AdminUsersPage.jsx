import {
  Avatar,
  Badge,
  Box,
  Button,
  Dialog,
  Flex,
  Grid,
  Icon,
  Input,
  NativeSelect,
  Portal,
  Separator,
  Skeleton,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuTrash2, LuShield, LuUsers, LuEye } from "react-icons/lu";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import { fmtDate, fmtInitials } from "@/utils/formatters";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const ROLE_COLOR = { admin: "purple", empleado: "blue", cliente: "green" };
const ROLE_OPTIONS = [
  { label: "Cliente", value: "cliente" },
  { label: "Empleado", value: "empleado" },
  { label: "Admin", value: "admin" },
];

function ChangeRoleDialog({ open, onClose, onSave, targetUser }) {
  const [role, setRole] = useState(targetUser?.role ?? "cliente");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (role === targetUser?.role) {
      onClose();
      return;
    }
    setLoading(true);
    const ok = await onSave(targetUser.id, role);
    setLoading(false);
    if (ok !== undefined) onClose();
    else setError("Error al cambiar el rol.");
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => !e.open && onClose()}
      size="sm"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title fontSize="md" fontWeight={700} color="text.primary">
                Cambiar rol — {targetUser?.username}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack gap={3} align="stretch">
                {error && (
                  <Text fontSize="sm" color="red.500">
                    {error}
                  </Text>
                )}
                <NativeSelect.Root size="sm">
                  <NativeSelect.Field
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    borderColor="border.default"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Flex gap={3} justify="flex-end">
                <Button
                  variant="outline"
                  borderColor="border.default"
                  color="text.secondary"
                  size="sm"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  bg="brand.solid"
                  color="white"
                  _hover={{ bg: "brand.600" }}
                  loading={loading}
                  onClick={handleSave}
                >
                  Cambiar rol
                </Button>
              </Flex>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

function UserDetailDialog({ open, onClose, user: u }) {
  if (!u) return null;
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => !e.open && onClose()}
      size="sm"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title fontSize="md" fontWeight={700} color="text.primary">
                Detalles del usuario
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Flex align="center" gap={4} mb={4}>
                <Avatar.Root size="lg" bg="brand.subtle">
                  <Avatar.Fallback color="brand.text" fontWeight={700}>
                    {fmtInitials(u.username)}
                  </Avatar.Fallback>
                </Avatar.Root>
                <Box>
                  <Text fontWeight={700} color="text.primary">
                    {u.username}
                  </Text>
                  <Badge
                    size="xs"
                    colorPalette={ROLE_COLOR[u.role] ?? "gray"}
                    variant="subtle"
                    borderRadius="full"
                    textTransform="capitalize"
                    mt={1}
                  >
                    {u.role}
                  </Badge>
                </Box>
              </Flex>
              <Separator mb={4} />
              <VStack gap={3} align="stretch">
                {[
                  { label: "Email", value: u.email },
                  { label: "Teléfono", value: u.phone },
                  { label: "Dirección", value: u.address },
                  { label: "Registro", value: fmtDate(u.created_at) },
                ].map(({ label, value }) => (
                  <Flex key={label} justify="space-between" align="flex-start">
                    <Text
                      fontSize="xs"
                      color="text.muted"
                      fontWeight={600}
                      textTransform="uppercase"
                      letterSpacing="wider"
                      flexShrink={0}
                    >
                      {label}
                    </Text>
                    <Text
                      fontSize="sm"
                      color={value ? "text.primary" : "text.muted"}
                      textAlign="right"
                    >
                      {value ?? "—"}
                    </Text>
                  </Flex>
                ))}
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                size="sm"
                variant="outline"
                borderColor="border.default"
                color="text.secondary"
                onClick={onClose}
              >
                Cerrar
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

// ── Card móvil/tablet de usuario
function UserCard({ user: u, isSelf, onView, onChangeRole, onDelete }) {
  return (
    <Box
      bg="bg.surface"
      border="1px solid"
      borderColor="border.default"
      borderRadius="xl"
      overflow="hidden"
      cursor="pointer"
      _hover={{
        borderColor: "brand.solid",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      }}
      transition="all 0.2s"
      onClick={() => onView(u)}
    >
      {/* Cabecera: avatar + nombre + rol */}
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
          <Flex align="center" gap={1.5}>
            <Text
              fontSize="sm"
              fontWeight={700}
              color="text.primary"
              lineClamp={1}
            >
              {u.username}
            </Text>
            {isSelf && (
              <Text fontSize="xs" color="text.muted">
                (tú)
              </Text>
            )}
          </Flex>
        </Box>
        <Badge
          size="xs"
          colorPalette={ROLE_COLOR[u.role] ?? "gray"}
          variant="subtle"
          borderRadius="full"
          textTransform="capitalize"
          flexShrink={0}
        >
          {u.role}
        </Badge>
      </Flex>

      {/* Cuerpo: email + fecha en dos columnas */}
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
            Registro
          </Text>
          <Text fontSize="xs" color="text.secondary" fontWeight={500}>
            {fmtDate(u.created_at)}
          </Text>
        </Box>
      </Grid>

      <Separator />

      {/* Acciones — siempre visibles */}
      <Flex gap={2} px={4} py={3}>
        <Button
          flex={1}
          size="sm"
          variant="outline"
          borderColor="border.strong"
          color="text.secondary"
          fontWeight={600}
          _hover={{ borderColor: "brand.solid", color: "brand.text" }}
          onClick={(e) => {
            e.stopPropagation();
            onView(u);
          }}
        >
          <Icon as={LuEye} boxSize={3.5} /> Ver
        </Button>
        <Button
          flex={1}
          size="sm"
          variant="outline"
          borderColor="border.strong"
          color="text.secondary"
          fontWeight={600}
          _hover={{ borderColor: "blue.400", color: "blue.400" }}
          disabled={isSelf}
          onClick={(e) => {
            e.stopPropagation();
            onChangeRole(u);
          }}
        >
          <Icon as={LuShield} boxSize={3.5} /> Rol
        </Button>
        <Button
          flex={1}
          size="sm"
          variant="outline"
          borderColor="red.200"
          color="red.400"
          fontWeight={600}
          _hover={{ bg: "red.50", _dark: { bg: "red.900" } }}
          disabled={isSelf}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(u);
          }}
        >
          <Icon as={LuTrash2} boxSize={3.5} /> Eliminar
        </Button>
      </Flex>
    </Box>
  );
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const { users, loading, updateRole, removeUser } = useUsers();

  const [search, setSearch] = useState("");
  const [roleDialog, setRoleDialog] = useState(null);
  const [detailUser, setDetailUser] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async () => {
    setDelLoading(true);
    const ok = await removeUser(deleting.id);
    setDelLoading(false);
    if (ok) setDeleting(null);
  };

  return (
    <Box>
      <PageHeader
        title="Usuarios"
        subtitle={`${users.length} usuarios registrados`}
      />

      <Input
        placeholder="Buscar por nombre o email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        maxW="300px"
        size="sm"
        mb={5}
      />

      {/* ── MÓVIL: cards */}
      <Box display={{ base: "block", md: "none" }}>
        {loading ? (
          <VStack gap={3}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} h="148px" borderRadius="lg" w="full" />
            ))}
          </VStack>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={LuUsers}
            title="Sin usuarios"
            message="No hay usuarios que coincidan."
          />
        ) : (
          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={3}>
            {filtered.map((u) => (
              <UserCard
                key={u.id}
                user={u}
                isSelf={u.id === currentUser?.id}
                onView={setDetailUser}
                onChangeRole={setRoleDialog}
                onDelete={setDeleting}
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
            icon={LuUsers}
            title="Sin usuarios"
            message="No hay usuarios que coincidan."
          />
        ) : (
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="bg.subtle">
                {["Usuario", "Email", "Rol", "Registro", ""].map((h) => (
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
              {filtered.map((u) => {
                const isSelf = u.id === currentUser?.id;
                return (
                  <Table.Row key={u.id} _hover={{ bg: "bg.subtle" }}>
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
                        <Box>
                          <Text
                            fontSize="sm"
                            fontWeight={500}
                            color="text.primary"
                          >
                            {u.username}
                          </Text>
                          {isSelf && (
                            <Text fontSize="xs" color="text.muted">
                              (tú)
                            </Text>
                          )}
                        </Box>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell px={4} py={3}>
                      <Text fontSize="sm" color="text.secondary">
                        {u.email}
                      </Text>
                    </Table.Cell>
                    <Table.Cell px={4} py={3}>
                      <Badge
                        size="xs"
                        colorPalette={ROLE_COLOR[u.role] ?? "gray"}
                        variant="subtle"
                        borderRadius="full"
                        textTransform="capitalize"
                      >
                        {u.role}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell px={4} py={3}>
                      <Text
                        fontSize="sm"
                        color="text.secondary"
                        whiteSpace="nowrap"
                      >
                        {fmtDate(u.created_at)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell px={4} py={3}>
                      <Flex gap={2} justify="flex-end">
                        <Button
                          size="xs"
                          variant="ghost"
                          color="text.secondary"
                          onClick={() => setDetailUser(u)}
                        >
                          <Icon as={LuEye} boxSize={3} />
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          color="text.secondary"
                          onClick={() => setRoleDialog(u)}
                          disabled={isSelf}
                        >
                          <Icon as={LuShield} boxSize={3} />
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          color="red.400"
                          onClick={() => setDeleting(u)}
                          disabled={isSelf}
                        >
                          <Icon as={LuTrash2} boxSize={3} />
                        </Button>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        )}
      </Box>

      <UserDetailDialog
        open={!!detailUser}
        onClose={() => setDetailUser(null)}
        user={detailUser}
      />
      <ChangeRoleDialog
        open={!!roleDialog}
        onClose={() => setRoleDialog(null)}
        onSave={updateRole}
        targetUser={roleDialog}
      />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={delLoading}
        title="¿Eliminar usuario?"
        message={`Se eliminará "${deleting?.username}" y todos sus datos permanentemente.`}
      />
    </Box>
  );
}
