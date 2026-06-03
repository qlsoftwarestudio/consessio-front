import { Copy, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { PriorityBadge } from "./PriorityBadge";
import { formatPhone } from "@/shared/utils/format";
import type { ApiCopilotNextAction } from "@/shared/api/types";

interface Props {
  actions: ApiCopilotNextAction[];
}

const copyToClipboard = (text?: string) => {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    toast({ title: "Mensaje copiado al portapapeles" });
  });
};

const waLink = (phone?: string, message?: string) => {
  if (!phone) return undefined;
  const clean = phone.replace(/\D/g, "");
  const withPrefix = clean.startsWith("54") ? clean : `54${clean}`;
  const encoded = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${withPrefix}${encoded ? `?text=${encoded}` : ""}`;
};

export const NextActionsList = ({ actions }: Props) => (
  <ul className="space-y-3">
    {actions.map((action) => {
      const link = waLink(action.phone, action.suggestedMessage);
      return (
        <li
          key={`${action.leadId}-${action.action}`}
          className="rounded-lg border border-border/60 bg-surface-1/40 p-3 transition-colors hover:border-primary/30"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{action.fullName}</span>
                <PriorityBadge priority={action.priority} />
              </div>
              <p className="mt-1 text-xs text-primary">{action.action}</p>
              {action.suggestedMessage && (
                <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                  {action.suggestedMessage}
                </p>
              )}
            </div>
            <div className="flex shrink-0 gap-1">
              {action.suggestedMessage && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copyToClipboard(action.suggestedMessage)}
                  title="Copiar mensaje"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              )}
              {link && (
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Abrir WhatsApp">
                  <a href={link} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-3.5 w-3.5 text-success" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </li>
      );
    })}
  </ul>
);
