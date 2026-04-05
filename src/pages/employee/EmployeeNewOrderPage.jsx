import {
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Input,
  NativeSelect,
  Separator,
  Skeleton,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import { productService } from "@/services/productService";
import { userService } from "@/services/userService";
import { orderService } from "@/services/orderService";
import { fmtPrice, fmtPriceWithUnit, fmtQuantity } from "@/utils/formatters";
import { getErrorMessage } from "@/utils/errorMessages";
import ProductCard from "@/components/ui/ProductCard";
import PageHeader from "@/components/ui/PageHeader";

export default function EmployeeNewOrderPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState("");
  const [cart, setCart] = useState({});
  const [notes, setNotes] = useState("");
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([productService.getAll(), userService.getAll()])
      .then(([{ products }, { users }]) => {
        setProducts(products.filter((p) => p.is_active));
        const clientes = users.filter((u) => u.role === "cliente");
        setClients(clientes);
        if (clientes.length > 0) setClientId(clientes[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const setQty = (id, val) => setCart((prev) => ({ ...prev, [id]: val }));

  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ ...products.find((p) => p.id === id), qty }));

  const cartTotal = cartItems.reduce((s, i) => s + Number(i.price) * i.qty, 0);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSubmit = async () => {
    if (!clientId) {
      setError("Selecciona un cliente.");
      return;
    }
    if (!cartItems.length) {
      setError("Añade al menos un producto.");
      return;
    }
    setError("");
    setSending(true);
    try {
      await orderService.create({
        user_id: clientId,
        notes: notes || undefined,
        items: cartItems.map((i) => ({ product_id: i.id, quantity: i.qty })),
      });
      navigate("/empleado/pedidos");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Nuevo pedido"
        subtitle="Crea un pedido en nombre de un cliente"
      />

      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 320px" }}
        gap={6}
        alignItems="start"
      >
        <VStack gap={5} align="stretch">
          {/* Selector de cliente */}
          <Box
            bg="bg.surface"
            border="1px solid"
            borderColor="border.default"
            borderRadius="lg"
            p={5}
          >
            <Text fontWeight={600} fontSize="sm" color="text.primary" mb={3}>
              Cliente
            </Text>
            {loading ? (
              <Skeleton h="36px" borderRadius="md" />
            ) : (
              <NativeSelect.Root size="sm">
                <NativeSelect.Field
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  borderColor="border.default"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.username} — {c.email}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            )}
          </Box>

          {/* Catálogo con ProductCard */}
          <Box
            bg="bg.surface"
            border="1px solid"
            borderColor="border.default"
            borderRadius="lg"
            p={5}
          >
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontWeight={600} fontSize="sm" color="text.primary">
                Productos
              </Text>
              <Input
                placeholder="Buscar…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="xs"
                maxW="180px"
              />
            </Flex>

            {loading ? (
              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} h="200px" borderRadius="xl" />
                ))}
              </Grid>
            ) : (
              <Grid
                templateColumns={{
                  base: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                }}
                gap={3}
              >
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    qty={cart[p.id] ?? 0}
                    onQtyChange={(val) => setQty(p.id, val)}
                  />
                ))}
              </Grid>
            )}
          </Box>
        </VStack>

        {/* Resumen sticky */}
        <VStack
          gap={4}
          align="stretch"
          position={{ lg: "sticky" }}
          top={{ lg: "80px" }}
        >
          <Box
            bg="bg.surface"
            border="1px solid"
            borderColor="border.default"
            borderRadius="lg"
            p={5}
          >
            <Text fontWeight={600} fontSize="sm" color="text.primary" mb={4}>
              Resumen del pedido
            </Text>

            {cartItems.length === 0 ? (
              <Text fontSize="sm" color="text.muted" textAlign="center" py={4}>
                Sin productos seleccionados
              </Text>
            ) : (
              <VStack gap={2} align="stretch" mb={4}>
                {cartItems.map((item) => (
                  <Flex key={item.id} justify="space-between" align="center">
                    <Box>
                      <Text
                        fontSize="xs"
                        fontWeight={500}
                        color="text.primary"
                        lineClamp={1}
                      >
                        {item.name}
                      </Text>
                      <Text fontSize="xs" color="text.muted">
                        {fmtQuantity(item.qty, item.unit)} ×{" "}
                        {fmtPrice(item.price)}
                      </Text>
                    </Box>
                    <Text fontSize="xs" fontWeight={700} color="text.primary">
                      {fmtPrice(Number(item.price) * item.qty)}
                    </Text>
                  </Flex>
                ))}
              </VStack>
            )}

            <Separator mb={3} />
            <Flex justify="space-between" mb={4}>
              <Text fontWeight={700} fontSize="sm" color="text.primary">
                Total
              </Text>
              <Text fontWeight={800} fontSize="lg" color="brand.solid">
                {fmtPrice(cartTotal)}
              </Text>
            </Flex>

            <Text fontWeight={500} fontSize="xs" color="text.secondary" mb={1}>
              Notas
            </Text>
            <Textarea
              placeholder="Instrucciones especiales…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              fontSize="sm"
              mb={4}
            />

            {error && (
              <Text fontSize="xs" color="red.500" mb={3}>
                {error}
              </Text>
            )}

            <Flex gap={2}>
              <Button
                flex={1}
                variant="outline"
                borderColor="border.default"
                color="text.secondary"
                size="sm"
                onClick={() => navigate("/empleado/pedidos")}
              >
                <Icon as={LuArrowLeft} boxSize={3} /> Cancelar
              </Button>
              <Button
                flex={2}
                bg="brand.solid"
                color="white"
                _hover={{ bg: "brand.600" }}
                fontWeight={600}
                size="sm"
                loading={sending}
                loadingText="Creando…"
                onClick={handleSubmit}
              >
                Crear pedido
              </Button>
            </Flex>
          </Box>
        </VStack>
      </Grid>
    </Box>
  );
}
