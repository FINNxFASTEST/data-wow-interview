"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminSubnav } from "@/components/admin/AdminSubnav";
import { Nav } from "@/components/common/Nav";
import { Footer } from "@/components/common/Footer";
import { ApiError } from "@/services";
import { concertsApi, type ConcertListItem } from "@/services/concerts.service";

export default function AdminConcertsPage() {
  const [list, setList] = useState<ConcertListItem[] | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [totalSeats, setTotalSeats] = useState(100);
  const [saving, setSaving] = useState(false);

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

  async function onDelete(id: string) {
    if (!confirm("Delete this concert? Reservations for it will be removed too.")) return;
    try {
      await concertsApi.remove(id);
      toast.success("Deleted");
      void load();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Delete failed");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <AdminSubnav />
      <div className="p-4 md:p-8 max-w-3xl w-full mx-auto">
        <h1 className="text-xl font-semibold text-foreground">Manage concerts</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create and remove listings. Use seed accounts or register for user flows.
        </p>
        <form
          onSubmit={onCreate}
          className="mt-6 space-y-3 rounded-lg border border-border p-4 bg-card"
        >
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
          <button
            type="submit"
            disabled={saving}
            className="h-9 px-4 rounded-md bg-foreground text-background text-sm font-medium disabled:opacity-50"
          >
            {saving ? "Saving…" : "Create concert"}
          </button>
        </form>
        <h2 className="mt-10 text-sm font-semibold text-foreground">Current listings</h2>
        <ul className="mt-3 space-y-2">
          {list === null && (
            <li className="h-10 bg-muted/40 rounded animate-pulse" />
          )}
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
                </div>
                <button
                  type="button"
                  onClick={() => void onDelete(c.id)}
                  className="text-sm h-8 px-3 rounded border border-destructive/30 text-destructive hover:bg-destructive/5 w-full sm:w-auto"
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
        {list && list.length === 0 && (
          <p className="text-sm text-muted-foreground mt-2">No concerts yet.</p>
        )}
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
