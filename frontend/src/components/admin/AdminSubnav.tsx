import Link from "next/link";

export function AdminSubnav() {
  return (
    <div className="border-b border-border bg-muted/30">
      <div className="mx-auto max-w-6xl flex flex-wrap gap-1 px-4 md:px-6 py-2 text-sm">
        <span className="text-muted-foreground mr-2">Admin</span>
        <Link
          href="/admin/concerts"
          className="px-2 py-0.5 rounded text-foreground hover:bg-accent no-underline"
        >
          Concerts
        </Link>
        <Link
          href="/admin/audit"
          className="px-2 py-0.5 rounded text-foreground hover:bg-accent no-underline"
        >
          Audit
        </Link>
      </div>
    </div>
  );
}
