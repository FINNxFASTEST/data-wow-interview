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
  Paid:    { className: "bg-[#C7D1B8] text-forest-900", label: "Paid" },
  Pending: { className: "bg-[#F3DCB2] text-[#8B5A2A]",  label: "Pending" },
  Cancel:  { className: "bg-[#EADBD3] text-ember-dark",  label: "Cancelled" },
  Active:  { className: "bg-[#C7D1B8] text-forest-900", label: "● Active" },
  Paused:  { className: "bg-[#E7E4D8] text-forest-600", label: "Paused" },
  Full:    { className: "bg-[#F3C5A8] text-[#8B3E1A]",  label: "Full" },
  Draft:   { className: "bg-[#E7E4D8] text-forest-600", label: "Draft" },
  Expired: { className: "bg-[#EADBD3] text-ember-dark",  label: "Expired" },
};

export function StatusPill({ status }: StatusPillProps) {
  const m = STATUS_MAP[status] ?? STATUS_MAP.Paused;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-thai font-medium",
        m.className
      )}
    >
      {m.label}
    </span>
  );
}
