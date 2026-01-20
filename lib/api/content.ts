/**
 * Content API Service (Edukasi & Aktivitas)
 * Endpoints: /api/edukasi/* dan /api/aktivitas/*
 */

import { apiClient, ApiResponse } from './client';

export interface Edukasi {
  id: number;
  judul: string;
  konten: string;
  kategori?: string;
  penulis?: string;
  status: 'draft' | 'published';
  media?: string;
  thumbnail?: string;
  views: number;
  is_popular: boolean;
  created_at: string;
  updated_at: string;
}

export interface Aktivitas {
  id: number;
  judul: string;
  konten: string;
  kategori?: string;
  lokasi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  kapasitas: number;
  peserta_terdaftar: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  media?: string;
  thumbnail?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentListParams {
  status?: string;
  kategori?: string;
  search?: string;
  sortBy?: 'created_at' | 'views' | 'judul';
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
  is_popular?: boolean;
  upcoming?: boolean;
}

// ===== EDUKASI =====

/**
 * Get all edukasi with filters
 */
export async function getAllEdukasi(params?: ContentListParams): Promise<ApiResponse<Edukasi[]>> {
  return apiClient.get('/api/edukasi', params);
}

/**
 * Get edukasi by ID
 */
export async function getEdukasiById(id: number): Promise<ApiResponse<Edukasi>> {
  return apiClient.get(`/api/edukasi/${id}`);
}

/**
 * Create new edukasi with file upload
 */
export async function createEdukasi(data: {
  judul: string;
  konten: string;
  kategori?: string;
  penulis?: string;
  status?: 'draft' | 'published';
  media?: File;
  thumbnail?: File;
}): Promise<ApiResponse<Edukasi>> {
  const formData = new FormData();
  formData.append('judul', data.judul);
  formData.append('konten', data.konten);
  formData.append('status', data.status || 'published');
  
  if (data.kategori) formData.append('kategori', data.kategori);
  if (data.penulis) formData.append('penulis', data.penulis);
  if (data.media) formData.append('media', data.media);
  if (data.thumbnail) formData.append('thumbnail', data.thumbnail);

  return apiClient.uploadFile('/api/edukasi', formData);
}

/**
 * Update edukasi
 */
export async function updateEdukasi(
  id: number,
  data: {
    judul?: string;
    konten?: string;
    kategori?: string;
    penulis?: string;
    status?: 'draft' | 'published';
    media?: File;
    thumbnail?: File;
  }
): Promise<ApiResponse<Edukasi>> {
  const formData = new FormData();
  
  if (data.judul) formData.append('judul', data.judul);
  if (data.konten) formData.append('konten', data.konten);
  if (data.kategori) formData.append('kategori', data.kategori);
  if (data.penulis) formData.append('penulis', data.penulis);
  if (data.status) formData.append('status', data.status);
  if (data.media) formData.append('media', data.media);
  if (data.thumbnail) formData.append('thumbnail', data.thumbnail);

  // Note: Backend menggunakan PUT, tapi FormData biasanya via POST dengan _method override
  // Atau kita bisa gunakan fetch langsung dengan PUT method
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/edukasi/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
    },
    body: formData,
  });

  return response.json();
}

/**
 * Delete edukasi
 */
export async function deleteEdukasi(id: number): Promise<ApiResponse> {
  return apiClient.delete(`/api/edukasi/${id}`);
}

// ===== AKTIVITAS =====

/**
 * Get all aktivitas with filters
 */
export async function getAllAktivitas(params?: ContentListParams): Promise<ApiResponse<Aktivitas[]>> {
  return apiClient.get('/api/aktivitas', params);
}

/**
 * Get aktivitas by ID
 */
export async function getAktivitasById(id: number): Promise<ApiResponse<Aktivitas>> {
  return apiClient.get(`/api/aktivitas/${id}`);
}

/**
 * Create new aktivitas
 */
export async function createAktivitas(data: {
  judul: string;
  konten: string;
  kategori?: string;
  lokasi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  kapasitas: number;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  media?: File;
  thumbnail?: File;
}): Promise<ApiResponse<Aktivitas>> {
  const formData = new FormData();
  formData.append('judul', data.judul);
  formData.append('konten', data.konten);
  formData.append('lokasi', data.lokasi);
  formData.append('tanggal_mulai', data.tanggal_mulai);
  formData.append('tanggal_selesai', data.tanggal_selesai);
  formData.append('kapasitas', String(data.kapasitas));
  formData.append('status', data.status || 'upcoming');
  
  if (data.kategori) formData.append('kategori', data.kategori);
  if (data.media) formData.append('media', data.media);
  if (data.thumbnail) formData.append('thumbnail', data.thumbnail);

  return apiClient.uploadFile('/api/aktivitas', formData);
}

/**
 * Update aktivitas
 */
export async function updateAktivitas(
  id: number,
  data: {
    judul?: string;
    konten?: string;
    kategori?: string;
    lokasi?: string;
    tanggal_mulai?: string;
    tanggal_selesai?: string;
    kapasitas?: number;
    status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    media?: File;
    thumbnail?: File;
  }
): Promise<ApiResponse<Aktivitas>> {
  const formData = new FormData();
  
  if (data.judul) formData.append('judul', data.judul);
  if (data.konten) formData.append('konten', data.konten);
  if (data.kategori) formData.append('kategori', data.kategori);
  if (data.lokasi) formData.append('lokasi', data.lokasi);
  if (data.tanggal_mulai) formData.append('tanggal_mulai', data.tanggal_mulai);
  if (data.tanggal_selesai) formData.append('tanggal_selesai', data.tanggal_selesai);
  if (data.kapasitas) formData.append('kapasitas', String(data.kapasitas));
  if (data.status) formData.append('status', data.status);
  if (data.media) formData.append('media', data.media);
  if (data.thumbnail) formData.append('thumbnail', data.thumbnail);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/aktivitas/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
    },
    body: formData,
  });

  return response.json();
}

/**
 * Delete aktivitas
 */
export async function deleteAktivitas(id: number): Promise<ApiResponse> {
  return apiClient.delete(`/api/aktivitas/${id}`);
}
