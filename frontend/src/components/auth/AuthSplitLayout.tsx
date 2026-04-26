import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { AuthPortal } from "@/lib/auth-portal";

type AuthSplitLayoutProps = {
  children: ReactNode;
  brandTitle?: string;
  brandLine: string;
  portal?: AuthPortal | null;
};

const portalLabel: Record<AuthPortal, string> = {
  user: "User workspace",
  admin: "Administrator",
};

export function AuthSplitLayout({
  children,
  brandTitle = "BRAND",
  brandLine,
  portal,
}: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:grid md:grid-cols-2">
      <div
        className={cn(
          "relative flex flex-col justify-between px-6 py-8 md:px-10 md:py-12",
          "min-h-[40vh] md:min-h-screen",
          "bg-primary text-primary-foreground",
        )}
      >
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold no-underline text-primary-foreground"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded bg-primary-foreground/15 text-primary-foreground text-xs font-bold">
            B
          </span>
          {brandTitle}
        </Link>
        <div className="mt-8 md:mt-0 max-w-sm">
          {portal && (
            <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/70 mb-2">
              {portalLabel[portal]}
            </p>
          )}
          <p className="text-2xl md:text-3xl font-semibold leading-tight text-balance">
            {brandLine}
          </p>
        </div>
        <p className="text-xs text-primary-foreground/50 hidden md:block">
          Secure sign-in for concert reservations.
        </p>
      </div>
      <div className="flex flex-1 flex-col justify-center px-4 py-8 md:px-10 md:py-12 bg-background">
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
