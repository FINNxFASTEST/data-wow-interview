"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/services";
import { concertsApi, type ConcertListItem } from "@/services/concerts.service";
import {
  reservationsApi,
  type ReservationItem,
} from "@/services/reservations.service";
import { useAuth } from "@/contexts/AuthContext";

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
      if (user?.role === "user") {
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
    if (user?.role !== "user") return;
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
    if (user?.role !== "user") return;
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

  const isUser = user?.role === "user";

  return (
    <div className="p-4 md:p-8 max-w-3xl w-full mx-auto">
      <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
        Concerts
      </h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-xl">
        {authLoading
          ? "Loading your session…"
          : isUser
            ? "Reserve one seat per show or cancel to release it."
            : "Browse listings. Book seats with a user account (sign out and use a user login)."}
      </p>

      <ul className="mt-8 space-y-3">
        {items === null && (
          <li className="h-32 rounded-lg border border-border bg-muted/30 animate-pulse" />
        )}
        {items &&
          items.map((c) => {
            const res = resByConcert.get(c.id);
            return (
              <li
                key={c.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-medium text-foreground">
                      {c.name}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {c.description}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {c.remainingSeats} / {c.totalSeats} seats left
                      {c.soldOut && (
                        <span className="ml-2 font-medium text-destructive">
                          Sold out
                        </span>
                      )}
                    </p>
                    <Link
                      href={`/concerts/${c.id}`}
                      className="mt-2 inline-block text-xs font-medium text-foreground underline-offset-2 hover:underline"
                    >
                      View details
                    </Link>
                  </div>
                  {isUser && (
                    <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end sm:justify-end">
                      {res ? (
                        <button
                          type="button"
                          disabled={busyId !== null}
                          onClick={() => void doCancel(res.id)}
                          className="h-9 min-w-[7rem] rounded-md border border-destructive/40 bg-destructive/5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                        >
                          {busyId === res.id ? "…" : "Cancel"}
                        </button>
                      ) : c.soldOut ? (
                        <span className="h-9 flex items-center justify-center text-sm text-muted-foreground">
                          Sold out
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={busyId !== null}
                          onClick={() => void doReserve(c.id)}
                          className="h-9 min-w-[7rem] rounded-md bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
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
