/**
 * Profile API Service
 * Endpoints: /api/profile/*
 */

import { apiClient, ApiResponse } from './client';

export interface Profile {
  id: number;
  username: string;
  email: string;
  full_name: string;
  nomor_telepon: string;
  profile_picture?: string;
  role: 'admin' | 'superadmin' | 'mahasiswa';
  npm?: string;
  jurusan_id?: number;
  prodi_id?: number;
  jurusan?: string;
  prodi?: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  nomor_telepon?: string;
  npm?: string;
  jurusan_id?: number;
  prodi_id?: number;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

/**
 * Get current user profile
 */
export async function getProfile(): Promise<ApiResponse<{ user: Profile; profile: Profile }>> {
  return apiClient.get('/api/profile');
}

/**
 * Update profile
 */
export async function updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<Profile>> {
  return apiClient.put('/api/profile', data);
}

/**
 * Upload profile picture
 */
export async function uploadProfilePicture(file: File): Promise<ApiResponse<{ profile_picture: string }>> {
  const formData = new FormData();
  formData.append('profile_picture', file);
  
  return apiClient.uploadFile('/api/profile/picture', formData);
}

/**
 * Change password
 */
export async function changePassword(data: ChangePasswordRequest): Promise<ApiResponse> {
  return apiClient.put('/api/profile/password', data);
}
