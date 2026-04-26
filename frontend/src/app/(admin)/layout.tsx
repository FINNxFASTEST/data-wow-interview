import { AdminAppShell } from "@/components/layout/AdminAppShell";

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAppShell>{children}</AdminAppShell>;
}
