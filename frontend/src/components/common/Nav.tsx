"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function Nav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl flex h-14 items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground no-underline text-sm"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded bg-foreground text-background text-xs font-bold">
            B
          </span>
          Boilerplate
        </Link>

        <nav className="flex items-center gap-1">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground mr-2">
                {user.firstName ?? user.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm h-8 px-3 rounded-md border border-border bg-background text-foreground hover:bg-accent cursor-pointer transition-colors"
              >
                Sign out
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
                className="text-sm h-8 px-3 rounded-md bg-foreground text-background hover:bg-foreground/90 no-underline inline-flex items-center transition-colors font-medium"
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
