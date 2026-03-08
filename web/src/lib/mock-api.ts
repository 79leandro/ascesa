// Mock API interceptor
// Returns mock data when the real API is not available

import { mockBenefits, mockPartners, mockAssociates, mockPayments, mockEvents, mockDocuments, mockBlogPosts, mockForumPosts, mockShowcase, mockAssemblies, mockReports, mockUsers } from './mock-data';

// Flag to enable mock mode - set to true when API is unavailable
const MOCK_MODE = true;

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generic mock response wrapper
const mockResponse = async (data: any, success = true, message = '') => {
  await delay(300); // Simulate network latency
  return { success, data, message };
};

export const mockApi = {
  // Benefits
  beneficios: {
    list: async () => mockResponse({ beneficios: mockBenefits }),
    get: async (id: string) => mockResponse({ beneficio: mockBenefits.find(b => b.id === id) }),
    create: async (data: any) => mockResponse({ beneficio: { id: Date.now().toString(), ...data } }),
    update: async (id: string, data: any) => mockResponse({ beneficio: { id, ...data } }),
    delete: async () => mockResponse({ success: true }),
    toggleStatus: async (id: string) => mockResponse({ success: true }),
  },

  // Partners
  parceiros: {
    list: async () => mockResponse({ parceiros: mockPartners }),
    get: async (id: string) => mockResponse({ parceiro: mockPartners.find(p => p.id === id) }),
    create: async (data: any) => mockResponse({ parceiro: { id: Date.now().toString(), ...data } }),
    update: async (id: string, data: any) => mockResponse({ parceiro: { id, ...data } }),
    delete: async () => mockResponse({ success: true }),
    toggleStatus: async (id: string) => mockResponse({ success: true }),
  },

  // Associates
  associates: {
    list: async () => mockResponse({ associados: mockAssociates }),
    get: async (id: string) => mockResponse({ associado: mockAssociates.find(a => a.id === id) }),
    stats: async () => mockResponse({
      total: mockAssociates.length,
      ativos: mockAssociates.filter(a => a.status === 'ATIVO').length,
      inativos: mockAssociates.filter(a => a.status === 'INATIVO').length,
      pendentes: mockAssociates.filter(a => a.status === 'PENDENTE').length,
    }),
    approve: async (id: string) => mockResponse({ success: true }),
    reject: async (id: string) => mockResponse({ success: true }),
  },

  // Payments
  payments: {
    list: async () => mockResponse({ payments: mockPayments }),
    stats: async () => mockResponse({
      total: mockPayments.length,
      pagos: mockPayments.filter(p => p.status === 'PAGO').length,
      pendentes: mockPayments.filter(p => p.status === 'PENDENTE').length,
      atrasados: mockPayments.filter(p => p.status === 'ATRASADO').length,
      valorTotal: mockPayments.reduce((acc, p) => acc + p.valor, 0),
    }),
    markPaid: async (id: string) => mockResponse({ success: true }),
  },

  // Events
  events: {
    list: async () => mockResponse({ eventos: mockEvents }),
    get: async (id: string) => mockResponse({ evento: mockEvents.find(e => e.id === id) }),
    create: async (data: any) => mockResponse({ evento: { id: Date.now().toString(), ...data } }),
    update: async (id: string, data: any) => mockResponse({ evento: { id, ...data } }),
    delete: async () => mockResponse({ success: true }),
  },

  // Documents
  documents: {
    adminList: async () => mockResponse({ documentos: mockDocuments }),
    list: async () => mockResponse({ documentos: mockDocuments }),
  },

  // Blog
  blog: {
    list: async () => mockResponse({ posts: mockBlogPosts }),
    get: async (slug: string) => mockResponse({ post: mockBlogPosts.find(p => p.slug === slug) }),
    create: async (data: any) => mockResponse({ post: { id: Date.now().toString(), ...data } }),
    update: async (id: string, data: any) => mockResponse({ post: { id, ...data } }),
    delete: async () => mockResponse({ success: true }),
  },

  // Forum
  forum: {
    list: async () => mockResponse({ posts: mockForumPosts }),
    get: async (id: string) => mockResponse({ post: mockForumPosts.find(p => p.id === id) }),
    create: async (data: any) => mockResponse({ post: { id: Date.now().toString(), ...data } }),
    update: async (id: string, data: any) => mockResponse({ post: { id, ...data } }),
    delete: async () => mockResponse({ success: true }),
  },

  // Showcase
  showcase: {
    list: async () => mockResponse({ produtos: mockShowcase }),
    get: async (id: string) => mockResponse({ produto: mockShowcase.find(s => s.id === id) }),
    create: async (data: any) => mockResponse({ produto: { id: Date.now().toString(), ...data } }),
    update: async (id: string, data: any) => mockResponse({ produto: { id, ...data } }),
    delete: async () => mockResponse({ success: true }),
  },

  // Assemblies
  assemblies: {
    list: async () => mockResponse({ assembleias: mockAssemblies }),
    get: async (id: string) => mockResponse({ assembleia: mockAssemblies.find(a => a.id === id) }),
    create: async (data: any) => mockResponse({ assembleia: { id: Date.now().toString(), ...data } }),
    update: async (id: string, data: any) => mockResponse({ assembleia: { id, ...data } }),
    delete: async () => mockResponse({ success: true }),
  },

  // Reports
  reports: {
    dashboard: async () => mockResponse(mockReports),
  },

  // Auth (for testing)
  auth: {
    login: async (email: string, password: string) => {
      const user = mockUsers.find(u => u.email === email);
      if (user && password === 'test123') {
        return mockResponse({
          token: 'mock-jwt-token-' + Date.now(),
          user: { id: user.id, nome: user.nome, email: user.email, tipo: user.tipo },
        });
      }
      return mockResponse(null, false, 'Credenciais inválidas');
    },
  },
};

// Check if we should use mock mode
export const shouldUseMock = () => MOCK_MODE;
