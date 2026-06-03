import { cn } from "@/lib/utils";
import type { ApiCopilotPriority } from "@/shared/api/types";

interface Props {
  priority: ApiCopilotPriority;
}

const LABEL: Record<ApiCopilotPriority, string> = {
  ALTA: "Alta",
  MEDIA: "Media",
  BAJA: "Baja",
};

const TONE: Record<ApiCopilotPriority, string> = {
  ALTA: "bg-destructive/15 text-destructive ring-destructive/30",
  MEDIA: "bg-amber-500/15 text-amber-600 ring-amber-500/30",
  BAJA: "bg-muted text-muted-foreground ring-muted",
};

export const PriorityBadge = ({ priority }: Props) => (
  <span
    className={cn(
      "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset",
      TONE[priority],
    )}
  >
    {LABEL[priority]}
  </span>
);
