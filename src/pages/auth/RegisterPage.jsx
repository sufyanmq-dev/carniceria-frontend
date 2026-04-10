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
import { LuCircleAlert, LuCircleCheck } from "react-icons/lu";
import { authService } from "@/services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Actualiza inputs y limpia error
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  // Validación básica del formulario
  const validate = () => {
    if (!form.username || !form.email || !form.password) {
      return "Nombre, email y contraseña son obligatorios.";
    }
    if (form.password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }
    if (form.password !== form.confirm) {
      return "Las contraseñas no coinciden.";
    }
    return null;
  };

  // Enviar registro
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        username: form.username,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        address: form.address || undefined,
      });

      setSuccess(true);

      // Redirige al login tras crear cuenta
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Error al registrarse. Inténtalo de nuevo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="bg.app"
      px={4}
      py={8}
    >
      <Box w="full" maxW="440px">
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
            Crear cuenta
          </Heading>
          <Text fontSize="sm" color="text.secondary">
            Regístrate como cliente en CarniOrder
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
          {success ? (
            // Mensaje de éxito
            <VStack gap={3} py={4} textAlign="center">
              <Icon as={LuCircleCheck} boxSize={10} color="green.500" />
              <Text fontWeight={600} color="text.primary">
                ¡Cuenta creada!
              </Text>
              <Text fontSize="sm" color="text.secondary">
                Redirigiendo al login…
              </Text>
            </VStack>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <VStack gap={4}>
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

                {/* Nombre */}
                <Field.Root w="full">
                  <Field.Label
                    fontSize="sm"
                    fontWeight={500}
                    color="text.primary"
                  >
                    Nombre de usuario{" "}
                    <Box as="span" color="red.500">
                      *
                    </Box>
                  </Field.Label>
                  <Input
                    name="username"
                    placeholder="tunombre"
                    value={form.username}
                    onChange={handleChange}
                    autoComplete="username"
                  />
                </Field.Root>

                {/* Email */}
                <Field.Root w="full">
                  <Field.Label
                    fontSize="sm"
                    fontWeight={500}
                    color="text.primary"
                  >
                    Email{" "}
                    <Box as="span" color="red.500">
                      *
                    </Box>
                  </Field.Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </Field.Root>

                {/* Contraseña */}
                <Field.Root w="full">
                  <Field.Label
                    fontSize="sm"
                    fontWeight={500}
                    color="text.primary"
                  >
                    Contraseña{" "}
                    <Box as="span" color="red.500">
                      *
                    </Box>
                  </Field.Label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </Field.Root>

                {/* Confirmar contraseña */}
                <Field.Root w="full">
                  <Field.Label
                    fontSize="sm"
                    fontWeight={500}
                    color="text.primary"
                  >
                    Confirmar contraseña{" "}
                    <Box as="span" color="red.500">
                      *
                    </Box>
                  </Field.Label>
                  <Input
                    name="confirm"
                    type="password"
                    placeholder="Repite la contraseña"
                    value={form.confirm}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </Field.Root>

                {/* Teléfono */}
                <Field.Root w="full">
                  <Field.Label
                    fontSize="sm"
                    fontWeight={500}
                    color="text.primary"
                  >
                    Teléfono{" "}
                    <Box
                      as="span"
                      fontSize="xs"
                      color="text.muted"
                      fontWeight={400}
                    >
                      (opcional)
                    </Box>
                  </Field.Label>
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="612 345 678"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                </Field.Root>

                {/* Dirección */}
                <Field.Root w="full">
                  <Field.Label
                    fontSize="sm"
                    fontWeight={500}
                    color="text.primary"
                  >
                    Dirección{" "}
                    <Box
                      as="span"
                      fontSize="xs"
                      color="text.muted"
                      fontWeight={400}
                    >
                      (opcional)
                    </Box>
                  </Field.Label>
                  <Input
                    name="address"
                    placeholder="Calle Mayor 12, Madrid"
                    value={form.address}
                    onChange={handleChange}
                    autoComplete="street-address"
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
                  loading={loading}
                  loadingText="Creando cuenta…"
                  size="md"
                  fontWeight={600}
                  mt={1}
                >
                  Crear cuenta
                </Button>
              </VStack>
            </form>
          )}
        </Box>

        {/* Login */}
        <Text mt={5} textAlign="center" fontSize="sm" color="text.secondary">
          ¿Ya tienes cuenta?{" "}
          <Link as={RouterLink} to="/login" color="brand.text" fontWeight={600}>
            Inicia sesión
          </Link>
        </Text>
      </Box>
    </Flex>
  );
}
