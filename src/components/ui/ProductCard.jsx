import { Badge, Box, Button, Flex, Icon, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";
import { fmtPriceWithUnit, fmtQuantity } from "@/utils/formatters";

// emojis por categoría (sin cerdo)
const CATEGORY_ICONS = {
  pollo: "🍗",
  ternera: "🥩",
  vacuno: "🥩",
  cordero: "🐑",
  conejo: "🐇",
};

export const getCategoryIcon = (category = "") => {
  const key = Object.keys(CATEGORY_ICONS).find((k) =>
    category.toLowerCase().includes(k),
  );
  return key ? CATEGORY_ICONS[key] : "🍖";
};

/**
 * Card de producto.
 * Maneja cantidad y muestra info básica.
 */
export default function ProductCard({
  product: p,
  qty = 0,
  onQtyChange,
  showInactive = false,
}) {
  const readOnly = !onQtyChange;
  const step = p.unit === "kg" ? 0.5 : 1;
  const [inputVal, setInputVal] = useState(qty > 0 ? String(qty) : "");

  // sync con cambios externos
  useEffect(() => {
    setInputVal(qty > 0 ? String(qty) : "");
  }, [qty]);

  // suma/resta cantidad
  const applyDelta = (delta) => {
    const next = Math.max(
      0,
      parseFloat(((qty || 0) + delta * step).toFixed(2)),
    );
    setInputVal(next > 0 ? String(next) : "");
    onQtyChange(next);
  };

  // input manual
  const handleInputChange = (e) => {
    setInputVal(e.target.value);
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= 0) onQtyChange(parseFloat(val.toFixed(2)));
    else if (e.target.value === "") onQtyChange(0);
  };

  const icon = getCategoryIcon(p.category);
  const inactive = !p.is_active;

  return (
    <Box
      bg="bg.surface"
      border="1px solid"
      borderColor={qty > 0 ? "brand.solid" : "border.default"}
      borderRadius="xl"
      overflow="hidden"
      opacity={inactive ? 0.55 : 1}
      transition="border-color 0.15s, box-shadow 0.15s"
      _hover={
        !readOnly && !inactive
          ? { boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }
          : {}
      }
      position="relative"
    >
      {/* header */}
      <Box bg={qty > 0 ? "brand.subtle" : "bg.subtle"} px={4} pt={4} pb={3}>
        <Flex align="center" justify="space-between" mb={1}>
          <Flex align="center" gap={1.5}>
            <Text fontSize="xl" lineHeight={1}>
              {icon}
            </Text>
            <Text
              fontSize="xs"
              color="text.muted"
              textTransform="uppercase"
              letterSpacing="wider"
              fontWeight={600}
            >
              {p.category ?? "General"}
            </Text>
          </Flex>

          {/* estado */}
          {showInactive && inactive && (
            <Badge size="xs" colorPalette="red" variant="subtle">
              Inactivo
            </Badge>
          )}
          {!showInactive && inactive && (
            <Badge size="xs" colorPalette="red" variant="subtle">
              No disponible
            </Badge>
          )}
        </Flex>

        <Text
          fontSize="sm"
          fontWeight={700}
          color="text.primary"
          lineClamp={2}
          minH="40px"
        >
          {p.name}
        </Text>
      </Box>

      {/* body */}
      <Box px={4} pb={4} pt={3}>
        {p.description && (
          <Text fontSize="xs" color="text.secondary" lineClamp={2} mb={3}>
            {p.description}
          </Text>
        )}

        {/* precio */}
        <Text
          fontSize="xl"
          fontWeight={800}
          color="brand.solid"
          mb={readOnly ? 0 : 3}
        >
          {fmtPriceWithUnit(p.price, p.unit)}
        </Text>

        {/* controles */}
        {!readOnly && !inactive && (
          <Flex align="center" gap={1.5}>
            <Button
              size="xs"
              variant="outline"
              borderColor="border.default"
              borderRadius="md"
              disabled={qty === 0}
              onClick={() => applyDelta(-1)}
              px={2}
            >
              <Icon as={LuMinus} boxSize={3} />
            </Button>

            <Input
              value={inputVal}
              onChange={handleInputChange}
              size="xs"
              type="number"
              min={0}
              step={step}
              textAlign="center"
              fontFamily="mono"
              fontWeight={700}
              color={qty > 0 ? "brand.solid" : "text.muted"}
              borderRadius="md"
              flex={1}
              px={1}
            />

            <Text fontSize="xs" color="text.muted" flexShrink={0}>
              {p.unit}
            </Text>

            <Button
              size="xs"
              variant="outline"
              borderColor="border.default"
              borderRadius="md"
              onClick={() => applyDelta(1)}
              px={2}
            >
              <Icon as={LuPlus} boxSize={3} />
            </Button>
          </Flex>
        )}

        {/* cantidad seleccionada */}
        {!readOnly && !inactive && qty > 0 && (
          <Text
            fontSize="xs"
            color="brand.text"
            fontWeight={600}
            mt={2}
            textAlign="center"
          >
            {fmtQuantity(qty, p.unit)} seleccionados
          </Text>
        )}

        {!readOnly && inactive && (
          <Text fontSize="xs" color="text.muted">
            No disponible para pedidos
          </Text>
        )}
      </Box>
    </Box>
  );
}
