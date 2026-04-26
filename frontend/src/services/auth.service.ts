import type { AuthResponse, User, UserRole } from '@/types';
import { request } from './http-client';

const TOKEN_KEY = 'app_token';
const REFRESH_KEY = 'app_refresh';

function roleIdToName(id?: number | string | null): UserRole {
  switch (String(id)) {
    case '1':
      return 'admin';
    case '2':
      return 'host';
    case '3':
    default:
      return 'customer';
  }
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
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, res.token);
  localStorage.setItem(REFRESH_KEY, res.refreshToken);
  document.cookie = `${TOKEN_KEY}=${res.token}; path=/; SameSite=Lax`;
}

export function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
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
