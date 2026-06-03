import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/constants/domain";
import { formatPhone } from "@/shared/utils/format";
import { cn } from "@/lib/utils";
import type { ApiCopilotAbandonedLead } from "@/shared/api/types";

interface Props {
  leads: ApiCopilotAbandonedLead[];
}

export const AbandonedLeadsTable = ({ leads }: Props) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border/60 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <th className="pb-2 pr-2">Lead</th>
          <th className="pb-2 pr-2 hidden md:table-cell">Etapa</th>
          <th className="pb-2 pr-2">Sin contacto</th>
          <th className="pb-2 hidden lg:table-cell">Acción sugerida</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border/40">
        {leads.map((lead) => (
          <tr key={lead.leadId} className="hover:bg-surface-1/40">
            <td className="py-2.5 pr-2">
              <Link
                to={ROUTES.leadDetail(String(lead.leadId))}
                className="font-medium text-foreground hover:text-primary"
              >
                {lead.fullName}
              </Link>
              <p className="text-[11px] text-muted-foreground">{formatPhone(lead.phone)}</p>
            </td>
            <td className="py-2.5 pr-2 hidden md:table-cell capitalize text-muted-foreground">
              {lead.status}
            </td>
            <td className="py-2.5 pr-2">
              <span
                className={cn(
                  "inline-flex rounded px-1.5 py-0.5 text-[11px] font-semibold",
                  lead.daysSinceLastContact >= 10
                    ? "bg-destructive/15 text-destructive"
                    : lead.daysSinceLastContact >= 7
                    ? "bg-amber-500/15 text-amber-600"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {lead.daysSinceLastContact} días
              </span>
            </td>
            <td className="py-2.5 hidden lg:table-cell text-xs text-primary">
              {lead.suggestedAction}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
