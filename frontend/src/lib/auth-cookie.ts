import { getRoleIdFromToken, appHomePathForRoleId } from "@/lib/jwt-role";

const TOKEN_KEY = "app_token";
const COOKIE = "app_token";

/**
 * Keep document cookie aligned with localStorage (middleware only reads the cookie).
 */
export function ensureAuthCookieFromStorage() {
  if (typeof window === "undefined") return;
  const t = localStorage.getItem(TOKEN_KEY);
  if (!t) return;
  document.cookie = `${COOKIE}=${t}; path=/; SameSite=Lax`;
}

/**
 * If the token exists only in localStorage (cookie missing), sync and navigate to the app
 * so middleware on the next request sees the cookie.
 */
export function recoverSessionFromStorage() {
  if (typeof window === "undefined") return;
  const t = localStorage.getItem(TOKEN_KEY);
  if (!t) return;
  if (new RegExp(`(?:^|; )${COOKIE}=`).test(document.cookie)) return;
  ensureAuthCookieFromStorage();
  const target = appHomePathForRoleId(getRoleIdFromToken(t));
  window.location.replace(target);
}
