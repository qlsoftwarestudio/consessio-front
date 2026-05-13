import { VEHICLE_STATUS_LABEL } from "@/shared/constants/domain";
import type { VehicleStatus } from "@/shared/types/domain";
import { cn } from "@/lib/utils";

const COLORS: Record<VehicleStatus, string> = {
  disponible: "bg-success/15 text-success ring-success/30",
  reservado: "bg-warning/15 text-warning ring-warning/30",
  vendido: "bg-muted text-muted-foreground ring-border",
};

export const VehicleStatusBadge = ({ status, className }: { status: VehicleStatus; className?: string }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
      COLORS[status],
      className,
    )}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {VEHICLE_STATUS_LABEL[status]}
  </span>
);
