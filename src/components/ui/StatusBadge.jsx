import { Badge } from "@chakra-ui/react";

// mapa estado → label + color
const STATUS_MAP = {
  pendiente: { label: "Pendiente", colorPalette: "yellow" },
  en_preparacion: { label: "En preparación", colorPalette: "blue" },
  entregado: { label: "Entregado", colorPalette: "green" },
  cancelado: { label: "Cancelado", colorPalette: "red" },
};

/**
 * Badge de estado de pedido.
 */
export default function StatusBadge({ status, size = "sm" }) {
  const config = STATUS_MAP[status] ?? {
    label: status,
    colorPalette: "gray",
  };

  return (
    <Badge
      colorPalette={config.colorPalette}
      variant="subtle"
      size={size}
      borderRadius="full"
      px={3}
      py={0.5}
      fontWeight={600}
      fontSize="xs"
      textTransform="capitalize"
    >
      {config.label}
    </Badge>
  );
}
