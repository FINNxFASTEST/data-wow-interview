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
import { parsePortalParam, type AuthPortal } from "@/lib/auth-portal";
import { pathAfterSignIn } from "@/lib/redirect-after-auth";
import { Button } from "@/components/ui/button";

const schema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type FormData = z.infer<typeof schema>;

const brandByPortal: Record<AuthPortal, string> = {
  user: "Your digital workspace, simplified.",
  admin: "Powering the tools that power the team.",
};

function RegisterContent() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"portal" | "form">("portal");
  const [portal, setPortal] = useState<AuthPortal | null>(null);

  const syncPortal = useCallback(() => {
    const q = parsePortalParam(searchParams.get("portal"));
    if (q) {
      setPortal(q);
      setStep("form");
      return;
    }
    setPortal(null);
    setStep("portal");
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
    setStep("form");
  }

  function backToPortal() {
    setStep("portal");
  }

  async function onSubmit(data: FormData) {
    try {
      const u = await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
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
            Already registered?{" "}
            <Link
              href="/login"
              className="font-medium text-theme-primary underline-offset-4 hover:underline"
            >
              Sign in
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
          Create an account
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Fill in the details below to get started
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="firstName" className="text-sm font-medium text-foreground">
              First name
            </label>
            <Input
              id="firstName"
              type="text"
              placeholder="Jane"
              autoComplete="given-name"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lastName" className="text-sm font-medium text-foreground">
              Last name
            </label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              autoComplete="family-name"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>

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
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Confirm password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
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
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={portal ? `/login?portal=${portal}` : "/login"}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthSplitLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-theme-body-bg text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
