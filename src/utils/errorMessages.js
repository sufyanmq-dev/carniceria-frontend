// utils/errorMessages.js

// Códigos del backend → mensajes para la UI
const ERROR_MESSAGES = {
  // Auth
  infoNeeded: "Por favor completa todos los campos obligatorios.",
  invalidCredentials: "El email o la contraseña son incorrectos.",
  notAuthenticated: "Tu sesión ha expirado. Inicia sesión de nuevo.",
  invalidToken: "Tu sesión ha expirado. Inicia sesión de nuevo.",
  emailExists: "Este email ya está registrado. ¿Quieres iniciar sesión?",

  // Recursos
  userNotFound: "Usuario no encontrado.",
  orderNotFound: "Pedido no encontrado.",
  productNotFound: "Producto no encontrado.",
  categoryNotFound: "Categoría no encontrada.",
  roleNotFound: "Rol no encontrado.",

  // Permisos
  forbidden: "No tienes permisos para realizar esta acción.",

  // Validación
  validation: "Los datos enviados no son válidos.",
  invalidStatus: "Estado de pedido no válido.",
  invalidQuantity: "La cantidad debe ser mayor que cero.",
  invalidRole: "El rol especificado no existe.",
  emptyOrder: "El pedido debe tener al menos un producto.",
  categoryExists: "Ya existe una categoría con ese nombre.",

  // Servidor / red
  rateLimitExceeded: "Demasiados intentos. Espera unos minutos.",
  corsBlocked: "Error de conexión con el servidor.",
  apiError: "Ha ocurrido un error inesperado. Inténtalo de nuevo.",
  dbError: "Error de base de datos. Contacta al administrador.",
};

// Devuelve un mensaje legible a partir de un error de Axios
export const getErrorMessage = (error) => {
  const code = error?.response?.data?.code;
  const message = error?.response?.data?.message;

  // Prioriza mensaje del backend
  if (message) return message;

  // Fallback al mapa local
  if (code && ERROR_MESSAGES[code]) return ERROR_MESSAGES[code];

  // Sin respuesta → error de red
  if (!error?.response) {
    return "No se puede conectar al servidor. Comprueba tu conexión.";
  }

  return "Ha ocurrido un error inesperado.";
};
