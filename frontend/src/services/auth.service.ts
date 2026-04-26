import type { AuthResponse, User, UserRole } from '@/types';
import { applyAuthTokens, clearStoredAuth } from '@/lib/auth-tokens';
import { request } from './http-client';

function roleIdToName(id?: number | string | null): UserRole {
  return String(id) === '1' ? 'admin' : 'user';
}

export type MeResponse = {
  id: string | number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role?: { id: number } | null;
};

export function mapAuthResponseToUser(res: AuthResponse): User {
  return {
    id: String(res.user.id),
    email: res.user.email,
    firstName: res.user.firstName ?? undefined,
    lastName: res.user.lastName ?? undefined,
    role: roleIdToName(res.user.role?.id),
  };
}

export function mapMeResponseToUser(me: MeResponse): User {
  return {
    id: String(me.id),
    email: me.email,
    firstName: me.firstName ?? undefined,
    lastName: me.lastName ?? undefined,
    role: roleIdToName(me.role?.id),
  };
}

export function persistAuth(res: AuthResponse) {
  applyAuthTokens(res.token, res.refreshToken);
}

export function clearAuth() {
  clearStoredAuth();
}

export const authApi = {
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) =>
    request<AuthResponse>('/auth/email/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  login: (data: { email: string; password: string }) =>
    request<AuthResponse>('/auth/email/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  me: () => request<MeResponse>('/auth/me'),
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
};
