import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Center, Spinner } from "@chakra-ui/react";

/**
 * Ruta protegida:
 * - Muestra spinner mientras carga sesión.
 * - Redirige a /login si no autenticado.
 * - Redirige al dashboard si rol no permitido.
 * - Renderiza children si todo OK.
 */
export default function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" borderWidth="3px" />
      </Center>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const rolePaths = {
      cliente: "/cliente",
      empleado: "/empleado",
      admin: "/admin",
    };
    return <Navigate to={rolePaths[user.role] ?? "/login"} replace />;
  }

  return children;
}
