/**
 * API Client untuk komunikasi dengan backend Express.js
 * Base URL: http://31.97.109.108:3000
 * Authentication: JWT Bearer Token
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://31.97.109.108:3000';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error_code?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  statistics?: any;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Get stored token from localStorage
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('jwt_token');
  }

  /**
   * Set token to localStorage
   */
  public setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('jwt_token', token);
  }

  /**
   * Clear token from localStorage
   */
  public clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
  }

  /**
   * Save user data to localStorage
   */
  public saveUserData(userData: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user_data', JSON.stringify(userData));
  }

  /**
   * Get user data from localStorage
   */
  public getUserData(): any | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('user_data');
    return data ? JSON.parse(data) : null;
  }

  /**
   * Build headers with authorization
   */
  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Handle API errors
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();

      if (!response.ok) {
        // Handle 401 Unauthorized - clear token
        if (response.status === 401) {
          this.clearToken();
        }

        return {
          success: false,
          message: data.message || `HTTP Error ${response.status}`,
          error_code: data.error_code,
          data: data.data,
        };
      }

      return data;
    }

    if (!response.ok) {
      return {
        success: false,
        message: `HTTP Error ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      message: 'Success',
    };
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    queryParams?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      let url = `${this.baseUrl}${endpoint}`;

      if (queryParams) {
        const params = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            params.append(key, String(value));
          }
        });
        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      }

      console.log('🔵 GET:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('❌ GET Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    includeAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log('🟢 POST:', url, data);

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(includeAuth),
        body: JSON.stringify(data),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('❌ POST Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log('🟡 PUT:', url, data);

      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('❌ PUT Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log('🔴 DELETE:', url);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('❌ DELETE Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * Upload file with FormData
   */
  async uploadFile<T = any>(
    endpoint: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log('📤 UPLOAD:', url);

      const token = this.getToken();
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('❌ UPLOAD Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
