// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'viewer';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// CloudOps specific types
export interface CloudResource {
  id: string;
  name: string;
  type: 'server' | 'database' | 'storage' | 'network' | 'container';
  status: 'running' | 'stopped' | 'pending' | 'error';
  region: string;
  provider: 'aws' | 'azure' | 'gcp' | 'digitalocean';
  cost: number;
  createdAt: string;
  updatedAt: string;
}

export interface MonitoringMetric {
  id: string;
  resourceId: string;
  metric: string;
  value: number;
  unit: string;
  timestamp: string;
}

export interface Alert {
  id: string;
  resourceId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  status: 'active' | 'resolved' | 'acknowledged';
  createdAt: string;
  resolvedAt?: string;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

// Navigation types
export interface NavItem {
  name: string;
  href: string;
  icon: string;
  current?: boolean;
  children?: NavItem[];
}