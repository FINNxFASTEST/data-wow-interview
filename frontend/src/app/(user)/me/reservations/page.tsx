"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/services";
import { concertsApi, type ConcertListItem } from "@/services/concerts.service";
import {
  reservationsApi,
  type ReservationItem,
} from "@/services/reservations.service";

type Row = { r: ReservationItem; concert?: ConcertListItem };

export default function MyReservationsPage() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await reservationsApi.mine();
        const withConcerts: Row[] = await Promise.all(
          list.map(async (r) => {
            try {
              const concert = await concertsApi.get(r.concertId);
              return { r, concert };
            } catch {
              return { r, concert: undefined };
            }
          }),
        );
        if (!cancelled) setRows(withConcerts);
      } catch (e) {
        toast.error(e instanceof ApiError ? e.message : "Failed to load");
        if (!cancelled) setRows([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function cancelOne(id: string) {
    try {
      await reservationsApi.cancel(id);
      toast.success("Reservation cancelled");
      const list = await reservationsApi.mine();
      const withConcerts: Row[] = await Promise.all(
        list.map(async (r) => {
          try {
            const concert = await concertsApi.get(r.concertId);
            return { r, concert };
          } catch {
            return { r, concert: undefined };
          }
        }),
      );
      setRows(withConcerts);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Could not cancel");
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl w-full mx-auto">
        <h1 className="text-2xl font-semibold text-foreground">My tickets</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One active seat per show; cancel to release your hold.
        </p>
        <ul className="mt-6 space-y-3">
          {rows === null && (
            <li className="h-20 rounded border border-border bg-muted/30 animate-pulse" />
          )}
          {rows &&
            rows.map(({ r, concert }) => (
              <li
                key={r.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-border p-4"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {concert?.name ?? "Concert (loading…)"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Status: {r.status} · {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
                {r.status === "active" && (
                  <button
                    type="button"
                    onClick={() => void cancelOne(r.id)}
                    className="h-9 px-3 rounded-md border border-border text-sm hover:bg-accent w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                )}
              </li>
            ))}
        </ul>
        {rows && rows.length === 0 && (
          <p className="text-sm text-muted-foreground">No reservations yet.</p>
        )}
    </div>
  );
}
