"use client";

import { Building2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuthPortal } from "@/lib/auth-portal";

type AccessLevelPanelProps = {
  onChoose: (portal: AuthPortal) => void;
};

export function AccessLevelPanel({ onChoose }: AccessLevelPanelProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Select access level
      </h1>
      <p className="text-sm text-muted-foreground">
        Choose how you use KOB Tickets. You will sign in with an account that
        has the matching role.
      </p>
      <div className="grid gap-3 sm:grid-cols-1">
        <button
          type="button"
          onClick={() => onChoose("user")}
          className={cn(
            "flex w-full items-start gap-3 rounded-lg border border-border p-4 text-left transition-colors",
            "hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring",
          )}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
            <Users className="h-5 w-5 text-foreground" />
          </span>
          <span>
            <span className="block text-sm font-medium text-foreground">User</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Book seats and manage your own reservations.
            </span>
            <span className="mt-2 inline-block text-xs font-medium text-foreground">
              Enter workspace
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => onChoose("admin")}
          className={cn(
            "flex w-full items-start gap-3 rounded-lg border border-border p-4 text-left transition-colors",
            "hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring",
          )}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
            <Building2 className="h-5 w-5 text-foreground" />
          </span>
          <span>
            <span className="block text-sm font-medium text-foreground">
              Administrator
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Create concerts, manage listings, and view audit history.
            </span>
            <span className="mt-2 inline-block text-xs font-medium text-foreground">
              Enter portal
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
