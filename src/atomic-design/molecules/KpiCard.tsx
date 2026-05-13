import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; positive?: boolean };
  accent?: boolean;
}

export const KpiCard = ({ label, value, icon: Icon, trend, accent }: Props) => (
  <div
    className={cn(
      "glass relative overflow-hidden rounded-xl p-5 transition-all hover:border-primary/40",
      accent && "ring-1 ring-primary/30",
    )}
  >
    {accent && (
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
    )}
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-2 font-display text-3xl font-bold tracking-tight">{value}</p>
        {trend && (
          <p
            className={cn(
              "mt-2 inline-flex items-center gap-1 text-xs font-medium",
              trend.positive ? "text-success" : "text-destructive",
            )}
          >
            {trend.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend.value}% vs mes anterior
          </p>
        )}
      </div>
      <div
        className={cn(
          "grid h-11 w-11 place-items-center rounded-lg",
          accent ? "bg-gradient-gold text-primary-foreground shadow-amber" : "bg-surface-2 text-primary",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);
