import {
  Box,
  Drawer,
  Flex,
  Icon,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuClipboardList,
  LuShoppingCart,
  LuUser,
  LuPackage,
  LuUsers,
  LuTag,
} from "react-icons/lu";
import { useAuth } from "@/context/AuthContext";

const NAV_BY_ROLE = {
  cliente: [
    { label: "Dashboard", to: "/cliente", icon: LuLayoutDashboard },
    { label: "Mis pedidos", to: "/cliente/pedidos", icon: LuClipboardList },
    { label: "Nuevo pedido", to: "/cliente/nuevo", icon: LuShoppingCart },
    { label: "Catálogo", to: "/cliente/catalogo", icon: LuPackage },
    { label: "Mi perfil", to: "/cliente/perfil", icon: LuUser },
  ],
  empleado: [
    { label: "Dashboard", to: "/empleado", icon: LuLayoutDashboard },
    { label: "Pedidos", to: "/empleado/pedidos", icon: LuClipboardList },
    {
      label: "Nuevo pedido",
      to: "/empleado/nuevo-pedido",
      icon: LuShoppingCart,
    },
    { label: "Catálogo", to: "/empleado/catalogo", icon: LuPackage },
    { label: "Clientes", to: "/empleado/clientes", icon: LuUsers },
  ],
  admin: [
    { label: "Dashboard", to: "/admin", icon: LuLayoutDashboard },
    { label: "Pedidos", to: "/admin/pedidos", icon: LuClipboardList },
    { label: "Productos", to: "/admin/productos", icon: LuPackage },
    { label: "Categorías", to: "/admin/categorias", icon: LuTag },
    { label: "Usuarios", to: "/admin/usuarios", icon: LuUsers },
  ],
};

function NavItem({ item }) {
  const location = useLocation();
  const roots = ["/cliente", "/empleado", "/admin"];
  const isActive = roots.includes(item.to)
    ? location.pathname === item.to
    : location.pathname.startsWith(item.to);

  return (
    <NavLink to={item.to} style={{ width: "100%", textDecoration: "none" }}>
      <Flex
        align="center"
        gap={3}
        px={3}
        py={2.5}
        borderRadius="md"
        fontWeight={isActive ? 600 : 400}
        fontSize="sm"
        bg={isActive ? "sidebar.active.bg" : "transparent"}
        color={isActive ? "sidebar.active.text" : "text.secondary"}
        _hover={{
          bg: isActive ? "sidebar.active.bg" : "sidebar.hover.bg",
          color: isActive ? "sidebar.active.text" : "text.primary",
        }}
        transition="all 0.15s"
        cursor="pointer"
      >
        <Icon as={item.icon} boxSize={4} flexShrink={0} />
        <Text>{item.label}</Text>
      </Flex>
    </NavLink>
  );
}

function SidebarContent() {
  const { user } = useAuth();
  const navItems = NAV_BY_ROLE[user?.role] ?? [];
  const roleLabel = {
    cliente: "Cliente",
    empleado: "Empleado",
    admin: "Administrador",
  };

  return (
    <Flex direction="column" h="full" py={6} px={3}>
      <Flex align="center" gap={2} px={2} mb={8}>
        <Box
          w={8}
          h={8}
          borderRadius="md"
          bg="brand.solid"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <Text fontSize="sm" color="white">
            🥩
          </Text>
        </Box>
        <Box>
          <Text
            fontFamily="heading"
            fontWeight={700}
            fontSize="sm"
            color="text.primary"
            lineHeight="shorter"
          >
            CarniOrder
          </Text>
          <Text fontSize="xs" color="text.muted">
            {roleLabel[user?.role] ?? ""}
          </Text>
        </Box>
      </Flex>

      <VStack gap={1} align="stretch" flex={1}>
        {navItems.map((item) => (
          <NavItem key={item.to} item={item} />
        ))}
      </VStack>
    </Flex>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const SIDEBAR_W = "220px";

  return (
    <>
      {/* Desktop */}
      <Box
        as="aside"
        display={{ base: "none", md: "flex" }}
        flexDirection="column"
        w={SIDEBAR_W}
        minH="100vh"
        bg="sidebar.bg"
        borderRight="1px solid"
        borderColor="sidebar.border"
        flexShrink={0}
        position="sticky"
        top={0}
        h="100vh"
        overflowY="auto"
      >
        <SidebarContent />
      </Box>

      {/* Mobile Drawer */}
      <Drawer.Root
        open={isOpen}
        onOpenChange={(e) => !e.open && onClose()}
        placement="start"
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content w={SIDEBAR_W} maxW={SIDEBAR_W} bg="sidebar.bg">
              <Drawer.Body p={0}>
                <SidebarContent />
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
}
