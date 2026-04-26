"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/services";
import { concertsApi, type ConcertListItem } from "@/services/concerts.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AdminConcertsPage() {
  const [list, setList] = useState<ConcertListItem[] | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [totalSeats, setTotalSeats] = useState(100);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ConcertListItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setList(await concertsApi.list());
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Load failed");
      setList([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const metrics = useMemo(() => {
    if (!list || list.length === 0) {
      return { listings: 0, reserved: 0, soldOut: 0 };
    }
    return {
      listings: list.length,
      reserved: list.reduce((a, c) => a + c.reservedCount, 0),
      soldOut: list.filter((c) => c.soldOut).length,
    };
  }, [list]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await concertsApi.create({ name, description, totalSeats });
      toast.success("Concert created");
      setName("");
      setDescription("");
      setTotalSeats(100);
      void load();
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
      <h1 className="text-xl font-semibold text-foreground">Manage concerts</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Create and remove listings. Use seed accounts or register for user flows.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Listings</p>
          <p className="mt-1 text-2xl font-semibold text-foreground tabular-nums">
            {list ? metrics.listings : "—"}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Seats booked</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-emerald-600">
            {list ? metrics.reserved : "—"}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Sold out shows</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-destructive">
            {list ? metrics.soldOut : "—"}
          </p>
        </div>
      </div>

      <form
        onSubmit={onCreate}
        className="mt-8 space-y-3 rounded-lg border border-border p-4 bg-card"
      >
        <p className="text-sm font-medium text-foreground">Create</p>
        <div>
          <label className="text-sm font-medium" htmlFor="n">
            Name
          </label>
          <input
            id="n"
            className="mt-1 w-full h-9 px-2 rounded border border-border bg-background text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="d">
            Description
          </label>
          <textarea
            id="d"
            className="mt-1 w-full min-h-[88px] px-2 py-1.5 rounded border border-border bg-background text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="s">
            Total seats
          </label>
          <input
            id="s"
            type="number"
            min={1}
            className="mt-1 w-full max-w-[12rem] h-9 px-2 rounded border border-border bg-background text-sm"
            value={totalSeats}
            onChange={(e) => setTotalSeats(Number(e.target.value))}
          />
        </div>
        <Button type="submit" disabled={saving} className="h-9">
          {saving ? "Saving…" : "Create concert"}
        </Button>
      </form>

      <h2 className="mt-10 text-sm font-semibold text-foreground">Current listings</h2>
      <ul className="mt-3 space-y-2">
        {list === null && <li className="h-10 bg-muted/40 rounded animate-pulse" />}
        {list &&
          list.map((c) => (
            <li
              key={c.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2 border-b border-border"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {c.description}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {c.remainingSeats}/{c.totalSeats} left · {c.reservedCount} active holds
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="text-destructive border-destructive/30 w-full sm:w-auto"
                onClick={() => setDeleteTarget(c)}
              >
                Delete
              </Button>
            </li>
          ))}
      </ul>
      {list && list.length === 0 && (
        <p className="text-sm text-muted-foreground mt-2">No concerts yet.</p>
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
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
            >
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
