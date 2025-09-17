import { apiService } from './api';
import { User, LoginCredentials, RegisterData, ApiResponse } from '@/types';

export interface AuthService {
  login: (credentials: LoginCredentials) => Promise<{ user: User; token: string }>;
  register: (data: RegisterData) => Promise<{ user: User; token: string }>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User>;
  refreshToken: () => Promise<{ token: string }>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

class AuthServiceImpl implements AuthService {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await apiService.post<{ user: User; token: string }>('/auth/login', credentials);
    
    if (response.success) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await apiService.post<{ user: User; token: string }>('/auth/register', data);
    
    if (response.success) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/auth/me');
    return response.data;
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiService.post<{ token: string }>('/auth/refresh');
    
    if (response.success) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response.data;
  }

  async forgotPassword(email: string): Promise<void> {
    await apiService.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await apiService.post('/auth/reset-password', { token, password });
  }
}

export const authService = new AuthServiceImpl();
export default authService;