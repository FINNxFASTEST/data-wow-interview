"use client";

import { useEffect } from "react";
import { ensureAuthCookieFromStorage } from "@/lib/auth-cookie";

/**
 * Re-applies the JWT cookie from localStorage on every page so middleware
 * matches what the API client already uses.
 */
export function AuthCookieSync() {
  useEffect(() => {
    ensureAuthCookieFromStorage();
  }, []);
  return null;
}
