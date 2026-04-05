import {
  Badge,
  Box,
  Button,
  Dialog,
  Field,
  Flex,
  Icon,
  Input,
  NativeSelect,
  Portal,
  Skeleton,
  Switch,
  Table,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuPencil, LuPlus, LuTrash2, LuPackage } from "react-icons/lu";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { fmtPriceWithUnit } from "@/utils/formatters";
import { getCategoryIcon } from "@/components/ui/ProductCard";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  unit: "ud",
  category_id: "",
  is_active: true,
};

// ── Formulario crear/editar producto
function ProductFormDialog({ open, onClose, onSave, categories, initial }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initial ?? EMPTY_FORM);
    setError("");
  }, [initial, open]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      setError("Nombre y precio son obligatorios.");
      return;
    }
    setLoading(true);
    const ok = await onSave({
      name: form.name,
      description: form.description || undefined,
      price: parseFloat(form.price),
      unit: form.unit || "ud",
      is_active: form.is_active,
      category_id: form.category_id || undefined,
    });
    setLoading(false);
    if (ok !== false) onClose();
    else setError("Error al guardar el producto.");
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => !e.open && onClose()}
      size="md"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title fontSize="md" fontWeight={700} color="text.primary">
                {isEdit ? "Editar producto" : "Nuevo producto"}
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
                  />
                </Field.Root>

                <Flex gap={3}>
                  <Field.Root flex={2}>
                    <Field.Label fontSize="sm">Precio (€) *</Field.Label>
                    <Input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      size="sm"
                    />
                  </Field.Root>
                  <Field.Root flex={1}>
                    <Field.Label fontSize="sm">Unidad</Field.Label>
                    <NativeSelect.Root size="sm">
                      <NativeSelect.Field
                        name="unit"
                        value={form.unit}
                        onChange={handleChange}
                        borderColor="border.default"
                      >
                        <option value="ud">ud (unidad)</option>
                        <option value="kg">kg (kilo)</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                </Flex>

                <Field.Root>
                  <Field.Label fontSize="sm">Categoría</Field.Label>
                  <NativeSelect.Root size="sm">
                    <NativeSelect.Field
                      name="category_id"
                      value={form.category_id}
                      onChange={handleChange}
                      borderColor="border.default"
                    >
                      <option value="">Sin categoría</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>

                <Flex align="center" gap={3}>
                  <Switch.Root
                    checked={form.is_active}
                    onCheckedChange={({ checked }) =>
                      setForm((prev) => ({ ...prev, is_active: checked }))
                    }
                    colorPalette="green"
                    size="sm"
                  >
                    <Switch.HiddenInput />
                    <Switch.Control />
                  </Switch.Root>
                  <Text fontSize="sm" color="text.primary">
                    Activo
                  </Text>
                </Flex>
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
                  {isEdit ? "Guardar cambios" : "Crear producto"}
                </Button>
              </Flex>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

// ── Página principal de productos
export default function AdminProductsPage() {
  const { products, loading, createProduct, updateProduct, removeProduct } =
    useProducts();
  const { categories } = useCategories();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = (payload) =>
    editing ? updateProduct(editing.id, payload) : createProduct(payload);

  const openEdit = (p) => {
    setEditing({
      ...p,
      price: String(p.price),
      unit: p.unit ?? "ud",
      category_id: p.category_id ?? "",
    });
    setFormOpen(true);
  };

  const handleDelete = async () => {
    setDelLoading(true);
    const ok = await removeProduct(deleting.id);
    setDelLoading(false);
    if (ok) setDeleting(null);
  };

  return (
    <Box>
      <PageHeader
        title="Productos"
        subtitle={`${products.length} productos`}
        action={
          <Button
            size="sm"
            bg="brand.solid"
            color="white"
            _hover={{ bg: "brand.600" }}
            fontWeight={600}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Icon as={LuPlus} boxSize={4} /> Nuevo producto
          </Button>
        }
      />

      <Input
        placeholder="Buscar producto…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        maxW="280px"
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
            <Skeleton h="240px" borderRadius="md" />
          </Box>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={LuPackage}
            title="Sin productos"
            message="Crea el primer producto."
            action={
              <Button
                size="sm"
                bg="brand.solid"
                color="white"
                _hover={{ bg: "brand.600" }}
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
              >
                Nuevo producto
              </Button>
            }
          />
        ) : (
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="bg.subtle">
                {["Producto", "Categoría", "Precio", "Estado", ""].map((h) => (
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
              {filtered.map((p) => (
                <Table.Row key={p.id} _hover={{ bg: "bg.subtle" }}>
                  <Table.Cell px={4} py={3}>
                    <Flex align="center" gap={2}>
                      <Text fontSize="lg" lineHeight={1}>
                        {getCategoryIcon(p.category)}
                      </Text>
                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight={600}
                          color="text.primary"
                        >
                          {p.name}
                        </Text>
                        {p.description && (
                          <Text fontSize="xs" color="text.muted" lineClamp={1}>
                            {p.description}
                          </Text>
                        )}
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell px={4} py={3}>
                    <Text fontSize="sm" color="text.secondary">
                      {p.category ?? "—"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell px={4} py={3}>
                    <Text fontSize="sm" fontWeight={700} color="text.primary">
                      {fmtPriceWithUnit(p.price, p.unit)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell px={4} py={3}>
                    <Badge
                      size="xs"
                      colorPalette={p.is_active ? "green" : "red"}
                      variant="subtle"
                      borderRadius="full"
                    >
                      {p.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell px={4} py={3}>
                    <Flex gap={2} justify="flex-end">
                      <Button
                        size="xs"
                        variant="ghost"
                        color="text.secondary"
                        onClick={() => openEdit(p)}
                      >
                        <Icon as={LuPencil} boxSize={3} />
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        color="red.400"
                        onClick={() => setDeleting(p)}
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

      <ProductFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        categories={categories}
        initial={editing}
      />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={delLoading}
        title="¿Eliminar producto?"
        message={`Se eliminará "${deleting?.name}" permanentemente.`}
      />
    </Box>
  );
}
