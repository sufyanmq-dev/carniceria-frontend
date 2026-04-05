import { Box, Flex, Heading, Text } from "@chakra-ui/react";

/**
 * Header reutilizable de página.
 * Muestra título, subtítulo opcional y acción a la derecha.
 */
export default function PageHeader({ title, subtitle, action }) {
  return (
    <Flex
      justify="space-between"
      align={{ base: "flex-start", sm: "center" }}
      direction={{ base: "column", sm: "row" }}
      gap={3}
      mb={6}
    >
      <Box>
        <Heading
          as="h1"
          fontSize={{ base: "xl", md: "2xl" }}
          fontFamily="heading"
          fontWeight={700}
          color="text.primary"
          lineHeight="shorter"
        >
          {title}
        </Heading>

        {/* subtítulo opcional */}
        {subtitle && (
          <Text mt={1} fontSize="sm" color="text.secondary">
            {subtitle}
          </Text>
        )}
      </Box>

      {/* acción (botón, etc.) */}
      {action && <Box flexShrink={0}>{action}</Box>}
    </Flex>
  );
}
