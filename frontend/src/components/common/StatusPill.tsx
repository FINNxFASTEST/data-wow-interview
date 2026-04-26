import { cn } from "@/lib/utils";

type StatusType =
  | "Paid"
  | "Pending"
  | "Cancel"
  | "Active"
  | "Paused"
  | "Full"
  | "Draft"
  | "Expired";

interface StatusPillProps {
  status: StatusType;
}

const STATUS_MAP: Record<StatusType, { className: string; label: string }> = {
  Paid: {
    className: "bg-theme-status-success-bg text-theme-status-success-fg",
    label: "Paid",
  },
  Pending: {
    className: "bg-theme-status-warn-bg text-theme-status-warn-fg",
    label: "Pending",
  },
  Cancel: {
    className: "bg-theme-status-danger-bg text-theme-status-danger-fg",
    label: "Cancelled",
  },
  Active: {
    className: "bg-theme-status-success-bg text-theme-status-success-fg",
    label: "● Active",
  },
  Paused: {
    className: "bg-theme-status-muted-bg text-theme-status-muted-fg",
    label: "Paused",
  },
  Full: {
    className: "bg-theme-status-alert-bg text-theme-status-alert-fg",
    label: "Full",
  },
  Draft: {
    className: "bg-theme-status-muted-bg text-theme-status-muted-fg",
    label: "Draft",
  },
  Expired: {
    className: "bg-theme-status-danger-bg text-theme-status-danger-fg",
    label: "Expired",
  },
};

export function StatusPill({ status }: StatusPillProps) {
  const m = STATUS_MAP[status] ?? STATUS_MAP.Paused;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium",
        m.className,
      )}
    >
      {m.label}
    </span>
  );
}
