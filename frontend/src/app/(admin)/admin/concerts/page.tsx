"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Award, Save, Trash2, User, XCircle } from "lucide-react";
import { ApiError } from "@/services";
import { concertsApi, type ConcertListItem } from "@/services/concerts.service";
import {
  reservationsApi,
  type AuditReservationItem,
} from "@/services/reservations.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TabId = "overview" | "create";

export default function AdminConcertsPage() {
  const [list, setList] = useState<ConcertListItem[] | null>(null);
  const [audit, setAudit] = useState<AuditReservationItem[] | null>(null);
  const [tab, setTab] = useState<TabId>("overview");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [totalSeats, setTotalSeats] = useState(100);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ConcertListItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const [concerts, auditRows] = await Promise.all([
        concertsApi.list(),
        reservationsApi.audit(),
      ]);
      setList(concerts);
      setAudit(auditRows);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Load failed");
      setList([]);
      setAudit([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const metrics = useMemo(() => {
    const cancelled = audit?.filter((r) => r.status === "cancelled").length ?? 0;
    if (!list || list.length === 0) {
      return { totalSeats: 0, reserved: 0, cancelled };
    }
    return {
      totalSeats: list.reduce((a, c) => a + c.totalSeats, 0),
      reserved: list.reduce((a, c) => a + c.reservedCount, 0),
      cancelled,
    };
  }, [list, audit]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await concertsApi.create({ name, description, totalSeats });
      toast.success("Create successfully");
      setName("");
      setDescription("");
      setTotalSeats(100);
      void load();
      setTab("overview");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await concertsApi.remove(deleteTarget.id);
      toast.success("Deleted");
      setDeleteTarget(null);
      void load();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-4 md:p-8 w-full max-w-4xl mx-auto">
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <li>Admin</li>
          <li className="text-border select-none" aria-hidden>
            /
          </li>
          <li>Home</li>
          <li className="text-border select-none" aria-hidden>
            /
          </li>
          <li className="font-medium text-foreground">
            {tab === "overview" ? "Overview" : "Create"}
          </li>
        </ol>
      </nav>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="admin-stat-card admin-stat-card--blue rounded-lg p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium opacity-90">Total of seats</p>
            <User className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
          </div>
          <p className="mt-2 text-3xl font-bold tabular-nums">{list ? metrics.totalSeats : "—"}</p>
        </div>
        <div className="admin-stat-card admin-stat-card--green rounded-lg p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium opacity-90">Reserve</p>
            <Award className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
          </div>
          <p className="mt-2 text-3xl font-bold tabular-nums">{list ? metrics.reserved : "—"}</p>
        </div>
        <div className="admin-stat-card admin-stat-card--red rounded-lg p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium opacity-90">Cancel</p>
            <XCircle className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
          </div>
          <p className="mt-2 text-3xl font-bold tabular-nums">
            {list && audit !== null ? metrics.cancelled : "—"}
          </p>
        </div>
      </div>

      <div className="mt-8 flex gap-8 border-b border-border">
        <button
          type="button"
          onClick={() => setTab("overview")}
          className={cn(
            "-mb-px border-b-2 border-transparent pb-2 text-sm font-medium transition-colors",
            tab === "overview"
              ? "border-primary text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setTab("create")}
          className={cn(
            "-mb-px border-b-2 border-transparent pb-2 text-sm font-medium transition-colors",
            tab === "create"
              ? "border-primary text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Create
        </button>
      </div>

      {tab === "create" && (
        <form
          onSubmit={onCreate}
          className="mt-6 space-y-4 rounded-lg border border-border bg-card p-5 shadow-sm md:p-6"
        >
          <h2 className="text-2xl font-semibold text-theme-primary">Create</h2>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <div className="min-w-0 w-full">
              <label className="text-sm font-medium text-foreground" htmlFor="n">
                Concert Name
              </label>
              <input
                id="n"
                className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Please input concert name"
                required
              />
            </div>
            <div className="min-w-0 w-full">
              <label className="text-sm font-medium text-foreground" htmlFor="s">
                Total of seat
              </label>
              <div className="relative mt-1.5">
                <input
                  id="s"
                  type="number"
                  min={1}
                  className="h-10 w-full min-w-0 rounded-md border border-border bg-background pr-10 pl-3 text-sm text-foreground tabular-nums"
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(Number(e.target.value))}
                />
                <User
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="d">
              Description
            </label>
            <textarea
              id="d"
              className="mt-1.5 w-full min-h-[120px] resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please input description"
              required
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={saving} className="gap-2">
              <Save className="h-4 w-4" aria-hidden />
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      )}

      {tab === "overview" && (
        <div className="mt-6">
          <ul className="space-y-3">
            {list === null && (
              <li className="h-32 rounded-lg border border-border bg-card animate-pulse" />
            )}
            {list &&
              list.map((c) => (
                <li
                  key={c.id}
                  className="rounded-lg border border-border bg-card p-4 shadow-sm"
                >
                  <p className="text-xl font-semibold text-primary">{c.name}</p>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                  <div className="mt-4 flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <User
                        className="h-4 w-4 shrink-0 text-muted-foreground"
                        aria-hidden
                      />
                      <span className="font-medium tabular-nums">{c.totalSeats}</span>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="w-full gap-1.5 sm:w-auto"
                      onClick={() => setDeleteTarget(c)}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
          </ul>
          {list && list.length === 0 && (
            <p className="text-sm text-muted-foreground">No concerts yet.</p>
          )}
        </div>
      )}

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(o) => {
          if (!o) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete concert?</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `"${deleteTarget.name}" will be removed. All reservations for this concert will be removed too.`
                : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={() => void confirmDelete()}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
