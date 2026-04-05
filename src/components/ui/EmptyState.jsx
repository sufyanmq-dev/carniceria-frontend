import { Box, Icon, Text, VStack } from "@chakra-ui/react";
import { LuInbox } from "react-icons/lu";

/** Componente reutilizable para estados vacíos */
export default function EmptyState({
  title = "Sin resultados",
  message = "No hay datos que mostrar.",
  icon = LuInbox,
  action,
}) {
  return (
    <VStack gap={4} py={16} px={6} textAlign="center">
      <Box p={4} borderRadius="full" bg="bg.subtle">
        <Icon as={icon} boxSize={8} color="text.muted" />
      </Box>

      <VStack gap={1}>
        <Text fontWeight={600} fontSize="md" color="text.primary">
          {title}
        </Text>
        <Text fontSize="sm" color="text.secondary" maxW="xs">
          {message}
        </Text>
      </VStack>

      {action}
    </VStack>
  );
}
