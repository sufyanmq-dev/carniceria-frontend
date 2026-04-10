import { Button, Dialog, Flex, Icon, Portal, Text } from "@chakra-ui/react";
import { LuTriangleAlert } from "react-icons/lu";

/**
 * Diálogo de confirmación para acciones destructivas (eliminar, cambiar rol…).
 *
 * @param {object}   props
 * @param {boolean}  props.open        - Controla visibilidad
 * @param {function} props.onClose     - Cierra sin confirmar
 * @param {function} props.onConfirm   - Ejecuta la acción
 * @param {string}   [props.title]     - Título del diálogo
 * @param {string}   [props.message]   - Mensaje descriptivo
 * @param {string}   [props.confirmLabel] - Texto del botón de confirmación
 * @param {boolean}  [props.loading]   - Estado de carga del botón
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "¿Estás seguro?",
  message = "Esta acción no se puede deshacer.",
  confirmLabel = "Eliminar",
  loading = false,
}) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => !e.open && onClose()}
      size="sm"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Flex align="center" gap={3}>
                <Flex
                  align="center"
                  justify="center"
                  w={9}
                  h={9}
                  borderRadius="full"
                  bg="red.50"
                  _dark={{ bg: "red.900" }}
                  flexShrink={0}
                >
                  <Icon as={LuTriangleAlert} boxSize={4} color="red.500" />
                </Flex>
                <Dialog.Title
                  fontSize="md"
                  fontWeight={700}
                  color="text.primary"
                >
                  {title}
                </Dialog.Title>
              </Flex>
            </Dialog.Header>

            <Dialog.Body>
              <Text fontSize="sm" color="text.secondary">
                {message}
              </Text>
            </Dialog.Body>

            <Dialog.Footer>
              <Flex gap={3} justify="flex-end">
                <Button
                  variant="outline"
                  borderColor="border.default"
                  color="text.secondary"
                  size="sm"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  bg="red.500"
                  color="white"
                  _hover={{ bg: "red.600" }}
                  loading={loading}
                  loadingText="Eliminando…"
                  onClick={onConfirm}
                >
                  {confirmLabel}
                </Button>
              </Flex>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
