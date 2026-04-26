"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { canUseUserConcertFlow } from "@/lib/user-concert-role";

export function Nav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl flex h-14 items-center justify-between gap-2 px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground no-underline text-sm shrink-0"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold">
            B
          </span>
          <span className="hidden sm:inline">BRAND</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0 justify-end">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  href="/admin/concerts"
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent no-underline whitespace-nowrap"
                >
                  Admin
                </Link>
              )}
              {canUseUserConcertFlow(user) && (
                <Link
                  href="/me/reservations"
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent no-underline whitespace-nowrap"
                >
                  My tickets
                </Link>
              )}
              <Link
                href="/concerts"
                className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent no-underline whitespace-nowrap"
              >
                Concerts
              </Link>
              <span className="text-xs sm:text-sm text-muted-foreground truncate max-w-[8rem] sm:max-w-none">
                {user.firstName ?? user.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs sm:text-sm h-8 px-2 sm:px-3 rounded-md border border-border bg-background text-foreground hover:bg-accent cursor-pointer transition-colors shrink-0"
              >
                Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm h-8 px-3 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent no-underline inline-flex items-center transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="text-sm h-8 px-3 rounded-md bg-primary text-primary-foreground hover:opacity-90 no-underline inline-flex items-center transition-colors font-medium"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
