// Configuração centralizada de endpoints da API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ascesa.onrender.com';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
    forgotPassword: `${API_URL}/auth/forgot-password`,
    resetPassword: `${API_URL}/auth/reset-password`,
  },
  documents: {
    upload: `${API_URL}/documents/upload`,
    list: (userId: string) => `${API_URL}/documents/user/${userId}`,
  },
  users: {
    profile: (userId: string) => `${API_URL}/users/${userId}`,
    update: (userId: string) => `${API_URL}/users/${userId}`,
  },
  benefits: {
    list: `${API_URL}/benefits`,
    get: (id: string) => `${API_URL}/benefits/${id}`,
    create: `${API_URL}/benefits`,
    update: (id: string) => `${API_URL}/benefits/${id}`,
    delete: (id: string) => `${API_URL}/benefits/${id}`,
    toggleStatus: (id: string) => `${API_URL}/benefits/${id}/toggle-status`,
    toggleFeatured: (id: string) => `${API_URL}/benefits/${id}/featured`,
    favorite: (benefitId: string) => `${API_URL}/benefits/${benefitId}/favorite`,
  },
  partners: {
    list: `${API_URL}/partners`,
    get: (id: string) => `${API_URL}/partners/${id}`,
    create: `${API_URL}/partners`,
    update: (id: string) => `${API_URL}/partners/${id}`,
    delete: (id: string) => `${API_URL}/partners/${id}`,
    toggleStatus: (id: string) => `${API_URL}/partners/${id}/toggle-status`,
    updateStatus: (id: string) => `${API_URL}/partners/${id}/status`,
  },
} as const;

export const APP_ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  dashboard: '/dashboard',
  profile: '/dashboard/profile',
  documents: '/dashboard/documents',
  benefits: '/benefits',
  admin: '/admin',
} as const;

export { API_URL };
