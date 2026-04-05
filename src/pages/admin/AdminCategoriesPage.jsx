import {
  Box,
  Button,
  Dialog,
  Field,
  Flex,
  Icon,
  Input,
  Portal,
  Skeleton,
  Table,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuPencil, LuPlus, LuTag, LuTrash2 } from "react-icons/lu";
import { useCategories } from "@/hooks/useCategories";
import { getErrorMessage } from "@/utils/errorMessages";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const EMPTY_FORM = { name: "", description: "" };

// Formulario crear/editar categoría
function CategoryFormDialog({ open, onClose, onSave, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initial ?? EMPTY_FORM);
    setError("");
  }, [initial, open]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description || undefined,
      };
      await onSave(payload); // create o update
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
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
                {isEdit ? "Editar categoría" : "Nueva categoría"}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack gap={4} align="stretch">
                {error && (
                  <Text fontSize="sm" color="red.500">
                    {error}
                  </Text>
                )}
                <Field.Root>
                  <Field.Label fontSize="sm">Nombre *</Field.Label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    size="sm"
                    placeholder="Vacuno"
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label fontSize="sm">Descripción</Field.Label>
                  <Textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    size="sm"
                    rows={2}
                    placeholder="Descripción opcional"
                  />
                </Field.Root>
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
                  isLoaded={!loading}
                  loadingText="Guardando…"
                  onClick={handleSubmit}
                >
                  {isEdit ? "Guardar cambios" : "Crear categoría"}
                </Button>
              </Flex>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

// Página admin categorías
export default function AdminCategoriesPage() {
  const {
    categories,
    loading,
    createCategory,
    updateCategory,
    removeCategory,
  } = useCategories();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  const handleSave = async (payload) =>
    editing ? updateCategory(editing.id, payload) : createCategory(payload);

  const handleDelete = async () => {
    setDelLoading(true);
    const ok = await removeCategory(deleting.id);
    setDelLoading(false);
    if (ok) setDeleting(null);
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (c) => {
    setEditing(c);
    setFormOpen(true);
  };

  return (
    <Box>
      <PageHeader
        title="Categorías"
        subtitle={`${categories.length} categorías`}
        action={
          <Button
            size="sm"
            bg="brand.solid"
            color="white"
            _hover={{ bg: "brand.600" }}
            fontWeight={600}
            onClick={openCreate}
          >
            <Icon as={LuPlus} boxSize={4} /> Nueva categoría
          </Button>
        }
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
            <Skeleton h="180px" borderRadius="md" />
          </Box>
        ) : categories.length === 0 ? (
          <EmptyState
            icon={LuTag}
            title="Sin categorías"
            message="Crea la primera categoría para organizar tus productos."
            action={
              <Button
                size="sm"
                bg="brand.solid"
                color="white"
                _hover={{ bg: "brand.600" }}
                onClick={openCreate}
              >
                Nueva categoría
              </Button>
            }
          />
        ) : (
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="bg.subtle">
                {["Nombre", "Descripción", ""].map((h) => (
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
              {categories.map((c) => (
                <Table.Row key={c.id} _hover={{ bg: "bg.subtle" }}>
                  <Table.Cell px={4} py={3}>
                    <Text fontSize="sm" fontWeight={500} color="text.primary">
                      {c.name}
                    </Text>
                  </Table.Cell>
                  <Table.Cell px={4} py={3}>
                    <Text fontSize="sm" color="text.secondary">
                      {c.description ?? "—"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell px={4} py={3}>
                    <Flex gap={2} justify="flex-end">
                      <Button
                        size="xs"
                        variant="ghost"
                        color="text.secondary"
                        onClick={() => openEdit(c)}
                      >
                        <Icon as={LuPencil} boxSize={3} />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        color="red.400"
                        onClick={() => setDeleting(c)}
                      >
                        <Icon as={LuTrash2} boxSize={3} />
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Box>

      <CategoryFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initial={editing}
      />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={delLoading}
        title="¿Eliminar categoría?"
        message={`Se eliminará "${deleting?.name}". Los productos asociados quedarán sin categoría.`}
      />
    </Box>
  );
}
