import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";

/** Banner simple de cookies (solo sesión, sin tracking) */
export default function CookieBanner() {
  const [accepted, setAccepted] = useState(
    () => localStorage.getItem("cookies_accepted") === "true",
  );

  if (accepted) return null;

  const accept = () => {
    localStorage.setItem("cookies_accepted", "true");
    setAccepted(true);
  };

  return (
    <Box
      position="fixed"
      bottom={4}
      left={4}
      right={4}
      maxW="560px"
      mx="auto"
      bg="bg.surface"
      border="1px solid"
      borderColor="border.strong"
      borderRadius="xl"
      p={4}
      zIndex="toast"
      boxShadow="0 4px 24px rgba(0,0,0,0.12)"
    >
      <Text fontSize="sm" color="text.primary" fontWeight={600} mb={1}>
        🍪 Uso de cookies
      </Text>

      <Text fontSize="xs" color="text.secondary" mb={3}>
        Usamos cookies necesarias para mantener la sesión. No hay tracking ni
        publicidad.
      </Text>

      <Flex justify="flex-end">
        <Button
          size="xs"
          bg="brand.solid"
          color="white"
          _hover={{ bg: "brand.600" }}
          fontWeight={600}
          onClick={accept}
        >
          Entendido
        </Button>
      </Flex>
    </Box>
  );
}
