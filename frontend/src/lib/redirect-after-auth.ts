import type { User } from "@/types";

export function pathAfterSignIn(user: User): string {
  if (user.role === "admin") return "/admin/concerts";
  return "/concerts";
}
