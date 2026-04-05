import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import PrivateRoute from "@/routes/PrivateRoute";
import AppLayout from "@/components/layout/AppLayout";

// Auth
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

// Cliente
import CustomerDashboardPage from "@/pages/customer/DashboardPage";
import CustomerOrdersPage from "@/pages/customer/OrdersPage";
import CustomerNewOrderPage from "@/pages/customer/NewOrderPage";
import CustomerCatalogPage from "@/pages/customer/CustomerCatalogPage";
import CustomerProfilePage from "@/pages/customer/ProfilePage";

// Empleado
import EmployeeDashboardPage from "@/pages/employee/EmployeeDashboardPage";
import EmployeeOrdersPage from "@/pages/employee/EmployeeOrdersPage";
import EmployeeNewOrderPage from "@/pages/employee/EmployeeNewOrderPage";
import EmployeeCatalogPage from "@/pages/employee/EmployeeCatalogPage";
import EmployeeClientsPage from "@/pages/employee/EmployeeClientsPage";

// Admin
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminProductsPage from "@/pages/admin/AdminProductsPage";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Cliente */}
          <Route
            path="/cliente"
            element={
              <PrivateRoute allowedRoles={["cliente"]}>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<CustomerDashboardPage />} />
            <Route path="pedidos" element={<CustomerOrdersPage />} />
            <Route path="nuevo" element={<CustomerNewOrderPage />} />
            <Route path="catalogo" element={<CustomerCatalogPage />} />
            <Route path="perfil" element={<CustomerProfilePage />} />
          </Route>

          {/* Empleado */}
          <Route
            path="/empleado"
            element={
              <PrivateRoute allowedRoles={["empleado"]}>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<EmployeeDashboardPage />} />
            <Route path="pedidos" element={<EmployeeOrdersPage />} />
            <Route path="nuevo-pedido" element={<EmployeeNewOrderPage />} />
            <Route path="catalogo" element={<EmployeeCatalogPage />} />
            <Route path="clientes" element={<EmployeeClientsPage />} />
          </Route>

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="pedidos" element={<AdminOrdersPage />} />
            <Route path="productos" element={<AdminProductsPage />} />
            <Route path="categorias" element={<AdminCategoriesPage />} />
            <Route path="usuarios" element={<AdminUsersPage />} />
          </Route>

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
