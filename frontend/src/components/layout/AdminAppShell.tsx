"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, LayoutList, LogOut, Menu, Music } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const items = [
    { href: "/admin/concerts", label: "Concerts", icon: Music },
    { href: "/admin/audit", label: "History", icon: LayoutList },
  ] as const;

  function onLogout() {
    logout();
    onNavigate?.();
    router.push("/");
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Admin
      </div>
      <nav className="flex flex-col gap-0.5">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-2 text-sm no-underline transition-colors",
                isActive
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
        <Link
          href="/concerts"
          onClick={onNavigate}
          className="mt-1 flex items-center gap-2 rounded-md px-2 py-2 text-sm no-underline text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          <Building2 className="h-4 w-4 shrink-0" />
          User view
        </Link>
      </nav>
      <div className="mt-auto border-t border-border pt-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}

export function AdminAppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full flex-col bg-background md:flex-row">
      <aside className="hidden border-r border-border bg-muted/20 md:flex md:w-56 md:shrink-0 md:flex-col md:p-3">
        <div className="mb-3 px-2">
          <Link
            href="/admin/concerts"
            className="flex items-center gap-2 text-sm font-semibold text-foreground no-underline"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded bg-foreground text-background text-xs font-bold">
              K
            </span>
            KOB Admin
          </Link>
        </div>
        <AdminNav />
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center border-b border-border bg-background/95 px-3 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button type="button" variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-72 flex-col p-0">
              <div className="border-b border-border p-3">
                <Link
                  href="/admin/concerts"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground no-underline"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-foreground text-background text-xs font-bold">
                    K
                  </span>
                  KOB Admin
                </Link>
              </div>
              <div className="flex flex-1 flex-col p-3">
                <AdminNav onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
          <span className="ml-1 text-sm font-medium text-foreground">KOB Admin</span>
        </header>
        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
