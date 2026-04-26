"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/services";
import {
  reservationsApi,
  type AuditReservationItem,
} from "@/services/reservations.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">
      <h1 className="text-xl font-semibold text-foreground">History</h1>
      <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
        Full reservation log: account, show, and status. Auditors can reconcile
        against concert inventory.
      </p>

      <div className="mt-6 rounded-md border border-border bg-card min-w-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">No.</TableHead>
              <TableHead>When</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Concert</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows === null && (
              <TableRow>
                <TableCell colSpan={6} className="h-20">
                  <div className="h-8 max-w-sm bg-muted/40 rounded animate-pulse" />
                </TableCell>
              </TableRow>
            )}
            {rows &&
              rows.map((r, i) => (
                <TableRow key={r.id}>
                  <TableCell className="text-center text-muted-foreground tabular-nums">
                    {i + 1}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {new Date(r.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {r.userEmail ?? r.userId}
                  </TableCell>
                  <TableCell>{r.concertName}</TableCell>
                  <TableCell>
                    {r.status === "active" ? (
                      <Badge
                        variant="default"
                        className="bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border-0"
                      >
                        {r.status}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">{r.status}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-xs">
                    —
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      {rows && rows.length === 0 && (
        <p className="text-sm text-muted-foreground mt-4">No rows yet.</p>
      )}
    </div>
  );
}
