/**
 * Authentication API Service
 * Endpoints: /api/auth/*
 */

import { apiClient, ApiResponse } from './client';

export interface LoginRequest {
  identifier: string; // email atau username
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    full_name: string;
    role: 'admin' | 'superadmin' | 'mahasiswa';
    is_active: number;
    profile_picture?: string;
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
  nomor_telepon: string;
  jurusan_id: number;
  prodi_id: number;
  npm?: string;
}

export interface Jurusan {
  id: number;
  nama_jurusan: string;
}

export interface Prodi {
  id: number;
  nama_prodi: string;
  jurusan_id: number;
}

/**
 * Login dengan email atau username
 */
export async function login(identifier: string, password: string): Promise<ApiResponse<LoginResponse>> {
  // Auto-detect: jika ada @ → email, selain itu → username
  const isEmail = identifier.includes('@');
  const loginData = isEmail
    ? { email: identifier, password }
    : { username: identifier, password };

  console.log('🔐 Login attempt:', isEmail ? 'EMAIL' : 'USERNAME');

  const response = await apiClient.post<any>('/api/auth/login', loginData, false) as any;

  console.log('Raw response from backend:', response);

  if (response.success) {
    // Backend sends token and user directly in response, not in data
    const token = response.token || response.data?.token;
    const user = response.user || response.data?.user;
    
    if (token && user) {
      // Simpan token dan user data
      apiClient.setToken(token);
      apiClient.saveUserData(user);
      console.log('✅ Login successful, token saved');
      
      // Return normalized response
      return {
        success: true,
        message: response.message,
        data: {
          token,
          user
        }
      };
    }
  }

  return response;
}

/**
 * Logout - clear token and user data
 */
export function logout(): void {
  apiClient.clearToken();
  console.log('🔓 Logged out');
}

/**
 * Check if user is logged in
 */
export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('jwt_token');
  return !!token;
}

/**
 * Get current user data from localStorage
 */
export function getCurrentUser(): LoginResponse['user'] | null {
  return apiClient.getUserData();
}

/**
 * Register new user
 */
export async function register(data: RegisterRequest): Promise<ApiResponse> {
  return apiClient.post('/api/auth/register', data, false);
}

/**
 * Get list jurusan
 */
export async function getJurusan(): Promise<ApiResponse<Jurusan[]>> {
  return apiClient.get('/api/auth/jurusan');
}

/**
 * Get list prodi by jurusan_id
 */
export async function getProdi(jurusanId: number): Promise<ApiResponse<Prodi[]>> {
  return apiClient.get('/api/auth/prodi', { jurusan_id: jurusanId });
}
