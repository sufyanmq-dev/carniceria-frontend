# CarniOrder — Frontend

Interfaz web de la aplicación de gestión de pedidos para carnicerías. Desarrollada con React y Chakra UI, con soporte para tres roles de usuario y modo oscuro/claro.

---

## Stack

- React + Vite
- Chakra UI v3
- React Router
- Axios
- Framer Motion

---

## Estructura

```bash
src/
├── api/          # Instancia Axios y definición de endpoints
├── components/   # Componentes de layout y UI reutilizables
├── context/      # Contexto global de autenticación
├── hooks/        # Hooks personalizados por entidad
├── pages/        # Vistas organizadas por rol
│   ├── auth/
│   ├── customer/
│   ├── employee/
│   └── admin/
├── routes/       # Componente de ruta protegida por rol
├── services/     # Funciones de llamada a la API por entidad
├── theme/        # Sistema de diseño Chakra UI personalizado
└── utils/        # Formateadores y mensajes de error
```

---

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Backend de CarniOrder en marcha

---

## Instalación

```bash
git clone https://github.com/sufyanmq-dev/carniceria-frontend.git
cd carniceria-frontend
npm install
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:5001/api
```

| Variable       | Descripción                    |
| -------------- | ------------------------------ |
| `VITE_API_URL` | URL base de la API del backend |

---

## Arrancar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## Build de producción

```bash
npm run build
```

Los archivos estáticos se generan en la carpeta `dist/`.

---

## Roles y rutas

| Rol           | Ruta base   | Acceso                       |
| ------------- | ----------- | ---------------------------- |
| Cliente       | `/cliente`  | Catálogo, pedidos, perfil    |
| Empleado      | `/empleado` | Gestión de pedidos, clientes |
| Administrador | `/admin`    | Gestión completa             |

Las rutas están protegidas por el componente `PrivateRoute`, que verifica la sesión activa y el rol del usuario antes de renderizar cada página. Si no hay sesión, redirige al login. Si el rol no coincide, redirige al panel propio del usuario.

---

## Autor

Sufyan Mohammad Qandeel  
DAW — ThePower Business School — 2025/2026
