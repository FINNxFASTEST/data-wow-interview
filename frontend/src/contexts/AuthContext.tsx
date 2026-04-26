"use client";

import {
  AUTH_SESSION_EXPIRED_EVENT,
  TOKEN_KEY,
} from "@/lib/auth-tokens";
import {
  authApi,
  clearAuth,
  mapMeResponseToUser,
  mapAuthResponseToUser,
  persistAuth,
} from "@/services";
import type { User } from "@/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    try {
      const me = await authApi.me();
      setUser(mapMeResponseToUser(me));
    } catch {
      clearAuth();
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (!stored) {
      setLoading(false);
      return;
    }
    setToken(stored);
    document.cookie = `${TOKEN_KEY}=${stored}; path=/; SameSite=Lax`;
    hydrate().finally(() => setLoading(false));
  }, [hydrate]);

  useEffect(() => {
    const onSessionExpired = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, onSessionExpired);
    return () =>
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, onSessionExpired);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login({ email, password });
      persistAuth(res);
      setToken(res.token);
      await hydrate();
      return mapAuthResponseToUser(res);
    },
    [hydrate],
  );

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      const res = await authApi.register(data);
      persistAuth(res);
      setToken(res.token);
      await hydrate();
      return mapAuthResponseToUser(res);
    },
    [hydrate],
  );

  const logout = useCallback(() => {
    authApi.logout().catch(() => {});
    clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
