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
  beneficios: {
    list: `${API_URL}/beneficios`,
    get: (id: string) => `${API_URL}/beneficios/${id}`,
    create: `${API_URL}/beneficios`,
    update: (id: string) => `${API_URL}/beneficios/${id}`,
    delete: (id: string) => `${API_URL}/beneficios/${id}`,
    toggleStatus: (id: string) => `${API_URL}/beneficios/${id}/toggle-status`,
    toggleFeatured: (id: string) => `${API_URL}/beneficios/${id}/featured`,
    favorite: (beneficioId: string) => `${API_URL}/beneficios/${beneficioId}/favorite`,
  },
  parceiros: {
    list: `${API_URL}/parceiros`,
    get: (id: string) => `${API_URL}/parceiros/${id}`,
    create: `${API_URL}/parceiros`,
    update: (id: string) => `${API_URL}/parceiros/${id}`,
    delete: (id: string) => `${API_URL}/parceiros/${id}`,
    toggleStatus: (id: string) => `${API_URL}/parceiros/${id}/toggle-status`,
    updateStatus: (id: string) => `${API_URL}/parceiros/${id}/status`,
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
