/**
 * Read role id from JWT payload (unverified, for routing only).
 * Handles numeric id or string (some serializers emit "1" not 1).
 */
export function getRoleIdFromToken(token: string | undefined | null): number | null {
  if (!token) return null;
  try {
    const p = token.split(".")[1];
    if (!p) return null;
    const b64 = p.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 === 0 ? b64 : b64 + "====".slice(b64.length % 4);
    const json = JSON.parse(atob(pad)) as { role?: { id?: number | string } | null };
    const id = json?.role?.id;
    if (typeof id === "number" && Number.isFinite(id)) return id;
    if (typeof id === "string" && id !== "") {
      const n = Number(id);
      return Number.isFinite(n) ? n : null;
    }
    return null;
  } catch {
    return null;
  }
}

export function appHomePathForRoleId(roleId: number | null): string {
  if (roleId === 1) return "/admin/concerts";
  return "/concerts";
}
