export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    register: "/auth/register",
    me: "/auth/me",
  },
  products: {
    getAll: "/products",
    getById: (id) => `/products/${id}`,
    create: "/products",
    update: (id) => `/products/${id}`,
    remove: (id) => `/products/${id}`,
  },
  categories: {
    getAll: "/categories",
    create: "/categories",
    update: (id) => `/categories/${id}`,
    remove: (id) => `/categories/${id}`,
  },
  orders: {
    getAll: "/orders",
    getById: (id) => `/orders/${id}`,
    create: "/orders",
    updateStatus: (id) => `/orders/${id}/status`,
    cancel: (id) => `/orders/${id}/cancel`,
  },
  users: {
    getAll: "/users",
    updateRole: (id) => `/users/${id}/role`,
    remove: (id) => `/users/${id}`,
    updateMe: "/users/me",
  },
  roles: {
    getAll: "/roles",
  },
};
