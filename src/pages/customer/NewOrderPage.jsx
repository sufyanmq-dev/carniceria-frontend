import {
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Input,
  Separator,
  Skeleton,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuShoppingCart,
  LuArrowLeft,
  LuPackage,
  LuHistory,
} from "react-icons/lu";
import { productService } from "@/services/productService";
import { orderService } from "@/services/orderService";
import { fmtPrice, fmtPriceWithUnit, fmtQuantity } from "@/utils/formatters";
import { getErrorMessage } from "@/utils/errorMessages";
import ProductCard from "@/components/ui/ProductCard";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

// Paso 1: catálogo
function CatalogStep({ onNext }) {
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Todos");
  const [cart, setCart] = useState({});

  // Carga productos + historial
  useEffect(() => {
    Promise.all([productService.getAll(), orderService.getAll()])
      .then(([{ products }, { orders }]) => {
        setProducts(products);

        const ids = new Set(
          orders.flatMap((o) => (o.items ?? []).map((i) => i.product_id)),
        );

        setHistory([...ids]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Categorías únicas
  const categories = [
    "Todos",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  // Ordena: historial primero
  const sorted = useMemo(() => {
    const active = products.filter((p) => p.is_active);
    const inHistory = active.filter((p) => history.includes(p.id));
    const notHistory = active.filter((p) => !history.includes(p.id));
    return [...inHistory, ...notHistory];
  }, [products, history]);

  // Filtros
  const filtered = sorted
    .filter((p) => catFilter === "Todos" || p.category === catFilter)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  // Actualiza cantidad en carrito
  const setQty = (id, val) => setCart((prev) => ({ ...prev, [id]: val }));

  // Items seleccionados
  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({
      ...products.find((p) => p.id === id),
      qty,
    }));

  const cartTotal = cartItems.reduce((s, i) => s + Number(i.price) * i.qty, 0);

  return (
    <Box>
      <PageHeader
        title="Nuevo pedido"
        subtitle="Selecciona los productos del catálogo"
        action={
          cartItems.length > 0 && (
            <Button
              size="sm"
              bg="brand.solid"
              color="white"
              _hover={{ bg: "brand.600" }}
              fontWeight={600}
              onClick={() => onNext(cartItems, cartTotal)}
            >
              <Icon as={LuShoppingCart} />
              Ver carrito ({cartItems.length}) — {fmtPrice(cartTotal)}
            </Button>
          )
        }
      />

      {/* Buscador + filtros */}
      <Flex gap={3} mb={4} direction={{ base: "column", sm: "row" }}>
        <Input
          placeholder="Buscar producto…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW={{ sm: "260px" }}
          size="sm"
        />

        <Flex gap={2} flexWrap="wrap">
          {categories.map((c) => (
            <Button
              key={c}
              size="xs"
              variant={catFilter === c ? "solid" : "outline"}
              bg={catFilter === c ? "brand.solid" : "transparent"}
              color={catFilter === c ? "white" : "text.secondary"}
              borderColor={catFilter === c ? "brand.solid" : "border.default"}
              _hover={{
                bg: catFilter === c ? "brand.600" : "bg.subtle",
              }}
              fontWeight={catFilter === c ? 600 : 400}
              onClick={() => setCatFilter(c)}
            >
              {c}
            </Button>
          ))}
        </Flex>
      </Flex>

      {/* Aviso historial */}
      {history.length > 0 && catFilter === "Todos" && !search && (
        <Flex
          align="center"
          gap={2}
          mb={4}
          p={3}
          bg="brand.subtle"
          borderRadius="md"
        >
          <Icon as={LuHistory} boxSize={4} color="brand.text" />
          <Text fontSize="xs" color="brand.text">
            Los productos que sueles pedir aparecen primero.
          </Text>
        </Flex>
      )}

      {loading ? (
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={4}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} h="200px" borderRadius="xl" />
          ))}
        </Grid>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={LuPackage}
          title="Sin productos"
          message="No hay productos que coincidan."
        />
      ) : (
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={4}
        >
          {filtered.map((p) => (
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
  );
}

// Paso 2: confirmación
function ConfirmStep({
  cartItems,
  cartTotal,
  onBack,
  onConfirm,
  loading,
  error,
}) {
  const [notes, setNotes] = useState("");

  return (
    <Box>
      <PageHeader
        title="Confirmar pedido"
        subtitle="Revisa tu selección antes de enviar"
      />

      <Grid
        templateColumns={{ base: "1fr", md: "1fr 340px" }}
        gap={6}
        alignItems="start"
      >
        {/* Items */}
        <Box
          bg="bg.surface"
          border="1px solid"
          borderColor="border.default"
          borderRadius="lg"
          overflow="hidden"
        >
          <Text
            px={5}
            py={3}
            fontWeight={600}
            fontSize="sm"
            color="text.primary"
            borderBottom="1px solid"
            borderColor="border.default"
          >
            Productos seleccionados
          </Text>

          <VStack gap={0} align="stretch" divideY="1px">
            {cartItems.map((item) => (
              <Flex
                key={item.id}
                justify="space-between"
                align="center"
                px={5}
                py={3}
              >
                <Box>
                  <Text fontSize="sm" fontWeight={500} color="text.primary">
                    {item.name}
                  </Text>
                  <Text fontSize="xs" color="text.secondary">
                    {fmtQuantity(item.qty, item.unit)} ×{" "}
                    {fmtPriceWithUnit(item.price, item.unit)}
                  </Text>
                </Box>

                <Text fontSize="sm" fontWeight={700} color="text.primary">
                  {fmtPrice(Number(item.price) * item.qty)}
                </Text>
              </Flex>
            ))}
          </VStack>
        </Box>

        {/* Resumen */}
        <VStack gap={4} align="stretch">
          <Box
            bg="bg.surface"
            border="1px solid"
            borderColor="border.default"
            borderRadius="lg"
            p={5}
          >
            <Text fontWeight={600} fontSize="sm" mb={3}>
              Resumen
            </Text>

            <Flex justify="space-between" mb={2}>
              <Text fontSize="sm" color="text.secondary">
                Líneas
              </Text>
              <Text fontSize="sm">{cartItems.length}</Text>
            </Flex>

            <Separator mb={3} />

            <Flex justify="space-between">
              <Text fontWeight={700}>Total</Text>
              <Text fontWeight={800} fontSize="lg" color="brand.solid">
                {fmtPrice(cartTotal)}
              </Text>
            </Flex>
          </Box>

          {/* Notas */}
          <Box
            bg="bg.surface"
            border="1px solid"
            borderColor="border.default"
            borderRadius="lg"
            p={5}
          >
            <Text fontWeight={600} fontSize="sm" mb={2}>
              Notas{" "}
              <Box as="span" fontSize="xs" color="text.muted">
                (opcional)
              </Box>
            </Text>

            <Textarea
              placeholder="Ej: sin hueso, corte fino..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              fontSize="sm"
            />
          </Box>

          {error && (
            <Text fontSize="sm" color="red.500">
              {error}
            </Text>
          )}

          {/* Acciones */}
          <Flex gap={3}>
            <Button flex={1} variant="outline" onClick={onBack}>
              <Icon as={LuArrowLeft} /> Volver
            </Button>

            <Button
              flex={2}
              bg="brand.solid"
              color="white"
              _hover={{ bg: "brand.600" }}
              fontWeight={600}
              loading={loading}
              onClick={() => onConfirm(notes)}
            >
              Confirmar pedido
            </Button>
          </Flex>
        </VStack>
      </Grid>
    </Box>
  );
}

// Página principal
export default function NewOrderPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Ir a confirmación
  const handleNext = (items, total) => {
    setCartItems(items);
    setCartTotal(total);
    setStep(2);
  };

  // Enviar pedido
  const handleConfirm = async (notes) => {
    setSending(true);
    setError("");

    try {
      await orderService.create({
        notes: notes || undefined,
        items: cartItems.map((i) => ({
          product_id: i.id,
          quantity: i.qty,
        })),
      });

      navigate("/cliente/pedidos");
    } catch (err) {
      setError(getErrorMessage(err));
      setSending(false);
    }
  };

  if (step === 2) {
    return (
      <ConfirmStep
        cartItems={cartItems}
        cartTotal={cartTotal}
        onBack={() => setStep(1)}
        onConfirm={handleConfirm}
        loading={sending}
        error={error}
      />
    );
  }

  return <CatalogStep onNext={handleNext} />;
}
