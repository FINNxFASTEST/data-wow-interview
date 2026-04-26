"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { recoverSessionFromStorage } from "@/lib/auth-cookie";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/services";
import { AccessLevelPanel } from "@/components/auth/AccessLevelPanel";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import {
  getStoredPortal,
  parsePortalParam,
  setStoredPortal,
  type AuthPortal,
} from "@/lib/auth-portal";
import { pathAfterSignIn } from "@/lib/redirect-after-auth";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

const brandByPortal: Record<AuthPortal, string> = {
  user: "Your digital workspace, simplified.",
  admin: "Powering the tools that power the team.",
};

function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"portal" | "form">("portal");
  const [portal, setPortal] = useState<AuthPortal | null>(null);

  const syncPortal = useCallback(() => {
    const q = parsePortalParam(searchParams.get("portal"));
    if (q) {
      setStoredPortal(q);
      setPortal(q);
      setStep("form");
      return;
    }
    const s = getStoredPortal();
    if (s) {
      setPortal(s);
      setStep("form");
    }
  }, [searchParams]);

  useEffect(() => {
    syncPortal();
  }, [syncPortal]);

  useEffect(() => {
    recoverSessionFromStorage();
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  function pickPortal(p: AuthPortal) {
    setPortal(p);
    setStoredPortal(p);
    setStep("form");
  }

  function backToPortal() {
    setStep("portal");
  }

  async function onSubmit(data: FormData) {
    try {
      const u = await login(data.email, data.password);
      router.push(pathAfterSignIn(u));
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      const text = typeof msg === "string" ? msg : "Something went wrong.";
      setError("root", { message: text });
      toast.error(text);
    }
  }

  if (step === "portal") {
    return (
      <AccessLevelPanel
        onChoose={pickPortal}
        footer={
          <p className="text-center text-sm text-theme-secondary">
            Need an account?{" "}
            <Link
              href="/register"
              className="font-medium text-theme-primary underline-offset-4 hover:underline"
            >
              Create one
            </Link>
          </p>
        }
      />
    );
  }

  const p = portal ?? "user";

  return (
    <AuthSplitLayout brandLine={brandByPortal[p]} portal={p}>
      <div className="mb-6">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-ml-2 mb-2 h-8"
          onClick={backToPortal}
        >
          ← Access level
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Sign in
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Enter your credentials to continue
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {errors.root && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
            {errors.root.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 h-10 w-full rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer border-0"
        >
          {isSubmitting ? "Signing in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={portal ? `/register?portal=${portal}` : "/register"}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </AuthSplitLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-theme-body-bg text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
