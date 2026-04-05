import { Box, Flex, Icon, Link, Text } from "@chakra-ui/react";
import { LuMapPin, LuPhone, LuMail, LuClock } from "react-icons/lu";

const SHOP = {
  name: "Carnicería El Rincón",
  address: "Calle Gran Vía 45, 28013 Madrid",
  phone: "+34 91 123 45 67",
  email: "info@carniceriaelrincon.es",
  hours: "Lun–Sáb: 8:00–14:00 / 17:00–20:30",
  year: new Date().getFullYear(),
};

export default function Footer() {
  return (
    <Box
      as="footer"
      bg="bg.surface"
      borderTop="1px solid"
      borderColor="border.default"
      mt="auto"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        gap={6}
        px={{ base: 4, md: 8 }}
        py={6}
        maxW="1200px"
        mx="auto"
      >
        {/* Marca */}
        <Box>
          <Flex align="center" gap={2} mb={1}>
            <Box
              w={6}
              h={6}
              borderRadius="md"
              bg="brand.solid"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="xs" color="white">
                🥩
              </Text>
            </Box>
            <Text
              fontFamily="heading"
              fontWeight={700}
              fontSize="sm"
              color="text.primary"
            >
              {SHOP.name}
            </Text>
          </Flex>
          <Text fontSize="xs" color="text.muted">
            © {SHOP.year} Todos los derechos reservados
          </Text>
        </Box>

        {/* Contacto */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          gap={{ base: 3, sm: 6 }}
        >
          <Flex align="center" gap={2}>
            <Icon as={LuMapPin} boxSize={3.5} color="text.muted" />
            <Text fontSize="xs" color="text.secondary">
              {SHOP.address}
            </Text>
          </Flex>
          <Flex align="center" gap={2}>
            <Icon as={LuPhone} boxSize={3.5} color="text.muted" />
            <Link
              href={`tel:${SHOP.phone}`}
              fontSize="xs"
              color="text.secondary"
              _hover={{ color: "brand.text" }}
            >
              {SHOP.phone}
            </Link>
          </Flex>
          <Flex align="center" gap={2}>
            <Icon as={LuMail} boxSize={3.5} color="text.muted" />
            <Link
              href={`mailto:${SHOP.email}`}
              fontSize="xs"
              color="text.secondary"
              _hover={{ color: "brand.text" }}
            >
              {SHOP.email}
            </Link>
          </Flex>
          <Flex align="center" gap={2}>
            <Icon as={LuClock} boxSize={3.5} color="text.muted" />
            <Text fontSize="xs" color="text.secondary">
              {SHOP.hours}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {/* Barra inferior legal */}
      <Box
        borderTop="1px solid"
        borderColor="border.default"
        px={{ base: 4, md: 8 }}
        py={3}
      >
        <Flex
          justify="space-between"
          align="center"
          maxW="1200px"
          mx="auto"
          direction={{ base: "column", sm: "row" }}
          gap={2}
        >
          <Text fontSize="xs" color="text.muted">
            CarniOrder es un sistema de gestión de pedidos online. Proyecto
            académico DAW 2025–26.
          </Text>
          <Text fontSize="xs" color="text.muted">
            Al usar este servicio aceptas el uso de cookies necesarias para el
            funcionamiento de la sesión.
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}
