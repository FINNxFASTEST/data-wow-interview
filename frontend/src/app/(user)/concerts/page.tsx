"use client";

import { User } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/services";
import { concertsApi, type ConcertListItem } from "@/services/concerts.service";
import {
  reservationsApi,
  type ReservationItem,
} from "@/services/reservations.service";
import { useAuth } from "@/contexts/AuthContext";
import { canUseUserConcertFlow } from "@/lib/user-concert-role";

function reservationMap(items: ReservationItem[]) {
  const byConcert = new Map<string, ReservationItem>();
  for (const r of items) {
    if (r.status === "active") {
      byConcert.set(r.concertId, r);
    }
  }
  return byConcert;
}

export default function ConcertsListPage() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<ConcertListItem[] | null>(null);
  const [resByConcert, setResByConcert] = useState<
    Map<string, ReservationItem>
  >(new Map());
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await concertsApi.list();
      setItems(data);
      if (canUseUserConcertFlow(user)) {
        const mine = await reservationsApi.mine();
        setResByConcert(reservationMap(mine));
      } else {
        setResByConcert(new Map());
      }
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Could not load concerts");
      setItems([]);
    }
  }, [user?.role, authLoading]);

  useEffect(() => {
    void load();
  }, [load]);

  async function doReserve(concertId: string) {
    if (!canUseUserConcertFlow(user)) return;
    setBusyId(concertId);
    try {
      await concertsApi.reserve(concertId);
      toast.success("Seat reserved");
      void load();
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : "Could not complete reservation",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function doCancel(reservationId: string) {
    if (!canUseUserConcertFlow(user)) return;
    setBusyId(reservationId);
    try {
      await reservationsApi.cancel(reservationId);
      toast.success("Reservation cancelled");
      void load();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Could not cancel");
    } finally {
      setBusyId(null);
    }
  }

  const isUser = canUseUserConcertFlow(user);

  return (
    <div className="p-4 md:p-6 md:px-8 max-w-2xl w-full mx-auto">
      <nav
        className="text-sm text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <span>User</span>
        <span className="mx-1.5" aria-hidden>
          /
        </span>
        <span className="text-foreground font-medium">Home</span>
      </nav>
      <h1 className="mt-3 text-2xl md:text-3xl font-semibold text-foreground">
        Concerts
      </h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-xl">
        {authLoading
          ? "Loading your session…"
          : isUser
            ? "Reserve one seat per show or cancel to release it."
            : "Browse listings. Book seats with a user account (sign out and use a user login)."}
      </p>

      <ul className="mt-8 space-y-4">
        {items === null && (
          <li className="h-40 rounded-xl border border-border bg-card animate-pulse" />
        )}
        {items &&
          items.map((c) => {
            const res = resByConcert.get(c.id);
            return (
              <li
                key={c.id}
                className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
              >
                <div className="p-4 md:p-5">
                  <h2 className="text-lg md:text-xl font-semibold text-primary">
                    {c.name}
                  </h2>
                  <div className="mt-3 border-b border-border" />
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {c.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 px-4 py-3 md:px-5">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <User
                      className="h-4 w-4 shrink-0 text-primary"
                      strokeWidth={2}
                    />
                    <span className="font-medium tabular-nums">
                      {c.totalSeats.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      · {c.remainingSeats} left
                      {c.soldOut && (
                        <span className="ml-1.5 font-medium text-destructive">
                          (sold out)
                        </span>
                      )}
                    </span>
                  </div>
                  {isUser && (
                    <div className="ml-auto flex shrink-0">
                      {res ? (
                        <button
                          type="button"
                          disabled={busyId !== null}
                          onClick={() => void doCancel(res.id)}
                          className="h-10 min-w-[7.5rem] rounded-full border-0 bg-destructive/90 px-5 text-sm font-medium text-destructive-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                        >
                          {busyId === res.id ? "…" : "Cancel"}
                        </button>
                      ) : c.soldOut ? (
                        <span className="h-10 flex min-w-[7.5rem] items-center justify-center text-sm text-muted-foreground">
                          Sold out
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={busyId !== null}
                          onClick={() => void doReserve(c.id)}
                          className="h-10 min-w-[7.5rem] rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                        >
                          {busyId === c.id ? "…" : "Reserve"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
      </ul>
      {items && items.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">
          No concerts yet. An admin can add listings from the admin area.
        </p>
      )}
    </div>
  );
}
