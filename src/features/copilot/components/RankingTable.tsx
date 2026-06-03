import { Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatARS, formatNumber } from "@/shared/utils/format";
import type { ApiCopilotRankingItem } from "@/shared/api/types";

interface Props {
  items: ApiCopilotRankingItem[];
}

const Rank = ({ position }: { position: number }) => {
  if (position === 1)
    return <Medal className="h-5 w-5 text-amber-500" />;
  if (position === 2)
    return <Medal className="h-5 w-5 text-slate-400" />;
  if (position === 3)
    return <Medal className="h-5 w-5 text-amber-700" />;
  return <span className="inline-block w-5 text-center text-xs text-muted-foreground">{position}</span>;
};

export const RankingTable = ({ items }: Props) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border/60 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <th className="pb-2 pr-2">#</th>
          <th className="pb-2 pr-2">Vendedora</th>
          <th className="pb-2 pr-2 text-right">Leads</th>
          <th className="pb-2 pr-2 text-right hidden sm:table-cell">Actividad</th>
          <th className="pb-2 pr-2 text-right">Ventas</th>
          <th className="pb-2 pr-2 text-right hidden md:table-cell">Conversión</th>
          <th className="pb-2 text-right">Revenue</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border/40">
        {items.map((item, i) => (
          <tr
            key={item.userId}
            className={cn(
              "hover:bg-surface-1/40",
              i < 3 && "bg-gradient-gold/5",
            )}
          >
            <td className="py-2.5 pr-2">
              <Rank position={i + 1} />
            </td>
            <td className="py-2.5 pr-2 font-medium">{item.name}</td>
            <td className="py-2.5 pr-2 text-right tabular-nums">{formatNumber(item.leadsAssigned)}</td>
            <td className="py-2.5 pr-2 text-right tabular-nums hidden sm:table-cell">
              {formatNumber(item.activitiesCount)}
            </td>
            <td className="py-2.5 pr-2 text-right tabular-nums">{formatNumber(item.sales)}</td>
            <td className="py-2.5 pr-2 text-right tabular-nums hidden md:table-cell">
              {item.conversionRate.toFixed(1)}%
            </td>
            <td className="py-2.5 text-right tabular-nums font-medium text-success">
              {formatARS(item.revenue)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
