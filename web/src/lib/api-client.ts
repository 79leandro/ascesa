// API Client with friendly error handling
import { getApiUrl } from './config';

const API_URL = getApiUrl();

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

/**
 * Error response from API
 */
export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: string[];
  timestamp: string;
  path: string;
}

/**
 * Custom error class for API errors
 */
class ApiException extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public errors?: string[]
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

/**
 * Friendly error messages mapped from API codes
 */
const FRIENDLY_MESSAGES: Record<string, string> = {
  // Authentication
  'Credenciais inválidas': 'Email ou senha incorretos. Verifique seus dados e tente novamente.',
  'Email ou senha incorretos': 'Email ou senha incorretos. Verifique seus dados e tente novamente.',
  'Conta pendente de aprovação': 'Sua conta está em análise. Aguarde a aprovação do administrador.',
  'Conta inativa': 'Sua conta está inativa. Entre em contato com o administrador.',
  'Conta suspensa': 'Sua conta está suspensa. Entre em contato com o administrador.',
  'não autorizado': 'Você precisa estar logado para acessar esta funcionalidade.',
  'forbidden': 'Você não tem permissão para realizar esta ação.',

  // Validation
  'Este campo é obrigatório': 'Por favor, preencha todos os campos obrigatórios.',
  'email inválido': 'Por favor, insira um email válido.',
  'CPF válido': 'Por favor, insira um CPF válido.',

  // Generic
  'Erro interno do servidor': 'Algo deu errado. Tente novamente em alguns minutos.',
  'Não encontrado': 'Registro não encontrado. Atualize a página e tente novamente.',
  'already exists': 'Este registro já existe.',
};

/**
 * Makes an API error message more friendly
 */
function makeFriendly(message: string): string {
  // Check exact matches first
  if (FRIENDLY_MESSAGES[message]) {
    return FRIENDLY_MESSAGES[message];
  }

  // Check partial matches
  for (const [key, friendly] of Object.entries(FRIENDLY_MESSAGES)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return friendly;
    }
  }

  // Return original if no match
  return message;
}

/**
 * Centralized API client with error handling
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get auth token from localStorage
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  /**
   * Build fetch options with auth
   */
  private getOptions(method: string, body?: any): RequestInit {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };
  }

  /**
   * Handle response and parse errors
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = makeFriendly(data.message || 'Erro na requisição');
      throw new ApiException(
        errorMessage,
        response.status,
        data.errors
      );
    }

    return data;
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      ...this.getOptions('GET'),
    });
    const data = await this.handleResponse<T>(response);
    return (data as any).data || (data as T);
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      ...this.getOptions('POST', body),
    });
    const data = await this.handleResponse<T>(response);
    return (data as any).data || (data as T);
  }

  /**
   * PATCH request
   */
  async patch<T = any>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      ...this.getOptions('PATCH', body),
    });
    const data = await this.handleResponse<T>(response);
    return (data as any).data || (data as T);
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      ...this.getOptions('PUT', body),
    });
    const data = await this.handleResponse<T>(response);
    return (data as any).data || (data as T);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      ...this.getOptions('DELETE'),
    });
    const data = await this.handleResponse<T>(response);
    return (data as any).data || (data as T);
  }
}

// Create singleton instance
export const api = new ApiClient(API_URL);

// Export ApiException for use in components
export { ApiException };
