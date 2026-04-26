"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminSubnav } from "@/components/admin/AdminSubnav";
import { Nav } from "@/components/common/Nav";
import { Footer } from "@/components/common/Footer";
import { ApiError } from "@/services";
import {
  reservationsApi,
  type AuditReservationItem,
} from "@/services/reservations.service";

export default function AdminAuditPage() {
  const [rows, setRows] = useState<AuditReservationItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await reservationsApi.audit();
        if (!cancelled) setRows(data);
      } catch (e) {
        toast.error(e instanceof ApiError ? e.message : "Failed to load audit");
        if (!cancelled) setRows([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <AdminSubnav />
      <div className="p-4 md:p-8 max-w-5xl w-full mx-auto overflow-x-auto">
        <h1 className="text-xl font-semibold text-foreground">Reservation audit</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Every booking and cancellation across all users and concerts.
        </p>
        <table className="mt-6 w-full text-sm border-collapse min-w-[640px]">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border">
              <th className="py-2 pr-2 font-medium">When</th>
              <th className="py-2 pr-2 font-medium">User</th>
              <th className="py-2 pr-2 font-medium">Concert</th>
              <th className="py-2 pr-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows === null && (
              <tr>
                <td colSpan={4} className="py-6">
                  <div className="h-8 bg-muted/40 rounded animate-pulse" />
                </td>
              </tr>
            )}
            {rows &&
              rows.map((r) => (
                <tr key={r.id} className="border-b border-border/60">
                  <td className="py-2 pr-2 text-muted-foreground whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 pr-2">
                    {r.userEmail ?? r.userId}
                  </td>
                  <td className="py-2 pr-2">{r.concertName}</td>
                  <td className="py-2 pr-2">
                    <span
                      className={
                        r.status === "active"
                          ? "text-emerald-600"
                          : "text-muted-foreground"
                      }
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {rows && rows.length === 0 && (
          <p className="text-sm text-muted-foreground mt-4">No rows yet.</p>
        )}
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
