import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import CookieBanner from "@/components/ui/CookieBanner";
import { useAuth } from "@/hooks/useAuth";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <Flex minH="100vh" bg="bg.app" direction="column">
      <Flex flex={1}>
        {/* Sidebar (desktop fijo, móvil como Drawer) */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Columna derecha: Navbar + contenido */}
        <Flex direction="column" flex={1} minW={0}>
          <Navbar onMenuClick={() => setSidebarOpen(true)} />

          <Box
            as="main"
            flex={1}
            px={{ base: 4, md: 8 }}
            py={{ base: 5, md: 8 }}
            maxW="1200px"
            w="full"
            mx="auto"
          >
            <Outlet />
          </Box>

          {/* Footer solo para clientes */}
          {user?.role === "cliente" && <Footer />}
        </Flex>
      </Flex>

      {/* Banner de cookies solo para clientes */}
      {user?.role === "cliente" && <CookieBanner />}
    </Flex>
  );
}
