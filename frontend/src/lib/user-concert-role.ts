import type { User } from "@/types";

export function canUseUserConcertFlow(
  user: { role: User["role"] } | null | undefined,
): boolean {
  return user?.role === "user" || user?.role === "admin";
}
