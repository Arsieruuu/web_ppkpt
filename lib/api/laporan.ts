/**
 * Laporan API Service
 * Endpoints: /api/laporan/* dan /api/admin/laporan/*
 */

import { apiClient, ApiResponse } from './client';

export type LaporanStatus = 'Dalam Proses' | 'Verifikasi' | 'Proses Tindak Lanjut' | 'Selesai' | 'Ditolak';

export interface Laporan {
  id: number;
  nama: string;
  nomor_telepon: string;
  domisili: string;
  tanggal: string;
  jenis_kekerasan: string;
  cerita_peristiwa: string;
  pelampiran_bukti?: string;
  disabilitas?: string;
  alasan?: string;
  alasan_lainnya?: string;
  pendampingan?: string;
  status: LaporanStatus;
  catatan_admin?: string;
  created_at: string;
  updated_at: string;
  user_id?: number;
}

export interface CreateLaporanRequest {
  nama: string;
  nomor_telepon: string;
  domisili: string;
  tanggal: string;
  jenis_kekerasan: string;
  cerita_peristiwa: string;
  pelampiran_bukti?: string;
  disabilitas?: string;
  alasan?: string;
  alasan_lainnya?: string;
  pendampingan?: string;
}

export interface AdminLaporanListParams {
  verifikasi?: 'belum' | 'sudah';
  status?: LaporanStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminLaporanListResponse {
  data: Laporan[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  statistics: {
    total: number;
    dalam_proses: number;
    verifikasi: number;
    proses_tindak_lanjut: number;
    selesai: number;
    ditolak: number;
  };
}

export interface RiwayatLaporan {
  id: number;
  laporan_id: number;
  status_sebelumnya: LaporanStatus;
  status_sesudahnya: LaporanStatus;
  catatan: string;
  admin_id: number;
  admin_name: string;
  created_at: string;
}

/**
 * Check if user has active laporan
 */
export async function checkActiveLaporan(): Promise<ApiResponse<{
  has_active: boolean;
  can_create: boolean;
  laporan_aktif?: Laporan;
}>> {
  return apiClient.get('/api/laporan/check-active');
}

/**
 * Create new laporan
 */
export async function createLaporan(data: CreateLaporanRequest): Promise<ApiResponse<{ laporan_id: number }>> {
  return apiClient.post('/api/laporan', data);
}

/**
 * Get my laporan (user's own reports)
 */
export async function getMyLaporan(): Promise<ApiResponse<Laporan[]>> {
  return apiClient.get('/api/laporan/me');
}

/**
 * Get riwayat laporan by ID
 */
export async function getRiwayatLaporan(laporanId: number): Promise<ApiResponse<RiwayatLaporan[]>> {
  return apiClient.get(`/api/riwayat-laporan/${laporanId}`);
}

// ===== ADMIN METHODS =====

/**
 * Get all laporan for admin with filters
 */
export async function getAdminLaporanList(params?: AdminLaporanListParams): Promise<ApiResponse<AdminLaporanListResponse>> {
  return apiClient.get('/api/admin/laporan', params);
}

/**
 * Get laporan detail for admin
 */
export async function getAdminLaporanDetail(id: number): Promise<ApiResponse<Laporan>> {
  return apiClient.get(`/api/admin/laporan/${id}`);
}

/**
 * Verify laporan (Dalam Proses → Verifikasi)
 */
export async function verifyLaporan(id: number, catatan?: string): Promise<ApiResponse> {
  return apiClient.put(`/api/admin/laporan/${id}/verifikasi`, { catatan });
}

/**
 * Process laporan (Verifikasi → Proses Tindak Lanjut)
 */
export async function prosesLaporan(id: number, catatan?: string): Promise<ApiResponse> {
  return apiClient.put(`/api/admin/laporan/${id}/proses`, { catatan });
}

/**
 * Complete laporan (Any → Selesai)
 */
export async function selesaikanLaporan(id: number, catatan?: string): Promise<ApiResponse> {
  return apiClient.put(`/api/admin/laporan/${id}/selesai`, { catatan });
}

/**
 * Get statistik laporan (Super Admin only)
 */
export async function getStatistikLaporan(year?: number, month?: number): Promise<ApiResponse> {
  return apiClient.get('/api/admin/laporan/statistik', { year, month });
}
