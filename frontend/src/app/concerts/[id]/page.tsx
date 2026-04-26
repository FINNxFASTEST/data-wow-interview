"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Nav } from "@/components/common/Nav";
import { Footer } from "@/components/common/Footer";
import { ApiError } from "@/services";
import { useAuth } from "@/contexts/AuthContext";
import { concertsApi, type ConcertListItem } from "@/services/concerts.service";

export default function ConcertDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { user, loading: authLoading } = useAuth();
  const [c, setC] = useState<ConcertListItem | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await concertsApi.get(id);
      setC(data);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Concert not found");
      setC(null);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function reserve() {
    if (!c || c.soldOut) return;
    setBusy(true);
    try {
      await concertsApi.reserve(c.id);
      toast.success("Reserved — check My tickets");
      void load();
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : "Could not complete reservation",
      );
    } finally {
      setBusy(false);
    }
  }

  const canBook = user?.role === "user" && c && !c.soldOut;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />
      <main className="flex-1 mx-auto max-w-3xl w-full px-4 md:px-6 py-8 md:py-12">
        <Link
          href="/concerts"
          className="text-sm text-muted-foreground hover:text-foreground no-underline"
        >
          ← All concerts
        </Link>
        {c && (
          <>
            <h1 className="mt-6 text-2xl md:text-3xl font-semibold text-foreground">
              {c.name}
            </h1>
            <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {c.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>Total capacity: {c.totalSeats}</span>
              <span>Active holds: {c.reservedCount}</span>
              <span>Remaining: {c.remainingSeats}</span>
            </div>
            {c.soldOut && (
              <p className="mt-4 text-sm font-medium text-destructive">Sold out</p>
            )}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {authLoading && (
                <span className="text-sm text-muted-foreground">Loading…</span>
              )}
              {!authLoading && canBook && (
                <button
                  type="button"
                  onClick={() => void reserve()}
                  disabled={busy}
                  className="h-10 px-5 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 disabled:opacity-50 w-full sm:w-auto"
                >
                  {busy ? "Booking…" : "Reserve one seat"}
                </button>
              )}
              {!authLoading && user?.role === "admin" && (
                <p className="text-sm text-muted-foreground self-center">
                  Sign in as a user account to test booking, or use the admin API.
                </p>
              )}
              {!authLoading && user?.role === "user" && c.soldOut && (
                <p className="text-sm text-muted-foreground">No seats left.</p>
              )}
            </div>
          </>
        )}
        {!c && (
          <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
