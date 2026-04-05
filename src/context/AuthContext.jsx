import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/authService";

const AuthContext = createContext(null);

// Provider de auth (maneja usuario y sesión)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // mientras comprueba sesión

  // Comprobar si hay sesión activa al cargar la app
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { user } = await authService.me();
        setUser(user);
      } catch {
        setUser(null); // no hay sesión (normal)
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  // Login → guarda usuario y devuelve su rol
  const login = async (credentials) => {
    const { user } = await authService.login(credentials);
    setUser(user);
    return user.role;
  };

  // Logout → limpia sesión y estado
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para usar el contexto de auth
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
