import { Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/constants/domain";
import { formatPhone } from "@/shared/utils/format";
import { ScoreBadge } from "./ScoreBadge";
import type { ApiCopilotHotLead } from "@/shared/api/types";

interface Props {
  leads: ApiCopilotHotLead[];
}

export const HotLeadsTable = ({ leads }: Props) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border/60 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <th className="pb-2 pr-2">Score</th>
          <th className="pb-2 pr-2">Lead</th>
          <th className="pb-2 pr-2 hidden md:table-cell">Etapa</th>
          <th className="pb-2 pr-2 hidden lg:table-cell">Razón</th>
          <th className="pb-2">Acción sugerida</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border/40">
        {leads.map((lead) => (
          <tr key={lead.leadId} className="group hover:bg-surface-1/40">
            <td className="py-2.5 pr-2">
              <ScoreBadge score={lead.score} />
            </td>
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
            <td className="py-2.5 pr-2 hidden lg:table-cell text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Flame className="h-3 w-3 text-amber-500" />
                {lead.reason}
              </span>
            </td>
            <td className="py-2.5 text-xs text-primary">{lead.suggestedAction}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
