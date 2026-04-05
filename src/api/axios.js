// Instancia Axios para el backend (auth + manejo de errores)

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5001/api",
  withCredentials: true, // enviar cookies (JWT httpOnly)
  headers: {
    "Content-Type": "application/json",
  },
});

// Manejo de respuestas / errores
api.interceptors.response.use(
  (response) => response, // dejar pasar respuestas OK

  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;

    if (status === 401) {
      const isCredentialError = code === "invalidCredentials"; // credenciales incorrectas
      const isOnLoginPage = window.location.pathname.startsWith("/login");

      // redirigir si el token no es válido o ha expirado
      if (!isCredentialError && !isOnLoginPage) {
        window.location.href = "/login";
      }
    }

    // devolver error para manejarlo en el componente
    return Promise.reject(error);
  },
);

export default api;
