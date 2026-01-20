/**
 * Notifications API Service
 * Endpoints: /api/notifications/*
 */

import { apiClient, ApiResponse } from './client';

export type NotificationType = 
  | 'laporan_baru'
  | 'laporan_diverifikasi'
  | 'laporan_diproses'
  | 'laporan_selesai'
  | 'aktivitas_baru'
  | 'edukasi_baru';

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  created_at: string;
}

export interface NotificationListParams {
  page?: number;
  limit?: number;
  unread?: boolean;
  days?: number;
}

export interface NotificationListResponse {
  data: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  unread_count: number;
}

/**
 * Get notifications with pagination
 */
export async function getNotifications(params?: NotificationListParams): Promise<ApiResponse<NotificationListResponse>> {
  return apiClient.get('/api/notifications/user', params);
}

/**
 * Get unread notifications count
 */
export async function getUnreadCount(): Promise<ApiResponse<{ unread_count: number }>> {
  return apiClient.get('/api/notifications/user/unread-count');
}

/**
 * Mark single notification as read
 */
export async function markAsRead(notificationId: number): Promise<ApiResponse> {
  return apiClient.put(`/api/notifications/${notificationId}/read`);
}

/**
 * Mark multiple notifications as read
 */
export async function markMultipleAsRead(notificationIds: number[]): Promise<ApiResponse> {
  return apiClient.put('/api/notifications/mark-read', { notification_ids: notificationIds });
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<ApiResponse> {
  return apiClient.put('/api/notifications/mark-all-read');
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: number): Promise<ApiResponse> {
  return apiClient.delete(`/api/notifications/${notificationId}`);
}
