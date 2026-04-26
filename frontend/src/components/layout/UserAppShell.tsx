"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Home, LogOut, Menu, Shield, Ticket } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const items = [
    { href: "/concerts", label: "Home", icon: Home, match: (p: string) => p === "/concerts" || p.startsWith("/concerts/") },
    { href: "/me/reservations", label: "My tickets", icon: Ticket, match: (p: string) => p.startsWith("/me/") },
  ] as const;

  function onLogout() {
    logout();
    onNavigate?.();
    router.push("/");
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        User
      </div>
      <nav className="flex flex-col gap-0.5">
        {items.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-2 text-sm no-underline transition-colors",
                active
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
        {user?.role === "admin" && (
          <Link
            href="/admin/concerts"
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm no-underline text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
          >
            <Shield className="h-4 w-4 shrink-0" />
            Admin portal
          </Link>
        )}
      </nav>
      <div className="mt-auto border-t border-border pt-3 space-y-2">
        {user && (
          <p className="px-2 text-xs text-muted-foreground truncate" title={user.email}>
            {user.firstName ?? user.email}
          </p>
        )}
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

export function UserAppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full flex-col bg-background md:flex-row">
      <aside className="hidden border-r border-border bg-muted/20 md:flex md:w-56 md:shrink-0 md:flex-col md:p-3">
        <div className="mb-3 px-2">
          <Link
            href="/concerts"
            className="flex items-center gap-2 text-sm font-semibold text-foreground no-underline"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold">
              K
            </span>
            KOB Tickets
          </Link>
        </div>
        <NavLinks />
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
                  href="/concerts"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground no-underline"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold">
                    K
                  </span>
                  KOB Tickets
                </Link>
              </div>
              <div className="flex flex-1 flex-col p-3">
                <NavLinks onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
          <span className="ml-1 text-sm font-medium text-foreground">KOB Tickets</span>
        </header>
        <div className="min-h-0 flex-1 overflow-auto bg-theme-body-bg">{children}</div>
      </div>
    </div>
  );
}
