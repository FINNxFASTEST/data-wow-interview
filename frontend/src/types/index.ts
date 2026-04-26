export type UserRole = 'admin' | 'host' | 'customer';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role?: { id: number } | null;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  hasNextPage: boolean;
}
