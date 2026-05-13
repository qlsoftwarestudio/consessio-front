import { LEAD_STATUS_LABEL } from "@/shared/constants/domain";
import type { LeadStatus } from "@/shared/types/domain";
import { cn } from "@/lib/utils";

const COLORS: Record<LeadStatus, string> = {
  new: "bg-status-new/15 text-status-new ring-status-new/30",
  contacted: "bg-status-contacted/15 text-status-contacted ring-status-contacted/30",
  qualified: "bg-status-qualified/15 text-status-qualified ring-status-qualified/30",
  "test-drive": "bg-status-test-drive/15 text-status-test-drive ring-status-test-drive/30",
  quoted: "bg-status-quoted/15 text-status-quoted ring-status-quoted/30",
  won: "bg-status-won/15 text-status-won ring-status-won/30",
  lost: "bg-status-lost/15 text-status-lost ring-status-lost/30",
};

interface Props {
  status: LeadStatus;
  className?: string;
}

export const LeadStatusBadge = ({ status, className }: Props) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
      COLORS[status],
      className,
    )}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {LEAD_STATUS_LABEL[status]}
  </span>
);
