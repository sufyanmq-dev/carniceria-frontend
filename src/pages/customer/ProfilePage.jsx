import {
  Avatar,
  Box,
  Button,
  Field,
  Flex,
  Grid,
  Input,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuPencil, LuCheck, LuX } from "react-icons/lu";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import { getErrorMessage } from "@/utils/errorMessages";
import { fmtDateLong, fmtInitials } from "@/utils/formatters";
import PageHeader from "@/components/ui/PageHeader";

export default function ProfilePage() {
  const { user: authUser } = useAuth();

  const [profile, setProfile] = useState(null); // datos del usuario
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false); // modo edición
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({}); // datos editables

  // Carga el perfil al entrar
  useEffect(() => {
    authService
      .me()
      .then(({ user }) => {
        setProfile(user);
        setForm({
          username: user.username,
          phone: user.phone ?? "",
          address: user.address ?? "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Actualiza el form
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Cancela edición y restaura datos
  const handleCancel = () => {
    setForm({
      username: profile.username,
      phone: profile.phone ?? "",
      address: profile.address ?? "",
    });
    setEditing(false);
    setError("");
  };

  // Guarda cambios en backend
  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const { user } = await userService.updateMe({
        username: form.username || undefined,
        phone: form.phone || undefined,
        address: form.address || undefined,
      });
      setProfile((prev) => ({ ...prev, ...user }));
      setEditing(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box maxW="640px">
      <PageHeader
        title="Mi perfil"
        subtitle={
          profile ? `Cliente desde ${fmtDateLong(profile.created_at)}` : ""
        }
        action={
          !editing ? (
            // Botón editar
            <Button
              size="sm"
              variant="outline"
              borderColor="border.default"
              color="text.secondary"
              gap={2}
              onClick={() => setEditing(true)}
            >
              <LuPencil size={14} /> Editar
            </Button>
          ) : (
            // Botones guardar / cancelar
            <Flex gap={2}>
              <Button
                size="sm"
                variant="outline"
                borderColor="border.default"
                color="text.secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                <LuX size={14} /> Cancelar
              </Button>
              <Button
                size="sm"
                bg="brand.solid"
                color="white"
                _hover={{ bg: "brand.600" }}
                loading={saving}
                loadingText="Guardando…"
                onClick={handleSave}
              >
                <LuCheck size={14} /> Guardar
              </Button>
            </Flex>
          )
        }
      />

      {/* Avatar + info básica */}
      <Skeleton loading={loading} borderRadius="lg" mb={5}>
        <Flex
          align="center"
          gap={4}
          p={5}
          bg="bg.surface"
          border="1px solid"
          borderColor="border.default"
          borderRadius="lg"
          mb={5}
        >
          <Avatar.Root size="lg" bg="brand.solid" color="white">
            <Avatar.Fallback fontWeight={700}>
              {fmtInitials(profile?.username ?? "")}
            </Avatar.Fallback>
          </Avatar.Root>

          <Box>
            <Text fontWeight={700} fontSize="lg" color="text.primary">
              {profile?.username}
            </Text>
            <Text fontSize="sm" color="text.secondary">
              {profile?.email}
            </Text>
            <Text
              fontSize="xs"
              mt={1}
              px={2}
              py={0.5}
              borderRadius="full"
              bg="brand.subtle"
              color="brand.text"
              display="inline-block"
              fontWeight={600}
              textTransform="capitalize"
            >
              {profile?.role}
            </Text>
          </Box>
        </Flex>
      </Skeleton>

      {/* Formulario */}
      <Skeleton loading={loading} borderRadius="lg">
        <Box
          bg="bg.surface"
          border="1px solid"
          borderColor="border.default"
          borderRadius="lg"
          p={6}
        >
          <Text fontWeight={600} fontSize="sm" color="text.primary" mb={5}>
            Información personal
          </Text>

          {/* Error */}
          {error && (
            <Text fontSize="sm" color="red.500" mb={4}>
              {error}
            </Text>
          )}

          <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={5}>
            {/* Email (no editable) */}
            <Field.Root>
              <Field.Label
                fontSize="xs"
                fontWeight={600}
                color="text.secondary"
              >
                Email
              </Field.Label>
              <Input value={profile?.email ?? ""} readOnly disabled size="sm" />
            </Field.Root>

            {/* Username */}
            <Field.Root>
              <Field.Label
                fontSize="xs"
                fontWeight={600}
                color="text.secondary"
              >
                Nombre de usuario
              </Field.Label>
              <Input
                name="username"
                value={form.username ?? ""}
                onChange={handleChange}
                readOnly={!editing}
                disabled={!editing}
                size="sm"
              />
            </Field.Root>

            {/* Teléfono */}
            <Field.Root>
              <Field.Label
                fontSize="xs"
                fontWeight={600}
                color="text.secondary"
              >
                Teléfono
              </Field.Label>
              <Input
                name="phone"
                value={form.phone ?? ""}
                onChange={handleChange}
                placeholder={editing ? "612 345 678" : "—"}
                readOnly={!editing}
                disabled={!editing}
                size="sm"
              />
            </Field.Root>

            {/* Dirección */}
            <Field.Root>
              <Field.Label
                fontSize="xs"
                fontWeight={600}
                color="text.secondary"
              >
                Dirección
              </Field.Label>
              <Input
                name="address"
                value={form.address ?? ""}
                onChange={handleChange}
                placeholder={editing ? "Calle Mayor 12, Madrid" : "—"}
                readOnly={!editing}
                disabled={!editing}
                size="sm"
              />
            </Field.Root>
          </Grid>
        </Box>
      </Skeleton>
    </Box>
  );
}
