import { Box, Flex, Icon, Text } from "@chakra-ui/react";

/**
 * Card de estadística para dashboard.
 * Muestra label, valor, texto extra e icono opcional.
 */
export default function StatCard({
  label,
  value,
  subtext,
  icon,
  iconColor = "brand.solid",
}) {
  return (
    <Box
      bg="bg.surface"
      border="1px solid"
      borderColor="border.default"
      borderRadius="lg"
      p={5}
      flex="1"
      minW="0"
    >
      <Flex justify="space-between" align="flex-start">
        <Box>
          <Text
            fontSize="xs"
            fontWeight={600}
            color="text.secondary"
            textTransform="uppercase"
            letterSpacing="wider"
            mb={1}
          >
            {label}
          </Text>

          <Text
            fontSize="2xl"
            fontWeight={700}
            color="text.primary"
            lineHeight="shorter"
          >
            {value}
          </Text>

          {/* texto secundario */}
          {subtext && (
            <Text fontSize="xs" color="text.muted" mt={1}>
              {subtext}
            </Text>
          )}
        </Box>

        {/* icono opcional */}
        {icon && (
          <Flex
            align="center"
            justify="center"
            w={10}
            h={10}
            borderRadius="md"
            bg="brand.subtle"
            flexShrink={0}
          >
            <Icon as={icon} boxSize={5} color={iconColor} />
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
