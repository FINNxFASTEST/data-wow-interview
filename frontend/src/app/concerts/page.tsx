"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Nav } from "@/components/common/Nav";
import { Footer } from "@/components/common/Footer";
import { ApiError } from "@/services";
import { concertsApi, type ConcertListItem } from "@/services/concerts.service";

export default function ConcertsListPage() {
  const [items, setItems] = useState<ConcertListItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await concertsApi.list();
        if (!cancelled) setItems(data);
      } catch (e) {
        toast.error(e instanceof ApiError ? e.message : "Could not load concerts");
        if (!cancelled) setItems([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />
      <main className="flex-1 mx-auto max-w-6xl w-full px-4 md:px-6 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
          Concerts
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl">
          Available seats and sold-out state update from live reservation counts.
        </p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items === null &&
            [1, 2, 3].map((i) => (
              <li
                key={i}
                className="h-36 rounded-lg border border-border bg-muted/30 animate-pulse"
              />
            ))}
          {items &&
            items.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/concerts/${c.id}`}
                  className="block rounded-lg border border-border p-4 bg-card hover:bg-accent/30 transition-colors no-underline h-full"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-medium text-foreground pr-2">
                      {c.name}
                    </h2>
                    <span
                      className={
                        c.soldOut
                          ? "shrink-0 text-xs font-medium text-destructive"
                          : "shrink-0 text-xs font-medium text-emerald-600"
                      }
                    >
                      {c.soldOut ? "Sold out" : "Open"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {c.description}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {c.remainingSeats} / {c.totalSeats} seats left
                  </p>
                </Link>
              </li>
            ))}
        </ul>
        {items && items.length === 0 && (
          <p className="mt-6 text-sm text-muted-foreground">
            No concerts yet. An admin can add listings from the admin area.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
