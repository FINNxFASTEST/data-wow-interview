import { UserAppShell } from "@/components/layout/UserAppShell";

export default function UserGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserAppShell>{children}</UserAppShell>;
}
