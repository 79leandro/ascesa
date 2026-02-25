// Tipos TypeScript para o frontend

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  cpf?: string;
  phone?: string;
  avatar?: string;
}

export type UserRole = 'ADMIN' | 'DIRECTOR' | 'ASSOCIATED';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone?: string;
  birthDate?: string;
  profession?: string;
  address?: string;
  city?: string;
  state?: string;
}

export interface Document {
  id: string;
  type: DocumentType;
  filename: string;
  path: string;
  status: DocumentStatus;
  verifiedAt?: string;
  createdAt: string;
}

export type DocumentType = 'CPF' | 'RG' | 'COMPROVANTE_RESIDENCIA' | 'FOTO' | 'OUTRO';
export type DocumentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Benefit {
  id: string;
  name: string;
  slug: string;
  description?: string;
  terms?: string;
  category: string;
  partnerName?: string;
  partnerLogo?: string;
  discount?: string;
  image?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  error?: string;
  statusCode: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
