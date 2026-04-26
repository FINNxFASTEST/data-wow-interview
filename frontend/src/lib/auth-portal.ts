export type AuthPortal = "user" | "admin";

export function parsePortalParam(v: string | null): AuthPortal | null {
  if (v === "user" || v === "admin") return v;
  return null;
}
