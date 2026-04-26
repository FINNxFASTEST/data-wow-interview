const KEY = "kob_auth_portal";

export type AuthPortal = "user" | "admin";

export function getStoredPortal(): AuthPortal | null {
  if (typeof window === "undefined") return null;
  const v = sessionStorage.getItem(KEY);
  return v === "user" || v === "admin" ? v : null;
}

export function setStoredPortal(portal: AuthPortal) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, portal);
}

export function clearStoredPortal() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}

export function parsePortalParam(v: string | null): AuthPortal | null {
  if (v === "user" || v === "admin") return v;
  return null;
}
