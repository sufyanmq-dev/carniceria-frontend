import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  Icon,
  Input,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { LuCircleAlert } from "react-icons/lu";
import { useAuth } from "@/context/AuthContext";

// Rol → ruta después del login
const ROLE_REDIRECT = {
  cliente: "/cliente",
  empleado: "/empleado",
  admin: "/admin",
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Actualiza inputs y limpia error
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Email y contraseña son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const role = await login({ email: form.email, password: form.password });
      navigate(ROLE_REDIRECT[role] ?? "/", { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Error al iniciar sesión. Inténtalo de nuevo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="bg.app" px={4}>
      <Box w="full" maxW="400px">
        {/* Logo */}
        <VStack mb={8} gap={2} textAlign="center">
          <Box
            w={12}
            h={12}
            borderRadius="xl"
            bg="brand.solid"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="xl"
          >
            🥩
          </Box>
          <Heading
            fontFamily="heading"
            fontSize="2xl"
            fontWeight={800}
            color="text.primary"
          >
            CarniOrder
          </Heading>
          <Text fontSize="sm" color="text.secondary">
            Inicia sesión en tu cuenta
          </Text>
        </VStack>

        {/* Formulario */}
        <Box
          bg="bg.surface"
          border="1px solid"
          borderColor="border.default"
          borderRadius="xl"
          p={8}
        >
          <form onSubmit={handleSubmit} noValidate>
            <VStack gap={5}>
              {/* Error */}
              {error && (
                <Flex
                  gap={2}
                  align="center"
                  p={3}
                  bg="red.50"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="red.200"
                  w="full"
                  _dark={{ bg: "red.900", borderColor: "red.700" }}
                >
                  <Icon
                    as={LuCircleAlert}
                    boxSize={4}
                    color="red.500"
                    flexShrink={0}
                  />
                  <Text
                    fontSize="sm"
                    color="red.600"
                    _dark={{ color: "red.300" }}
                  >
                    {error}
                  </Text>
                </Flex>
              )}

              {/* Email */}
              <Field.Root w="full">
                <Field.Label
                  fontSize="sm"
                  fontWeight={500}
                  color="text.primary"
                >
                  Email
                </Field.Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  size="md"
                />
              </Field.Root>

              {/* Contraseña */}
              <Field.Root w="full">
                <Field.Label
                  fontSize="sm"
                  fontWeight={500}
                  color="text.primary"
                >
                  Contraseña
                </Field.Label>
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  size="md"
                />
              </Field.Root>

              {/* Submit */}
              <Button
                type="submit"
                w="full"
                bg="brand.solid"
                color="white"
                _hover={{ bg: "brand.600" }}
                _active={{ bg: "brand.700" }}
                isLoaded={!loading}
                loadingText="Iniciando sesión…"
                size="md"
                fontWeight={600}
              >
                Iniciar sesión
              </Button>
            </VStack>
          </form>
        </Box>

        {/* Registro */}
        <Text mt={5} textAlign="center" fontSize="sm" color="text.secondary">
          ¿No tienes cuenta?{" "}
          <Link
            as={RouterLink}
            to="/register"
            color="brand.text"
            fontWeight={600}
          >
            Regístrate aquí
          </Link>
        </Text>
      </Box>
    </Flex>
  );
}
