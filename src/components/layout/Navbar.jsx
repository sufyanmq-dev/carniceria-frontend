import {
  Avatar,
  Box,
  Flex,
  Icon,
  IconButton,
  Menu,
  Portal,
  Text,
} from "@chakra-ui/react";
import { LuMenu, LuMoon, LuSun, LuLogOut, LuUser } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";

const NAVBAR_H = "60px";

/**
 * Barra de navegación superior.
 * @param {{ onMenuClick: func }} props
 */
export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "??";

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      px={{ base: 4, md: 6 }}
      h={NAVBAR_H}
      minH={NAVBAR_H}
      bg="bg.surface"
      borderBottom="1px solid"
      borderColor="border.default"
      position="sticky"
      top={0}
      zIndex="sticky"
    >
      {/* Izquierda: hamburguesa (móvil) + breadcrumb */}
      <Flex align="center" gap={3}>
        <IconButton
          aria-label="Abrir menú"
          variant="ghost"
          size="sm"
          display={{ base: "flex", md: "none" }}
          onClick={onMenuClick}
        >
          <Icon as={LuMenu} boxSize={5} />
        </IconButton>

        <Flex align="center" gap={2} display={{ base: "flex", md: "none" }}>
          <Box
            w={7}
            h={7}
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
            CarniOrder
          </Text>
        </Flex>
      </Flex>

      {/* Derecha: dark mode + avatar menu */}
      <Flex align="center" gap={2}>
        {/* Toggle dark/light */}
        <IconButton
          aria-label="Cambiar tema"
          variant="ghost"
          size="sm"
          onClick={toggleColorMode}
        >
          <Icon as={colorMode === "dark" ? LuSun : LuMoon} boxSize={4} />
        </IconButton>

        {/* Avatar con menú desplegable */}
        <Menu.Root>
          <Menu.Trigger asChild>
            <Avatar.Root
              size="sm"
              bg="brand.solid"
              color="white"
              cursor="pointer"
              _hover={{ opacity: 0.85 }}
              transition="opacity 0.15s"
            >
              <Avatar.Fallback fontWeight={700} fontSize="xs">
                {initials}
              </Avatar.Fallback>
            </Avatar.Root>
          </Menu.Trigger>

          <Portal>
            <Menu.Positioner>
              <Menu.Content minW="180px">
                <Box
                  px={3}
                  py={2}
                  borderBottom="1px solid"
                  borderColor="border.default"
                >
                  <Text
                    fontWeight={600}
                    fontSize="sm"
                    color="text.primary"
                    truncate
                  >
                    {user?.username}
                  </Text>
                  <Text fontSize="xs" color="text.muted" truncate>
                    {user?.email}
                  </Text>
                </Box>

                <Menu.Item
                  value="perfil"
                  onClick={() => navigate(`/${user?.role}/perfil`)}
                  cursor="pointer"
                >
                  <Icon as={LuUser} boxSize={4} />
                  Mi perfil
                </Menu.Item>

                <Menu.Item
                  value="logout"
                  onClick={handleLogout}
                  color="red.500"
                  cursor="pointer"
                >
                  <Icon as={LuLogOut} boxSize={4} />
                  Cerrar sesión
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>
    </Flex>
  );
}
