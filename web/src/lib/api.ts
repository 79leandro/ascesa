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
  showcase: {
    list: `${API_URL}/showcase`,
    get: (id: string) => `${API_URL}/showcase/${id}`,
    create: `${API_URL}/showcase`,
    update: (id: string) => `${API_URL}/showcase/${id}`,
    delete: (id: string) => `${API_URL}/showcase/${id}`,
    myProducts: `${API_URL}/showcase/meus-produtos`,
    categories: `${API_URL}/showcase/categorias/list`,
  },
  forum: {
    list: `${API_URL}/forum`,
    get: (id: string) => `${API_URL}/forum/${id}`,
    create: `${API_URL}/forum`,
    update: (id: string) => `${API_URL}/forum/${id}`,
    delete: (id: string) => `${API_URL}/forum/${id}`,
    createReply: (id: string) => `${API_URL}/forum/${id}/respostas`,
    deleteReply: (id: string) => `${API_URL}/forum/respostas/${id}`,
    categories: `${API_URL}/forum/categorias/list`,
  },
  events: {
    list: `${API_URL}/events`,
    get: (id: string) => `${API_URL}/events/${id}`,
    create: `${API_URL}/events`,
    update: (id: string) => `${API_URL}/events/${id}`,
    delete: (id: string) => `${API_URL}/events/${id}`,
    register: (id: string) => `${API_URL}/events/${id}/inscrever`,
    cancel: (id: string) => `${API_URL}/events/${id}/cancelar`,
    myRegistrations: `${API_URL}/events/meus-inscricoes`,
    categories: `${API_URL}/events/categorias/list`,
  },
  assemblies: {
    list: `${API_URL}/assemblies`,
    get: (id: string) => `${API_URL}/assemblies/${id}`,
    create: `${API_URL}/assemblies`,
    update: (id: string) => `${API_URL}/assemblies/${id}`,
    delete: (id: string) => `${API_URL}/assemblies/${id}`,
    startVoting: (id: string) => `${API_URL}/assemblies/${id}/iniciar`,
    endVoting: (id: string) => `${API_URL}/assemblies/${id}/encerrar`,
    addCandidate: (id: string) => `${API_URL}/assemblies/${id}/candidatos`,
    removeCandidate: (id: string) => `${API_URL}/assemblies/candidatos/${id}`,
    vote: (id: string) => `${API_URL}/assemblies/${id}/votar`,
    myVote: (id: string) => `${API_URL}/assemblies/${id}/meu-voto`,
    active: `${API_URL}/assemblies/ativas`,
  },
  associates: {
    list: `${API_URL}/associates`,
    get: (id: string) => `${API_URL}/associates/${id}`,
    stats: `${API_URL}/associates/stats`,
    approve: (id: string) => `${API_URL}/associates/${id}/approve`,
    reject: (id: string) => `${API_URL}/associates/${id}/reject`,
    updateStatus: (id: string) => `${API_URL}/associates/${id}/status`,
    updateNotes: (id: string) => `${API_URL}/associates/${id}/notes`,
    sendReminder: (id: string) => `${API_URL}/associates/${id}/send-reminder`,
  },
  payments: {
    list: `${API_URL}/payments`,
    get: (id: string) => `${API_URL}/payments/${id}`,
    stats: `${API_URL}/payments/stats`,
    myPayments: `${API_URL}/payments/my-payments`,
    markPaid: (id: string) => `${API_URL}/payments/${id}/mark-paid`,
    generateMonthly: `${API_URL}/payments/generate-monthly`,
    sendReminder: (id: string) => `${API_URL}/payments/${id}/send-reminder`,
    updateOverdue: `${API_URL}/payments/update-overdue`,
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

// Helper functions for API calls
export const api = {
  get: async (endpoint: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await fetch(endpoint, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    return response.json();
  },
  post: async (endpoint: string, data?: any) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  },
  patch: async (endpoint: string, data?: any) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  },
  delete: async (endpoint: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    return response.json();
  },
};
