import {
  AUTH_SESSION_EXPIRED_EVENT,
  applyAuthTokens,
  clearStoredAuth,
  getAccessToken,
  getRefreshToken,
} from '@/lib/auth-tokens';

const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const BASE = RAW_BASE.replace(/\/$/, '');
const API_PREFIX = '/api/v1';

const NO_REFRESH_PATHS = new Set([
  '/auth/email/login',
  '/auth/email/register',
  '/auth/refresh',
]);

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const rt = getRefreshToken();
      if (!rt) return null;
      const res = await fetch(`${BASE}${API_PREFIX}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${rt}`,
        },
      });
      if (!res.ok) return null;
      const data = (await res.json()) as {
        token: string;
        refreshToken: string;
      };
      applyAuthTokens(data.token, data.refreshToken);
      return data.token;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function shouldAttemptRefresh(path: string): boolean {
  if (NO_REFRESH_PATHS.has(path)) return false;
  return Boolean(getRefreshToken());
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
  }
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${BASE}${API_PREFIX}${path}`;

  const buildHeaders = (token: string | null): Record<string, string> => ({
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  let access = getAccessToken();
  let res = await fetch(url, { ...init, headers: buildHeaders(access) });

  if (
    res.status === 401 &&
    shouldAttemptRefresh(path) &&
    getRefreshToken()
  ) {
    const next = await refreshAccessToken();
    if (next) {
      res = await fetch(url, { ...init, headers: buildHeaders(next) });
    } else {
      clearStoredAuth();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT));
      }
    }
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as {
      message?: string | string[];
    };
    const m = body?.message;
    const msg = Array.isArray(m) ? m.join(', ') : m;
    throw new ApiError(
      res.status,
      (typeof msg === 'string' && msg) || res.statusText,
      body,
    );
  }

  const text = await res.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}
