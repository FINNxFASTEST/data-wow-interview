"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, User, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuthPortal } from "@/lib/auth-portal";

type AccessLevelPanelProps = {
  onChoose: (portal: AuthPortal) => void;
  brandTitle?: string;
  footer?: ReactNode;
};

export function AccessLevelPanel({
  onChoose,
  brandTitle = "BRAND",
  footer,
}: AccessLevelPanelProps) {
  return (
    <div className="flex min-h-screen flex-col bg-theme-surface">
      <header className="relative flex justify-center bg-theme-surface px-6 pb-6 pt-8 md:px-10 md:pb-8 md:pt-10">
        <Link
          href="/"
          className="absolute left-6 top-8 flex w-fit items-center gap-2.5 no-underline md:left-10 md:top-10"
        >
          <span
            className="h-3 w-3 shrink-0 rounded-full bg-theme-primary md:h-3.5 md:w-3.5"
            aria-hidden
          />
          <span className="text-[15px] font-bold tracking-tight text-theme-primary md:text-base">
            {brandTitle}
          </span>
        </Link>
        <div className="mx-auto max-w-2xl px-4 pt-1 text-center md:px-8">
          <h1 className="text-balance text-[26px] font-bold leading-tight tracking-tight text-theme-body md:text-[32px]">
            Select Access Level
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-[14px] leading-relaxed text-theme-secondary md:text-[15px]">
            Choose how you use {brandTitle}. You will sign in with an account that has the
            matching role.
          </p>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center bg-theme-body-bg px-4 pb-10 pt-2 md:px-8 md:pb-14 md:pt-4">
        <div className="grid w-full max-w-[920px] gap-8 md:grid-cols-2 md:items-stretch md:gap-9">
          <button
            type="button"
            onClick={() => onChoose("user")}
            className={cn(
              "flex h-full min-h-[400px] w-full flex-col items-start rounded-[10px] bg-theme-surface p-10 text-left shadow-theme-card md:min-h-[440px] md:p-12",
              "transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lg",
              "focus-visible:ring-2 focus-visible:ring-theme-primary focus-visible:ring-offset-2 focus-visible:ring-offset-theme-body-bg",
            )}
          >
            <span className="mb-8 flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-lg border-2 border-theme-primary bg-theme-surface">
              <User className="h-9 w-9 text-theme-primary" strokeWidth={1.75} />
            </span>
            <span className="text-[22px] font-bold text-theme-primary">User</span>
            <span className="mt-4 max-w-[280px] flex-1 text-[14px] font-normal leading-[1.65] text-theme-emphasis">
              Book seats and manage your own reservations in the customer workspace.
            </span>
            <span className="mt-10 inline-flex w-full max-w-full items-center justify-center gap-2 rounded-[6px] bg-theme-primary px-5 py-3.5 text-[14px] font-semibold text-theme-on-primary">
              Enter Workspace
              <ArrowRight className="h-4 w-4 shrink-0 text-theme-on-primary" strokeWidth={2.25} />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onChoose("admin")}
            className={cn(
              "flex h-full min-h-[400px] w-full flex-col items-start rounded-[10px] bg-theme-primary p-10 text-left shadow-theme-card md:min-h-[440px] md:p-12",
              "transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-xl",
              "focus-visible:ring-2 focus-visible:ring-theme-on-primary focus-visible:ring-offset-2 focus-visible:ring-offset-theme-body-bg",
            )}
          >
            <span className="mb-8 flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-lg bg-white/15">
              <UserCog className="h-9 w-9 text-theme-on-primary" strokeWidth={1.65} />
            </span>
            <span className="text-[22px] font-bold text-theme-on-primary">Administrator</span>
            <span className="mt-4 max-w-[280px] flex-1 text-[14px] font-normal leading-[1.65] text-theme-on-primary/95">
              Create concerts, manage listings, and view audit history in the admin portal.
            </span>
            <span className="mt-10 inline-flex w-full max-w-full items-center justify-center gap-2 rounded-[6px] bg-theme-surface px-5 py-3.5 text-[14px] font-semibold text-theme-primary">
              Enter Portal
              <ArrowRight className="h-4 w-4 shrink-0 text-theme-primary" strokeWidth={2.25} />
            </span>
          </button>
        </div>

        {footer ? <div className="mt-10 w-full max-w-[920px]">{footer}</div> : null}
      </main>
    </div>
  );
}
